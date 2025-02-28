import { Router } from 'express';
import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import Event from '../models/event.model';
import { auth, AuthRequest, adminOrOwnerAuth } from '../middleware/auth.middleware';
import logger from '../utils/logger';
import { AppError } from '../utils/errors';
import ExcelJS from 'exceljs';

// Extend AuthRequest to include model
declare module '../middleware/auth.middleware' {
  interface AuthRequest {
    model?: any;
  }
}

const router = Router();
const CACHE_EXPIRATION = 3600; // 1 hour

// Create event
router.post('/', auth, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user?.id) {
      throw new AppError('User not authenticated', 401);
    }

    // Check if user is admin
    if (req.user.role !== 'admin') {
      throw new AppError('Only admin users can create events', 403);
    }

    const eventData = {
      ...req.body,
      organizer: req.user.id,
      date: new Date(req.body.date),
      analytics: {
        dailyViews: [],
        registrationDates: []
      },
      clicks: 0,
      attendees: []
    };

    const event = await Event.create(eventData);
    
    // Populate organizer information
    const populatedEvent = await Event.findById(event._id)
      .populate('organizer', 'name avatar')
      .lean();

    res.status(201).json({ success: true, data: populatedEvent });
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
router.get('/:id', auth, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid event ID', 400);
    }

    // Get user ID from token if available
    const token = req.headers.authorization?.split(' ')[1];
    let userId = null;
    
    if (token) {
      try {
        const decoded = jwt.verify(token, config.jwtSecret) as { id: string };
        userId = decoded.id;
      } catch (error) {
        // Token invalid, but we'll still show the event
        logger.warn('Invalid token in event view:', error);
      }
    }

    const event = await Event.findById(id)
      .populate('organizer', 'name avatar')
      .lean();

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    // Increment view count
    await Event.findByIdAndUpdate(id, { $inc: { clicks: 1 } });

    // Add today to analytics if not already there
    const today = new Date().toISOString().split('T')[0];
    await Event.findByIdAndUpdate(
      id,
      {
        $push: {
          'analytics.dailyViews': {
            date: today,
            count: 1
          }
        }
      },
      { upsert: true }
    );

    // Check if user is registered
    let isRegistered = false;
    if (userId) {
      isRegistered = event.attendees.some(
        (attendee: any) => attendee.user?.toString() === userId
      );
    }

    const eventWithRegistrationStatus = {
      ...event,
      isRegistered
    };

    res.json({ success: true, data: eventWithRegistrationStatus });
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

    // Attach the model to the request for the adminOrOwnerAuth middleware
    req.model = Event;
    
    // Use the adminOrOwnerAuth middleware with 'organizer' field
    await adminOrOwnerAuth(req, res, async () => {
      await Event.findByIdAndDelete(id);
      res.json({ success: true, message: 'Event deleted successfully' });
    }, 'organizer'); // Note: using 'organizer' as the owner field
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

    // Check if user is already registered using the same method as GET route
    const isAlreadyRegistered = event.attendees.map(id => id.toString()).includes(req.user?.id);

    // If already registered, just return success with current status
    if (isAlreadyRegistered) {
      return res.json({ 
        success: true, 
        message: 'Already registered for event',
        data: {
          isUserRegistered: true,
          registrations: event.registrations
        }
      });
    }

    if (event.capacity && event.attendees.length >= event.capacity) {
      throw new AppError('Event is at full capacity', 400);
    }

    // Update event with new registration
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        $inc: { registrations: 1 },
        $push: { 
          attendees: req.user?.id,
          'analytics.registrationDates': {
            date: new Date(),
            count: 1
          }
        }
      },
      { new: true }
    );

    if (!updatedEvent) {
      throw new AppError('Failed to update event', 500);
    }

    // Return updated registration status
    res.json({ 
      success: true, 
      message: 'Successfully registered for event',
      data: {
        isUserRegistered: true,
        registrations: updatedEvent.registrations
      }
    });
  } catch (error) {
    next(error);
  }
});

// Unregister from event
router.post('/:id/unregister', auth, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid event ID', 400);
    }

    const event = await Event.findById(id);
    if (!event) {
      throw new AppError('Event not found', 404);
    }

    // Check if user is registered
    const isRegistered = event.attendees.map(id => id.toString()).includes(req.user?.id);

    if (!isRegistered) {
      return res.json({ 
        success: true, 
        message: 'Not registered for this event',
        data: {
          isUserRegistered: false,
          registrations: event.registrations
        }
      });
    }

    // Update event to remove registration
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        $inc: { registrations: -1 },
        $pull: { 
          attendees: req.user?.id
        }
      },
      { new: true }
    );

    if (!updatedEvent) {
      throw new AppError('Failed to update event', 500);
    }

    // Return updated registration status
    res.json({ 
      success: true, 
      message: 'Successfully unregistered from event',
      data: {
        isUserRegistered: false,
        registrations: updatedEvent.registrations
      }
    });
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