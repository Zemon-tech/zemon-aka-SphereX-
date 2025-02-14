import { Router } from 'express';
import {
  getAllStoreItems,
  getStoreItemDetails,
  addStoreItem,
  addReview,
  deleteStoreItem,
} from '../controllers/store.controller';
import { validateStoreItem, validateReview } from '../validators/store.validator';

const router = Router();

// Middleware to validate store item
const validateStoreItemMiddleware = (req: any, res: any, next: any) => {
  const errors = validateStoreItem(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }
  next();
};

// Middleware to validate review
const validateReviewMiddleware = (req: any, res: any, next: any) => {
  const errors = validateReview(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }
  next();
};

// All routes are public for now
router.get('/', getAllStoreItems);
router.get('/:id', getStoreItemDetails);
router.post('/', validateStoreItemMiddleware, addStoreItem);
router.post('/:id/review', validateReviewMiddleware, addReview);
router.delete('/:id', deleteStoreItem);

export default router; 