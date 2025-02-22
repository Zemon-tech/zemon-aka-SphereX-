import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import  User  from '../models/user.model';
import { ValidationError } from '../utils/errors';
import { validationResult } from 'express-validator';

export const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError('Invalid input data');
  }

  const { email, password, name } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ValidationError('Email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    password: hashedPassword,
    name,
  });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    config.jwtSecret,
    { expiresIn: '7d' }
  );

  res.status(201).json({ token, user: { id: user._id, name, email } });
};

export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError('Invalid input data');
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ValidationError('Invalid credentials');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new ValidationError('Invalid credentials');
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    config.jwtSecret,
    { expiresIn: '7d' }
  );

  res.json({ token, user: { id: user._id, name: user.name, email } });
};

export const githubAuth = async (req: Request, res: Response) => {
  // Implement GitHub OAuth logic here
  res.status(501).json({ message: 'GitHub auth not implemented yet' });
}; 