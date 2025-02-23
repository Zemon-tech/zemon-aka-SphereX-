import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import Idea, { IComment } from '../models/idea.model';
import Resource, { ResourceType } from '../models/resource.model';
import { auth, AuthRequest, adminOrOwnerAuth } from '../middleware/auth.middleware';

// Extend AuthRequest to include model
declare module '../middleware/auth.middleware' {
  interface AuthRequest {
    model?: any;
  }
}

const router = express.Router();

// Ideas Routes
router.get('/ideas', async (req: Request, res: Response) => {
  try {
    console.log('Attempting to fetch ideas from MongoDB...');
    const ideas = await Idea.find()
      .populate('author', 'name')
      .populate('comments.userId', 'name avatar')
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

router.delete('/ideas/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid idea ID' });
    }

    // Attach the model to the request for the adminOrOwnerAuth middleware
    req.model = Idea;
    
    // Use the adminOrOwnerAuth middleware with 'author' field
    await adminOrOwnerAuth(req, res, async () => {
      const deletedIdea = await Idea.findByIdAndDelete(id);
      
      if (!deletedIdea) {
        return res.status(404).json({ message: 'Idea not found' });
      }

      console.log('Idea deleted successfully:', deletedIdea);
      res.json({ message: 'Idea deleted successfully' });
    }, 'author'); // Note: using 'author' as the owner field
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

router.post('/ideas', auth, async (req: AuthRequest, res: Response) => {
  try {
    console.log('Received idea creation request:', req.body);
    
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const idea = new Idea({
      title,
      description,
      author: req.user?.id
    });

    console.log('Attempting to save idea:', idea);
    const savedIdea = await idea.save();
    const populatedIdea = await savedIdea.populate('author', 'name');
    console.log('Idea saved successfully:', populatedIdea);

    res.status(201).json(populatedIdea);
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
      .populate('addedBy', 'name')
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

router.post('/resources', auth, async (req: AuthRequest, res: Response) => {
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

    const resource = new Resource({
      title: title.trim(),
      description: description.trim(),
      resourceType,
      url: url.trim(),
      addedBy: req.user?.id
    });

    console.log('Attempting to save resource:', resource);
    const savedResource = await resource.save();
    const populatedResource = await savedResource.populate('addedBy', 'name');
    console.log('Resource saved successfully:', populatedResource);

    res.status(201).json(populatedResource);
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

router.delete('/resources/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid resource ID' });
    }

    // Attach the model to the request for the adminOrOwnerAuth middleware
    req.model = Resource;
    
    // Use the adminOrOwnerAuth middleware with 'addedBy' field
    await adminOrOwnerAuth(req, res, async () => {
      await Resource.findByIdAndDelete(id);
      console.log('Resource deleted successfully:', id);
      res.json({ message: 'Resource deleted successfully' });
    }, 'addedBy'); // Note: using 'addedBy' as the owner field
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

router.post('/ideas/:id/comments', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    
    if (!text?.trim()) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    // Validate the idea ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid idea ID format' });
    }

    const idea = await Idea.findById(id);
    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }

    if (!req.user?.id || !req.user?.name) {
      return res.status(401).json({ message: 'User information is missing' });
    }

    const comment = {
      userId: new mongoose.Types.ObjectId(req.user.id),
      username: req.user.name,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(req.user.name)}&background=random`,
      text: text.trim(),
      createdAt: new Date()
    };

    idea.comments.push(comment);
    await idea.save();

    res.status(201).json({ 
      success: true,
      data: comment 
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to add comment' 
    });
  }
});

export default router; 