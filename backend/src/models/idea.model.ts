import mongoose, { Schema, Document } from 'mongoose';

// Export the interface
export interface IComment {
  userId: mongoose.Types.ObjectId;
  username: string;
  avatar: string;
  text: string;
  createdAt: Date;
}

export interface IIdea extends Document {
  title: string;
  description: string;
  author: mongoose.Types.ObjectId;
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  username: { 
    type: String, 
    required: true 
  },
  avatar: { 
    type: String,
    required: true
  },
  text: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const IdeaSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required'],
    index: true
  },
  comments: [commentSchema],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add indexes
IdeaSchema.index({ title: 'text', description: 'text' });

// Pre-save middleware
IdeaSchema.pre('save', function(next) {
  // Any pre-save operations can go here
  next();
});

// Create text indexes for search
IdeaSchema.index({ title: 'text', description: 'text' });

export default mongoose.model<IIdea>('Idea', IdeaSchema); 