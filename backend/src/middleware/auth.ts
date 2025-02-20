import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  token?: string;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Auth header:', authHeader); // Debug log

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided or invalid format' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Extracted token:', token.substring(0, 10) + '...'); // Debug log

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as {
        _id: string;
        name: string;
        email: string;
        role: string;
      };
      console.log('Decoded token:', decoded); // Debug log

      const user = await User.findById(decoded._id);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      req.user = {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
      };

      console.log('Authenticated user:', req.user); // Debug log
      next();
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Authentication failed' });
  }
}; 