import express from "express";
import {
  createIdea,
  getIdeas,
  deleteIdea,
} from "../controllers/idea.controller";
import { auth as authMiddleware } from "../middleware/auth";

const router = express.Router();

// Public routes
router.get("/", getIdeas);

// Protected routes
router.use(authMiddleware); // Apply authentication middleware
router.post("/", createIdea);
router.delete("/:id", deleteIdea);

export default router;
