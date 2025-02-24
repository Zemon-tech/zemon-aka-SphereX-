import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import Repo from '../models/repo.model';
import StoreItem from '../models/store.model';
import Idea from '../models/idea.model';
import Resource from '../models/resource.model';
import News from '../models/news.model';
import Event from '../models/event.model';
import User from '../models/user.model';
import { AppError } from '../utils/errors';
import logger from '../utils/logger';

export const search = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q: query } = req.query;
    if (!query || typeof query !== 'string') {
      throw new AppError('Search query is required', 400);
    }

    logger.info(`Searching for: ${query}`);

    // Perform parallel searches across all content types
    const [repos, tools, ideas, resources, news, events, users] = await Promise.all([
      // Search repositories
      Repo.find(
        { $text: { $search: query } },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .limit(5)
        .lean(),

      // Search store items
      StoreItem.find(
        { $text: { $search: query } },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .limit(5)
        .lean(),

      // Search ideas
      Idea.find(
        { $text: { $search: query } },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .limit(5)
        .lean(),

      // Search resources
      Resource.find(
        { $text: { $search: query } },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .limit(5)
        .lean(),

      // Search news
      News.find(
        { $text: { $search: query } },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .limit(5)
        .lean(),

      // Search events
      Event.find(
        { $text: { $search: query } },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .limit(5)
        .lean(),

      // Search users
      User.find(
        { $text: { $search: query } },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .limit(5)
        .select('name displayName avatar')
        .lean(),
    ]);

    // Transform and combine results
    const results = [
      ...repos.map(repo => ({
        id: repo._id.toString(),
        title: repo.name,
        description: repo.description,
        type: 'repo' as const,
        url: `/repos/${repo._id}`,
      })),
      ...tools.map(tool => ({
        id: tool._id.toString(),
        title: tool.name,
        description: tool.description,
        type: 'tool' as const,
        url: `/store/${tool._id}`,
      })),
      ...ideas.map(idea => ({
        id: idea._id.toString(),
        title: idea.title,
        description: idea.description,
        type: 'idea' as const,
        url: `/community?tab=ideas&id=${idea._id}`,
      })),
      ...resources.map(resource => ({
        id: resource._id.toString(),
        title: resource.title,
        description: resource.description,
        type: 'resource' as const,
        url: `/community?tab=resources&id=${resource._id}`,
      })),
      ...news.map(article => ({
        id: article._id.toString(),
        title: article.title,
        description: article.excerpt,
        type: 'news' as const,
        url: `/news/${article._id}`,
      })),
      ...events.map(event => ({
        id: event._id.toString(),
        title: event.title,
        description: event.description,
        type: 'event' as const,
        url: `/events/${event._id}`,
      })),
      ...users.map(user => ({
        id: user._id.toString(),
        title: user.displayName || user.name,
        description: `@${user.name}`,
        type: 'user' as const,
        url: `/${user.name}`,
      })),
    ];

    // Sort results by relevance (if available) or recency
    results.sort((a, b) => {
      const scoreA = (a as any).score || 0;
      const scoreB = (b as any).score || 0;
      return scoreB - scoreA;
    });

    res.json({
      success: true,
      results: results.slice(0, 10), // Limit total results to 10
    });
  } catch (error) {
    logger.error('Error in search:', error);
    next(error);
  }
}; 