import { Request, Response } from "express";
import Idea from "../models/idea.model";
class AppError extends Error {
  statusCode: number;
  status: string;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    Error.captureStackTrace(this, this.constructor);
  }
}

export const createIdea = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const userId = (req as any).user?._id; // Get the current logged in user's ID

    if (!userId) {
      throw new AppError("User must be logged in to create an idea", 401);
    }

    const idea = await Idea.create({
      title,
      description,
      author: userId,
    });

    const populatedIdea = await idea.populate("author", "name");

    res.status(201).json(populatedIdea);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getIdeas = async (_req: Request, res: Response) => {
  try {
    const ideas = await Idea.find()
      .populate("author", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(ideas);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const deleteIdea = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?._id;

    const idea = await Idea.findById(id);

    if (!idea) {
      throw new AppError("Idea not found", 404);
    }

    if (idea.author.toString() !== userId?.toString()) {
      throw new AppError("Not authorized to delete this idea", 403);
    }

    await idea.deleteOne();

    res.status(200).json({
      status: "success",
      message: "Idea deleted successfully",
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
    });
  }
};
