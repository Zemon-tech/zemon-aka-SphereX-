import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import Idea from '../models/idea.model';
import Resource, { ResourceType } from '../models/resource.model';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Public routes - viewing ideas and resources
router.get('/ideas', async (req: Request, res: Response) => {
  try {
    console.log('Attempting to fetch ideas from MongoDB...');
    const ideas = await Idea.find()
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    
    // Transform the data to include authorName
    const ideasWithAuthorNames = ideas.map(idea => ({
      ...idea,
      authorName: idea.authorName // Make sure this field exists
    }));

    console.log('Ideas fetched successfully:', ideasWithAuthorNames);
    res.json(ideasWithAuthorNames);
  } catch (error) {
    console.error('Error fetching ideas:', error);
    res.status(500).json({ message: 'Error fetching ideas' });
  }
});

router.get('/resources', async (req: Request, res: Response) => {
  try {
    console.log('Attempting to fetch resources from MongoDB...');
    const resources = await Resource.find()
      .sort({ createdAt: -1 })
      .lean();
    
    console.log('Resources fetched successfully:', resources);
    res.json(resources);
  } catch (error) {
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    res.status(500).json({ 
      message: 'Error fetching resources',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Protected routes - require authentication
router.post('/ideas', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description } = req.body;
    
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const idea = new Idea({
      title: title.trim(),
      description: description.trim(),
      author: req.user._id,
      authorName: req.user.name // Make sure to include the author's name
    });

    const savedIdea = await idea.save();
    res.status(201).json(savedIdea);
  } catch (error) {
    console.error('Error creating idea:', error);
    res.status(500).json({ message: 'Error creating idea' });
  }
});

router.post('/resources', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, resourceType, url } = req.body;
    
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Validate required fields
    if (!title || !description || !resourceType || !url) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        details: {
          title: !title ? 'Title is required' : null,
          description: !description ? 'Description is required' : null,
          resourceType: !resourceType ? 'Resource type is required' : null,
          url: !url ? 'URL is required' : null
        }
      });
    }

    // Validate resource type
    const validTypes = ['PDF', 'VIDEO', 'TOOL'];
    if (!validTypes.includes(resourceType)) {
      return res.status(400).json({ 
        message: 'Invalid resource type',
        details: `Resource type must be one of: ${validTypes.join(', ')}`
      });
    }

    // Validate URL format
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (!urlPattern.test(url)) {
      return res.status(400).json({ 
        message: 'Invalid URL format',
        details: 'Please provide a valid URL (e.g., https://example.com)'
      });
    }

    const resource = new Resource({
      title: title.trim(),
      description: description.trim(),
      resourceType,
      url: url.trim(),
      author: req.user._id,
      authorName: req.user.name
    });

    const savedResource = await resource.save();
    res.status(201).json(savedResource);
  } catch (error) {
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    res.status(500).json({ 
      message: 'Error creating resource',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.delete('/ideas/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid idea ID' });
    }

    const idea = await Idea.findById(id);
    
    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }

    if (idea.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this idea' });
    }

    await Idea.deleteOne({ _id: id });
    res.json({ message: 'Idea deleted successfully' });
  } catch (error) {
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    res.status(500).json({ 
      message: 'Error deleting idea',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.delete('/resources/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid resource ID' });
    }

    const resource = await Resource.findById(id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    if (resource.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this resource' });
    }

    await Resource.deleteOne({ _id: id });
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    res.status(500).json({ 
      message: 'Error deleting resource',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 