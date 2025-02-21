import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';

interface DecodedUser {
  id: string;
  name: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: DecodedUser;
  token?: string;
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid authorization header' 
      });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const decoded = jwt.verify(token, config.jwtSecret) as DecodedUser;
      
      // Ensure all required fields are present
      if (!decoded.id || !decoded.name) {
        return res.status(401).json({ 
          success: false,
          message: 'Invalid token format' 
        });
      }

      // Attach user info to request
      req.user = {
        id: decoded.id,
        name: decoded.name,
        role: decoded.role || 'user'
      };
      next();
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      return res.status(401).json({ 
        success: false,
        message: 'Token expired or invalid' 
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ 
      success: false,
      message: 'Authentication failed' 
    });
  }
};

export const adminAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user?.role !== 'admin') {
      throw new Error();
    }
    next();
  } catch (error) {
    res.status(403).json({ error: 'Access denied.' });
  }
}; 