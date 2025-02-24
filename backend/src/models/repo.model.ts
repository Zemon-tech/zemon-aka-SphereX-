import { Schema, model } from 'mongoose';

const commentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const repoSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  github_url: {
    type: String,
    required: true,
    unique: true
  },
  programming_language: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  stars: {
    type: Number,
    default: 0
  },
  forks: {
    type: Number,
    default: 0
  },
  streaks: {
    type: Number,
    default: 0
  },
  branches: {
    type: Number,
    default: 0
  },
  contributors: [{
    login: String,
    avatar_url: String,
    contributions: Number
  }],
  thumbnail_url: {
    type: String,
    default: '/placeholder-repo.jpg'
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [commentSchema],
  docs: {
    type: String
  },
  readme_url: {
    type: String
  },
  owner: {
    type: String,
    required: true
  },
  last_synced: {
    type: Date,
    default: Date.now
  },
  added_by: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Create text indexes for search
repoSchema.index({ name: 'text', description: 'text', tags: 'text' });

export default model('Repo', repoSchema); 