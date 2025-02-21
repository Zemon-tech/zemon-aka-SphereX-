import { Request, Response, NextFunction } from 'express';
import StoreItem from '../models/store.model';
import { AppError } from '../utils/errors';
import { setCache, getCache, clearCache } from '../utils/redis';
import logger from '../utils/logger';

const CACHE_EXPIRATION = 3600; // 1 hour

export const getAllStoreItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const category = req.query.category as string;
    const status = req.query.status || 'approved';

    const cacheKey = `store:${page}:${limit}:${category || 'all'}:${status}`;
    
    // Try to get from cache first
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.json({ success: true, data: cachedData });
    }

    // Build query
    const query: any = { status };
    if (category && category !== 'all') {
      query.category = category;
    }

    const skip = (page - 1) * limit;
    const items = await StoreItem.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name')
      .lean();

    const total = await StoreItem.countDocuments(query);

    const data = {
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };

    // Set cache
    await setCache(cacheKey, data, CACHE_EXPIRATION);
    res.json({ success: true, data });
  } catch (error) {
    logger.error('Error in getAllStoreItems:', error);
    next(error);
  }
};

export const getStoreItemDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const cacheKey = `store:item:${id}`;

    // Try to get from cache first
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.json({ success: true, data: cachedData });
    }

    const item = await StoreItem.findById(id)
      .populate('author', 'name')
      .lean();

    if (!item) {
      throw new AppError('Store item not found', 404);
    }

    // Increment views
    await StoreItem.findByIdAndUpdate(id, { $inc: { views: 1 } });

    // Set cache
    await setCache(cacheKey, item, CACHE_EXPIRATION);
    res.json({ success: true, data: item });
  } catch (error) {
    logger.error('Error in getStoreItemDetails:', error);
    next(error);
  }
};

export const addStoreItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newItem = await StoreItem.create({
      ...req.body,
      status: 'approved'
    });

    // Populate the author field
    const populatedItem = await newItem.populate('author', 'name');

    // Clear list cache
    await clearCache('store:*');

    res.status(201).json({ success: true, data: populatedItem });
  } catch (error) {
    logger.error('Error in addStoreItem:', error);
    next(error);
  }
};

export const addReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const item = await StoreItem.findById(id);
    if (!item) {
      throw new AppError('Store item not found', 404);
    }

    item.reviews.push({
      user_name: 'Anonymous',
      rating,
      comment,
      createdAt: new Date(),
    });

    await item.save();

    // Clear item cache
    await clearCache(`store:item:${id}`);

    res.json({ success: true, data: item });
  } catch (error) {
    logger.error('Error in addReview:', error);
    next(error);
  }
};

export const deleteStoreItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const item = await StoreItem.findById(id);

    if (!item) {
      throw new AppError('Store item not found', 404);
    }

    await StoreItem.deleteOne({ _id: id });

    // Clear caches
    await clearCache('store:*');
    await clearCache(`store:item:${id}`);

    res.json({ success: true, message: 'Store item deleted successfully' });
  } catch (error) {
    logger.error('Error in deleteStoreItem:', error);
    next(error);
  }
}; 