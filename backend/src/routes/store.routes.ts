import { Router } from 'express';
import {
  getAllStoreItems,
  getStoreItemDetails,
  addStoreItem,
  addReview,
  deleteStoreItem,
} from '../controllers/store.controller';
import { validateStoreItem, validateReview } from '../validators/store.validator';
import { auth } from '../middleware/auth.middleware';
import { AuthRequest } from '../middleware/auth.middleware';
import Store from '../models/store.model';
import { AppError } from '../utils/errors';
import { Types } from 'mongoose';
import { clearCache } from '../utils/redis';

const router = Router();

// Middleware to validate store item
const validateStoreItemMiddleware = (req: AuthRequest, res: any, next: any) => {
  try {
    const errors = validateStoreItem(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }
    // Add author from authenticated user
    req.body.author = req.user?.id;
    next();
  } catch (error) {
    console.error('Validation error:', error);
    return res.status(400).json({ 
      success: false, 
      message: 'Validation failed',
      errors: error instanceof Error ? [error.message] : ['Unknown validation error']
    });
  }
};

// Middleware to validate review
const validateReviewMiddleware = (req: AuthRequest, res: any, next: any) => {
  try {
    const errors = validateReview(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }
    next();
  } catch (error) {
    console.error('Review validation error:', error);
    return res.status(400).json({ 
      success: false, 
      message: 'Review validation failed',
      errors: error instanceof Error ? [error.message] : ['Unknown validation error']
    });
  }
};

// Public routes
router.get('/', getAllStoreItems);
router.get('/:id', getStoreItemDetails);

// Protected routes - require authentication
router.post('/', auth, validateStoreItemMiddleware, addStoreItem);
router.post('/:id/review', auth, validateReviewMiddleware, addReview);
router.delete('/:id', auth, deleteStoreItem);

// Add images to tool
router.put('/:id/images', auth, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;

    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid tool ID', 400);
    }

    if (!imageUrl || typeof imageUrl !== 'string') {
      throw new AppError('Image URL is required', 400);
    }

    const tool = await Store.findById(id);
    if (!tool) {
      throw new AppError('Tool not found', 404);
    }

    // Check if user is the author
    if (tool.author.toString() !== req.user?.id) {
      throw new AppError('Not authorized to modify this tool', 403);
    }

    // Add the new image URL to the images array
    tool.images = tool.images || [];
    tool.images.push(imageUrl);
    await tool.save();

    // Clear cache
    await clearCache(`store:${id}`);
    await clearCache('store:*');

    res.json({ 
      success: true, 
      data: tool 
    });
  } catch (error) {
    next(error);
  }
});

export default router; 