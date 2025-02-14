import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import logger from '../utils/logger';

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error details:', {
    message: err.message,
    stack: err.stack,
    name: err.name,
  });

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
    });
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      status: 'fail',
      message: 'Validation Error',
      errors: err.message,
    });
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      status: 'fail',
      message: 'Invalid ID format',
    });
  }

  // Handle duplicate key errors
  if ((err as any).code === 11000) {
    return res.status(409).json({
      success: false,
      status: 'fail',
      message: 'Duplicate field value',
    });
  }

  // Default error response
  return res.status(500).json({
    success: false,
    status: 'error',
    message: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler; 