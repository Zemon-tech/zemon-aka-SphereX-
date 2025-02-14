import { Router } from 'express';
import {
  getRepos,
  getRepoDetails,
  addRepo,
  updateRepo,
  deleteRepo,
  likeRepo,
  addComment,
} from '../controllers/repo.controller';

const router = Router();

// All routes are public for now
router.get('/', getRepos);
router.get('/:id', getRepoDetails);
router.post('/', addRepo);
router.put('/:id', updateRepo);
router.delete('/:id', deleteRepo);
router.post('/:id/like', likeRepo);
router.post('/:id/comments', addComment);

export default router; 