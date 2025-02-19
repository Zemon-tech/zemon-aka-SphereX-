import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import Idea from '../models/idea.model';
import Resource, { ResourceType } from '../models/resource.model';

const router = express.Router();

// Ideas Routes
router.get('/ideas', async (req: Request, res: Response) => {
  try {
    console.log('Attempting to fetch ideas from MongoDB...');
    const ideas = await Idea.find()
      .sort({ createdAt: -1 })
      .lean();
    
    console.log('Ideas fetched successfully:', ideas);
    res.json(ideas);
  } catch (error) {
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    res.status(500).json({ 
      message: 'Error fetching ideas',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.delete('/ideas/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid idea ID' });
    }

    const deletedIdea = await Idea.findByIdAndDelete(id);
    
    if (!deletedIdea) {
      return res.status(404).json({ message: 'Idea not found' });
    }

    console.log('Idea deleted successfully:', deletedIdea);
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

router.post('/ideas', async (req: Request, res: Response) => {
  try {
    console.log('Received idea creation request:', req.body);
    
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    // Create a new MongoDB ObjectId for the author
    const authorId = new mongoose.Types.ObjectId();

    const idea = new Idea({
      title,
      description,
      author: authorId
    });

    console.log('Attempting to save idea:', idea);
    const savedIdea = await idea.save();
    console.log('Idea saved successfully:', savedIdea);

    res.status(201).json(savedIdea);
  } catch (error) {
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    res.status(500).json({ 
      message: 'Error creating idea',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Resources Routes
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

router.post('/resources', async (req: Request, res: Response) => {
  try {
    console.log('Received resource creation request:', req.body);
    
    const { title, description, resourceType, url } = req.body;

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

    // Create a new MongoDB ObjectId for the author
    const authorId = new mongoose.Types.ObjectId();

    const resource = new Resource({
      title: title.trim(),
      description: description.trim(),
      resourceType,
      url: url.trim(),
      addedBy: authorId
    });

    console.log('Attempting to save resource:', resource);
    const savedResource = await resource.save();
    console.log('Resource saved successfully:', savedResource);

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

export default router; 