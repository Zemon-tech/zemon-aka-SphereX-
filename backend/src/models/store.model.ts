import { Schema, model } from 'mongoose';

const reviewSchema = new Schema({
  user_name: {
    type: String,
    default: 'Anonymous'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const storeItemSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  images: [{
    type: String,
    trim: true
  }],
  url: {
    type: String,
    required: true
  },
  dev_docs: {
    type: String
  },
  github_url: {
    type: String
  },
  category: {
    type: String,
    required: true,
    enum: ['Developer Tools', 'Productivity', 'Design', 'Testing', 'Analytics', 'DevOps', 'Security', 'Database']
  },
  tags: [{
    type: String,
    trim: true
  }],
  price: {
    type: String,
    default: 'Free'
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviews: [reviewSchema],
  average_rating: {
    type: Number,
    default: 0
  },
  total_reviews: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  }
}, {
  timestamps: true
});

// Index for faster searches
storeItemSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Pre-save middleware to calculate average rating
storeItemSchema.pre('save', function(next) {
  if (this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.average_rating = totalRating / this.reviews.length;
    this.total_reviews = this.reviews.length;
  }
  next();
});

export default model('StoreItem', storeItemSchema); 