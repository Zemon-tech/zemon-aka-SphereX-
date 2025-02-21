import { Router, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import User from '../models/user.model';
import { AppError } from '../utils/errors';
import { setCache, getCache, deleteCache } from '../utils/redis';
import logger from '../utils/logger';
import { auth } from '../middleware/auth.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

const router = Router();
const CACHE_EXPIRATION = 3600; // 1 hour

// Signup
router.post('/signup', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate token with all required fields
    const token = jwt.sign(
      { 
        id: user._id,
        name: user.name,
        role: user.role || 'user'
      },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    // Cache user data
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role
    };
    await setCache(`user:${user._id}`, JSON.stringify(userData), CACHE_EXPIRATION);

    res.status(201).json({
      success: true,
      data: {
        token,
        user: userData
      }
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate token with name included
    const token = jwt.sign(
      { 
        id: user._id,
        name: user.name,  // Include name in token
        role: user.role 
      },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    // Cache user data
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role
    };
    await setCache(`user:${user._id}`, JSON.stringify(userData), CACHE_EXPIRATION);

    res.json({
      success: true,
      data: {
        token,
        user: userData
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get('/me', async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new AppError('No token provided', 401);
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret) as { id: string };
    
    // Try to get user from cache
    const cachedUser = await getCache(`user:${decoded.id}`);
    if (cachedUser) {
      return res.json({
        success: true,
        data: JSON.parse(cachedUser)
      });
    }

    // If not in cache, get from database
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role
    };

    // Cache user data
    await setCache(`user:${user._id}`, JSON.stringify(userData), CACHE_EXPIRATION);

    res.json({
      success: true,
      data: userData
    });
  } catch (error) {
    next(error);
  }
});

// Logout
router.post('/logout', async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new AppError('No token provided', 401);
    }

    // Verify token to get user ID
    const decoded = jwt.verify(token, config.jwtSecret) as { id: string };
    
    // Remove user data from cache
    await deleteCache(`user:${decoded.id}`);

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
});

router.get('/verify', auth, async (req: AuthRequest, res: Response) => {
  try {
    // If middleware passed, token is valid
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token' 
      });
    }

    res.json({ 
      success: true,
      user: req.user 
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ 
      success: false,
      message: 'Invalid token' 
    });
  }
});

export default router; 