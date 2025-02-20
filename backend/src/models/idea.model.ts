import mongoose, { Schema, Document } from 'mongoose';

export interface IIdea extends Document {
  title: string;
  description: string;
  author: Schema.Types.ObjectId;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
}

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
    required: true
  },
  authorName: {
    type: String,
    required: true
  }
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

export default mongoose.model<IIdea>('Idea', IdeaSchema); 