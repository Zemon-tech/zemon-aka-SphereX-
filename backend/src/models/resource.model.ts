import mongoose, { Schema, Document } from 'mongoose';

export enum ResourceType {
  PDF = 'PDF',
  VIDEO = 'VIDEO',
  TOOL = 'TOOL',
}

export interface IResource extends Document {
  title: string;
  description: string;
  resourceType: ResourceType;
  url: string;
  author: Schema.Types.ObjectId;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  resourceType: {
    type: String,
    enum: ['PDF', 'VIDEO', 'TOOL'],
    required: true
  },
  url: {
    type: String,
    required: true,
    trim: true
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
ResourceSchema.index({ title: 'text', description: 'text' });

// Pre-save middleware
ResourceSchema.pre('save', function(next) {
  // Validate URL format
  const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  if (!urlPattern.test(this.url)) {
    next(new Error('Invalid URL format'));
  }
  next();
});

export default mongoose.model<IResource>('Resource', ResourceSchema); 