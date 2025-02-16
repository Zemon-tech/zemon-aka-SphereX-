import { Schema, model } from 'mongoose';
import { IEvent } from './interfaces';

const eventSchema = new Schema<IEvent>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  mode: {
    type: String,
    enum: ['online', 'in-person', 'hybrid'],
    default: 'online'
  },
  type: {
    type: String,
    required: true,
    enum: ['hackathon', 'workshop', 'conference', 'meetup', 'webinar']
  },
  capacity: {
    type: Number,
    min: 1
  },
  registrationUrl: {
    type: String
  },
  rewards: {
    type: String
  },
  image: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  organizer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attendees: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  clicks: {
    type: Number,
    default: 0
  },
  registrations: {
    type: Number,
    default: 0
  },
  analytics: {
    dailyViews: [{
      date: Date,
      count: Number
    }],
    registrationDates: [{
      date: Date,
      count: Number
    }]
  }
}, {
  timestamps: true
});

// Indexes for faster searching
eventSchema.index({ title: 'text', description: 'text', location: 'text' });
eventSchema.index({ date: 1 });
eventSchema.index({ type: 1 });
eventSchema.index({ tags: 1 });

export default model<IEvent>('Event', eventSchema); 