import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import Repo from '../models/repo.model';
import { AppError } from '../utils/errors';
import { setCache, getCache, clearCache } from '../utils/redis';
import { fetchGitHubRepo, validateGitHubUrl } from '../utils/github';
import logger from '../utils/logger';

const CACHE_EXPIRATION = 3600; // 1 hour

export const getRepos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const cacheKey = `repos:all:${page}:${limit}`;

    // Try to get from cache first
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.json({ success: true, data: cachedData });
    }

    const skip = (page - 1) * limit;
    const repos = await Repo.find()
      .populate('added_by', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Repo.countDocuments();
    const data = {
      repos,
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
    logger.error('Error in getRepos:', error);
    next(error);
  }
};

export const getRepoDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid repository ID', 400);
    }

    const cacheKey = `repos:${id}`;
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.json({ success: true, data: cachedData });
    }

    const repo = await Repo.findById(id).lean();

    if (!repo) {
      throw new AppError('Repository not found', 404);
    }

    await setCache(cacheKey, repo, CACHE_EXPIRATION);
    res.json({ success: true, data: repo });
  } catch (error) {
    next(error);
  }
};

export const addRepo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { github_url, description, language, tags } = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      throw new AppError('User must be authenticated to add a repository', 401);
    }

    if (!github_url) {
      throw new AppError('GitHub URL is required', 400);
    }

    logger.info(`Attempting to add repository: ${github_url}`);

    const urlData = await validateGitHubUrl(github_url);
    if (!urlData) {
      throw new AppError('Invalid GitHub URL format', 400);
    }

    const existingRepo = await Repo.findOne({ github_url });
    if (existingRepo) {
      throw new AppError('Repository already exists', 400);
    }

    // Fetch GitHub data
    const githubData = await fetchGitHubRepo(urlData.owner, urlData.repo);

    // Create repo with combined data
    const repo = new Repo({
      ...githubData,
      description: description || githubData.description, // Use provided description or fallback to GitHub
      language: language || '', // Just use the provided language
      tags: tags || [],
      added_by: userId,
    });

    await repo.save();
    const populatedRepo = await repo.populate('added_by', 'name');
    
    await clearCache('repos:*');
    res.status(201).json({ success: true, data: populatedRepo });
  } catch (error) {
    next(error);
  }
};

export const updateRepo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid repository ID', 400);
    }

    const repo = await Repo.findById(id);
    if (!repo) {
      throw new AppError('Repository not found', 404);
    }

    // Sync with GitHub
    const urlData = await validateGitHubUrl(repo.github_url);
    if (!urlData) {
      throw new AppError('Invalid GitHub URL', 400);
    }

    const githubData = await fetchGitHubRepo(urlData.owner, urlData.repo);
    const updatedRepo = await Repo.findByIdAndUpdate(
      id,
      {
        ...githubData,
        last_synced: new Date(),
      },
      { new: true }
    );

    await clearCache(`repos:${id}`);
    await clearCache('repos:all:*');
    res.json({ success: true, data: updatedRepo });
  } catch (error) {
    next(error);
  }
};

export const deleteRepo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid repository ID', 400);
    }

    const repo = await Repo.findById(id);
    if (!repo) {
      throw new AppError('Repository not found', 404);
    }

    await Repo.findByIdAndDelete(id);
    await clearCache(`repos:${id}`);
    await clearCache('repos:all:*');
    res.json({ success: true, message: 'Repository deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const likeRepo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    // Get user ID from authenticated request
    const userId = (req as any).user?.id;

    if (!userId) {
      throw new AppError('User must be authenticated to like a repository', 401);
    }

    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid repository ID', 400);
    }

    const repo = await Repo.findById(id);
    if (!repo) {
      throw new AppError('Repository not found', 404);
    }

    const userIndex = repo.likes.findIndex(like => like.toString() === userId.toString());
    if (userIndex === -1) {
      repo.likes.push(userId);
    } else {
      repo.likes.splice(userIndex, 1);
    }

    await repo.save();
    await clearCache(`repos:${id}`);
    res.json({ success: true, data: repo });
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    // Get user ID from authenticated request
    const userId = (req as any).user?.id;

    if (!userId) {
      throw new AppError('User must be authenticated to comment', 401);
    }

    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid repository ID', 400);
    }

    if (!content) {
      throw new AppError('Comment content is required', 400);
    }

    const repo = await Repo.findById(id);
    if (!repo) {
      throw new AppError('Repository not found', 404);
    }

    repo.comments.push({
      user: userId,
      content,
      createdAt: new Date(),
    });

    await repo.save();
    await clearCache(`repos:${id}`);

    const updatedRepo = await Repo.findById(id).lean();
    res.json({ success: true, data: updatedRepo });
  } catch (error) {
    next(error);
  }
};

export const getUserRepos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      throw new AppError('User must be authenticated', 401);
    }

    const repos = await Repo.find({ added_by: userId })
      .populate('added_by', 'name')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: {
        repos
      }
    });
  } catch (error) {
    next(error);
  }
};