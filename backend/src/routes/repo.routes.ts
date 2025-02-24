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
import User from '../models/user.model';
import Repo from '../models/repo.model';
import { AppError } from '../utils/errors';

const router = Router();

// Get user's repos (protected route) - This must come BEFORE the :id route
router.get('/user', auth, getUserRepos);

// Get user's repos by username
router.get('/user/:username', async (req, res, next) => {
  try {
    const { username } = req.params;

    // Find user by displayName or name
    const user = await User.findOne({
      $or: [
        { displayName: username },
        { name: username }
      ]
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const repos = await Repo.find({ added_by: user._id })
      .populate('added_by', 'name')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: {
        repos: repos || []
      }
    });
  } catch (error) {
    console.error('Error in getUserReposByUsername:', error);
    next(error);
  }
});

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