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
  registrationDeadline: {
    type: Date
  },
  entryFee: {
    amount: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  keyHighlights: [{
    type: String,
    trim: true
  }],
  speakers: [{
    name: {
      type: String,
      required: true
    },
    role: String,
    bio: String,
    image: String,
    social: {
      twitter: String,
      linkedin: String,
      website: String
    }
  }],
  workshops: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    speaker: String,
    duration: String,
    requirements: String
  }],
  eligibility: {
    type: String
  },
  faqs: [{
    question: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      required: true
    }
  }],
  pastHighlights: [{
    title: String,
    description: String,
    image: String
  }],
  sponsors: [{
    name: {
      type: String,
      required: true
    },
    logo: String,
    website: String,
    tier: {
      type: String,
      enum: ['platinum', 'gold', 'silver', 'bronze', 'partner'],
      default: 'partner'
    }
  }],
  socialMedia: {
    twitter: String,
    facebook: String,
    instagram: String,
    linkedin: String,
    discord: String
  },
  contactInfo: {
    email: String,
    phone: String,
    whatsapp: String
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
  },
  website: {
    type: String
  }
}, {
  timestamps: true
});

// Create text indexes for search
eventSchema.index({ title: 'text', description: 'text', location: 'text', tags: 'text' });

// Indexes for faster searching
eventSchema.index({ date: 1 });
eventSchema.index({ type: 1 });

export default model<IEvent>('Event', eventSchema); 