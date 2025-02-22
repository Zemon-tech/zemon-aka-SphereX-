import { Router, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import User from '../models/user.model';
import { AppError } from '../utils/errors';
import { setCache, getCache, deleteCache } from '../utils/redis';
import logger from '../utils/logger';
import { auth } from '../middleware/auth.middleware';
import { AuthRequest } from '../middleware/auth.middleware';
import crypto from 'crypto';

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
      const userData = JSON.parse(cachedUser);
      // Get fresh password from database for development
      const user = await User.findById(decoded.id);
      if (user) {
        userData.password = user.password; // Include hashed password
      }
      return res.json({
        success: true,
        data: userData
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
      role: user.role,
      password: user.password, // Include hashed password
      company: user.company,
      github: user.github,
      linkedin: user.linkedin,
      personalWebsite: user.personalWebsite,
      education: user.education
    };

    // Cache user data (without password)
    const { password, ...cacheData } = userData;
    await setCache(`user:${user._id}`, JSON.stringify(cacheData), CACHE_EXPIRATION);

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

// GitHub sync endpoint
router.post('/github/sync', async (req, res, next) => {
  try {
    const { name, email, avatar, github } = req.body;

    if (!email || !name) {
      throw new AppError('Email and name are required', 400);
    }

    // Find or create user
    let user = await User.findOne({ email });
    
    if (user) {
      // Update existing user with GitHub data
      user.name = name;
      user.avatar = avatar || user.avatar;
      user.github = github;
      await user.save();
    } else {
      // Create new user with GitHub data
      // Generate a secure random password that meets the minimum length requirement
      const randomPassword = crypto.randomBytes(16).toString('hex'); // 32 characters long
      
      user = await User.create({
        name,
        email,
        avatar,
        github,
        password: randomPassword // This will be hashed by the pre-save middleware
      });
    }

    // Generate token
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
      github: user.github,
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

// Update profile
router.put('/profile', auth, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Extract fields from request body
    const {
      name,
      company,
      role,
      github,
      linkedin,
      personalWebsite,
      education
    } = req.body;

    // Update basic information
    if (name) user.name = name;
    if (company) user.company = company;
    if (role) user.role = role;

    // Update social links
    if (github) user.github = github;
    if (linkedin) user.linkedin = linkedin;
    if (personalWebsite) user.personalWebsite = personalWebsite;

    // Update education
    if (education) {
      user.education = {
        university: education.university || user.education?.university,
        graduationYear: education.graduationYear || user.education?.graduationYear
      };
    }

    // Handle password update if provided
    if (req.body.newPassword) {
      user.password = req.body.newPassword;
    } else if (req.body.currentPassword && req.body.newPassword) {
      const isPasswordValid = await user.comparePassword(req.body.currentPassword);
      if (!isPasswordValid) {
        throw new AppError('Current password is incorrect', 401);
      }
      user.password = req.body.newPassword;
    }

    await user.save();

    // Prepare user data for response
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      company: user.company,
      github: user.github,
      linkedin: user.linkedin,
      personalWebsite: user.personalWebsite,
      education: user.education
    };

    // Update cache
    await setCache(`user:${user._id}`, JSON.stringify(userData), CACHE_EXPIRATION);

    res.json({
      success: true,
      data: userData
    });
  } catch (error) {
    next(error);
  }
});

export default router; 