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

    const trimmedQuery = query.trim();
    // Create regex patterns for prefix match and contains match
    const prefixRegex = new RegExp(`^${trimmedQuery}`, 'i');
    const containsRegex = new RegExp(trimmedQuery, 'i');

    // First, search for users
    const users = await User.find({
      $or: [
        // Prefix matches first
        { name: prefixRegex },
        { displayName: prefixRegex },
        // Then contains matches
        { name: containsRegex },
        { displayName: containsRegex }
      ]
    })
      .limit(5)
      .select('name displayName avatar')
      .lean();

    // Then search other content types
    const [repos, tools, ideas, resources, news, events] = await Promise.all([
      // Search repositories
      Repo.find({
        name: containsRegex
      })
        .limit(5)
        .lean(),

      // Search store items
      StoreItem.find({
        name: containsRegex
      })
        .limit(5)
        .lean(),

      // Search ideas
      Idea.find({
        title: containsRegex
      })
        .limit(5)
        .lean(),

      // Search resources
      Resource.find({
        title: containsRegex
      })
        .limit(5)
        .lean(),

      // Search news
      News.find({
        title: containsRegex
      })
        .limit(5)
        .lean(),

      // Search events
      Event.find({
        title: containsRegex
      })
        .limit(5)
        .lean(),
    ]);

    // Transform results and sort them (prefix matches first)
    const transformedResults = [
      // Users first
      ...users.map(user => ({
        id: user._id.toString(),
        title: user.displayName || user.name,
        description: `@${user.name}`,
        type: 'user' as const,
        url: `/dashboard/${user.name}`,
        originalUsername: user.name,
        isPrefixMatch: user.name.toLowerCase().startsWith(trimmedQuery.toLowerCase()) || 
                      (user.displayName && user.displayName.toLowerCase().startsWith(trimmedQuery.toLowerCase()))
      })),
      // Then other content types
      ...repos.map(repo => ({
        id: repo._id.toString(),
        title: repo.name,
        description: repo.description,
        type: 'repo' as const,
        url: `/repos/${repo._id}`,
        isPrefixMatch: repo.name.toLowerCase().startsWith(trimmedQuery.toLowerCase())
      })),
      ...tools.map(tool => ({
        id: tool._id.toString(),
        title: tool.name,
        description: tool.description,
        type: 'tool' as const,
        url: `/store/${tool._id}`,
        isPrefixMatch: tool.name.toLowerCase().startsWith(trimmedQuery.toLowerCase())
      })),
      ...ideas.map(idea => ({
        id: idea._id.toString(),
        title: idea.title,
        description: idea.description,
        type: 'idea' as const,
        url: `/community?tab=ideas&id=${idea._id}`,
        isPrefixMatch: idea.title.toLowerCase().startsWith(trimmedQuery.toLowerCase())
      })),
      ...resources.map(resource => ({
        id: resource._id.toString(),
        title: resource.title,
        description: resource.description,
        type: 'resource' as const,
        url: `/community?tab=resources&id=${resource._id}`,
        isPrefixMatch: resource.title.toLowerCase().startsWith(trimmedQuery.toLowerCase())
      })),
      ...news.map(article => ({
        id: article._id.toString(),
        title: article.title,
        description: article.excerpt,
        type: 'news' as const,
        url: `/news/${article._id}`,
        isPrefixMatch: article.title.toLowerCase().startsWith(trimmedQuery.toLowerCase())
      })),
      ...events.map(event => ({
        id: event._id.toString(),
        title: event.title,
        description: event.description,
        type: 'event' as const,
        url: `/events/${event._id}`,
        isPrefixMatch: event.title.toLowerCase().startsWith(trimmedQuery.toLowerCase())
      }))
    ];

    // Sort results: Users first, then prefix matches, then contains matches
    const sortedResults = transformedResults.sort((a, b) => {
      // Users always come first
      if (a.type === 'user' && b.type !== 'user') return -1;
      if (b.type === 'user' && a.type !== 'user') return 1;
      
      // Then sort by prefix match
      if (a.isPrefixMatch && !b.isPrefixMatch) return -1;
      if (b.isPrefixMatch && !a.isPrefixMatch) return 1;
      
      return 0;
    });

    res.json({
      success: true,
      results: sortedResults.slice(0, 10) // Limit total results to 10
    });
  } catch (error) {
    logger.error('Error in search:', error);
    next(error);
  }
}; 