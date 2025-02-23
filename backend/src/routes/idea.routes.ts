import express from "express";
import {
  createIdea,
  getIdeas,
} from "../controllers/idea.controller";
import { auth as authMiddleware, AuthRequest, adminOrOwnerAuth } from "../middleware/auth.middleware";
import Idea from "../models/idea.model";
import { Types } from "mongoose";
import { AppError } from "../utils/errors";

// Extend AuthRequest to include model
declare module '../middleware/auth.middleware' {
  interface AuthRequest {
    model?: any;
  }
}

const router = express.Router();

// Public routes
router.get("/", getIdeas);

// Protected routes
router.use(authMiddleware);
router.post("/", createIdea);

// Delete idea
router.delete("/:id", async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid idea ID", 400);
    }

    // Attach the model to the request for the adminOrOwnerAuth middleware
    req.model = Idea;
    
    // Use the adminOrOwnerAuth middleware with 'author' field
    await adminOrOwnerAuth(req, res, async () => {
      await Idea.findByIdAndDelete(id);
      res.status(200).json({
        status: "success",
        message: "Idea deleted successfully",
      });
    });
  } catch (error) {
    next(error);
  }
});

export default router;
