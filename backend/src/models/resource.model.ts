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
  addedBy: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema = new Schema({
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
  resourceType: {
    type: String,
    enum: Object.values(ResourceType),
    required: [true, 'Resource type is required']
  },
  url: {
    type: String,
    required: [true, 'URL is required'],
    trim: true
  },
  addedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required'],
    index: true
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