import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from './interfaces';

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  displayName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  avatar: {
    type: String,
    default: '/default-avatar.jpg'
  },
  company: {
    type: String,
    trim: true
  },
  bio: String,
  github: String,
  twitter: String,
  linkedin: String,
  personalWebsite: {
    type: String,
    trim: true
  },
  education: {
    university: {
      type: String,
      trim: true
    },
    graduationYear: {
      type: Number,
      min: 1900,
      max: new Date().getFullYear() + 10
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

// Create text indexes for search
userSchema.index({ name: 'text', displayName: 'text', bio: 'text', company: 'text' });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create indexes
userSchema.index({ email: 1 });
userSchema.index({ name: 'text' });

export default model<IUser>('User', userSchema); 