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

export default router; 