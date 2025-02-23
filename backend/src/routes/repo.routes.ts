import { Router } from 'express';
import { auth } from '../middleware/auth.middleware';
import {
  getRepos,
  getRepoDetails,
  addRepo,
  updateRepo,
  deleteRepo,
  likeRepo,
  addComment,
  getUserRepos,
} from '../controllers/repo.controller';

const router = Router();

// Get user's repos (protected route) - This must come BEFORE the :id route
router.get('/user', auth, getUserRepos);

// All routes are public for now
router.get('/', getRepos);
router.get('/:id', getRepoDetails);

// Protected routes
router.post('/', auth, addRepo);
router.put('/:id', auth, updateRepo);
router.delete('/:id', auth, deleteRepo);
router.post('/:id/like', auth, likeRepo);
router.post('/:id/comments', auth, addComment);

export default router; 