import { Router } from 'express';
import { Types } from 'mongoose';
import Event from '../models/event.model';
import { auth, AuthRequest } from '../middleware/auth.middleware';
import { setCache, getCache, deleteCache, clearCache } from '../utils/redis';
import logger from '../utils/logger';
import { AppError } from '../utils/errors';
import ExcelJS from 'exceljs';

const router = Router();
const CACHE_EXPIRATION = 3600; // 1 hour

// Create event
router.post('/', async (req, res, next) => {
  try {
    const eventData = {
      ...req.body,
      organizer: '65d8c25a3d96b6c594ad7d3c', // Temporary static organizer ID
      date: new Date(req.body.date),
      analytics: {
        dailyViews: [],
        registrationDates: []
      },
      clicks: 0,
      attendees: []
    };

    const event = await Event.create(eventData);
    
    // Add default organizer data for response
    const eventWithOrganizer = {
      ...event.toObject(),
      organizer: {
        name: 'Event Organizer',
        avatar: '/default-avatar.jpg'
      }
    };

    // Clear events list cache
    await deleteCache('events:list*');
    
    res.status(201).json({ success: true, data: eventWithOrganizer });
  } catch (error) {
    next(error);
  }
});

// Get all events with filters and pagination
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { city, type, rewards, startDate, endDate } = req.query;

    // Build query
    const query: any = {};
    if (city) query.location = new RegExp(city as string, 'i');
    if (type) query.type = type;
    if (rewards) query.rewards = new RegExp(rewards as string, 'i');
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    }

    console.log('Fetching events with query:', query);

    const skip = (page - 1) * limit;
    
    // First try to get events without population
    const events = await Event.find(query)
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    console.log('Found events:', events.length);

    // Then populate organizer separately with error handling
    const populatedEvents = await Promise.all(events.map(async (event) => {
      try {
        const organizer = await Event.populate(event, {
          path: 'organizer',
          select: 'name avatar'
        });
        return organizer;
      } catch (err) {
        // If population fails, return event with default organizer
        return {
          ...event,
          organizer: { name: 'Unknown', avatar: '/default-avatar.jpg' }
        };
      }
    }));

    const total = await Event.countDocuments(query);
    const data = {
      events: populatedEvents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };

    res.json({ success: true, data });
  } catch (error: any) {
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch events', 
      error: error.message,
      details: error.stack
    });
  }
});

// Get single event
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid event ID', 400);
    }

    const cacheKey = `events:${id}`;
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.json({ success: true, data: JSON.parse(cachedData) });
    }

    const event = await Event.findById(id).lean();

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    // Add default organizer data since we're not using User model yet
    const eventWithOrganizer = {
      ...event,
      organizer: {
        name: 'Event Organizer',
        avatar: '/default-avatar.jpg'
      }
    };

    // Update clicks
    await Event.findByIdAndUpdate(id, {
      $inc: { clicks: 1 },
      $push: {
        'analytics.dailyViews': {
          date: new Date(),
          count: 1
        }
      }
    });

    // Cache the result
    await setCache(cacheKey, JSON.stringify(eventWithOrganizer), CACHE_EXPIRATION);
    res.json({ success: true, data: eventWithOrganizer });
  } catch (error) {
    next(error);
  }
});

// Update event
router.put('/:id', auth, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid event ID', 400);
    }

    const event = await Event.findById(id);
    if (!event) {
      throw new AppError('Event not found', 404);
    }

    if (event.organizer.toString() !== req.user?.id) {
      throw new AppError('Not authorized to update this event', 403);
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { ...req.body, date: new Date(req.body.date) },
      { new: true }
    ).populate('organizer', 'name avatar');

    await clearCache(`events:${id}`);
    await clearCache('events:*');
    res.json({ success: true, data: updatedEvent });
  } catch (error) {
    next(error);
  }
});

// Delete event
router.delete('/:id', auth, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid event ID', 400);
    }

    const event = await Event.findById(id);
    if (!event) {
      throw new AppError('Event not found', 404);
    }

    if (event.organizer.toString() !== req.user?.id) {
      throw new AppError('Not authorized to delete this event', 403);
    }

    await Event.findByIdAndDelete(id);
    await clearCache(`events:${id}`);
    await clearCache('events:*');
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Register for event
router.post('/:id/register', auth, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid event ID', 400);
    }

    const event = await Event.findById(id);
    if (!event) {
      throw new AppError('Event not found', 404);
    }

    if (event.attendees.includes(req.user?.id)) {
      throw new AppError('Already registered for this event', 400);
    }

    if (event.capacity && event.attendees.length >= event.capacity) {
      throw new AppError('Event is at full capacity', 400);
    }

    await Event.findByIdAndUpdate(id, {
      $inc: { registrations: 1 },
      $push: { 
        attendees: req.user?.id,
        'analytics.registrationDates': {
          date: new Date(),
          count: 1
        }
      }
    });

    await clearCache(`events:${id}`);
    res.json({ success: true, message: 'Successfully registered for event' });
  } catch (error) {
    next(error);
  }
});

// Export events to Excel
router.get('/export/excel', auth, async (req: AuthRequest, res, next) => {
  try {
    const events = await Event.find()
      .populate('organizer', 'name')
      .lean();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Events');

    // Add headers
    worksheet.columns = [
      { header: 'Title', key: 'title', width: 30 },
      { header: 'Description', key: 'description', width: 50 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Time', key: 'time', width: 10 },
      { header: 'Location', key: 'location', width: 30 },
      { header: 'Type', key: 'type', width: 15 },
      { header: 'Organizer', key: 'organizer', width: 20 },
      { header: 'Registrations', key: 'registrations', width: 15 },
      { header: 'Clicks', key: 'clicks', width: 10 },
      { header: 'Created At', key: 'createdAt', width: 20 }
    ];

    // Add rows
    events.forEach(event => {
      worksheet.addRow({
        title: event.title,
        description: event.description,
        date: new Date(event.date).toLocaleDateString(),
        time: event.time,
        location: event.location,
        type: event.type,
        organizer: event.organizer.name,
        registrations: event.registrations,
        clicks: event.clicks,
        createdAt: new Date(event.createdAt).toLocaleString()
      });
    });

    // Style the header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=events-export.xlsx'
    );

    await workbook.xlsx.write(res);
  } catch (error) {
    next(error);
  }
});

export default router; 