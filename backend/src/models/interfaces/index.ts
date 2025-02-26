import { Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  displayName?: string;
  company?: string;
  avatar?: string;
  bio?: string;
  github?: string;
  twitter?: string;
  linkedin?: string;
  personalWebsite?: string; // Referred to as "Portfolio website" in the UI
  education?: {
    university: string;
    graduationYear: number;
  };
  role: 'user' | 'admin';
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStoreItem extends Document {
  name: string;
  description: string;
  thumbnail: string;
  images: string[];
  url: string;
  dev_docs?: string;
  github_url?: string;
  category: 'Developer Tools' | 'Productivity' | 'Design' | 'Testing' | 'Analytics' | 'DevOps' | 'Security' | 'Database';
  tags: string[];
  price: string;
  author: IUser['_id'];
  reviews: Array<{
    user: IUser['_id'];
    rating: number;
    comment: string;
    createdAt: Date;
  }>;
  average_rating: number;
  total_reviews: number;
  views: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface IProject extends Document {
  title: string;
  description: string;
  image: string;
  author: IUser['_id'];
  category: string;
  tags: string[];
  url: string;
  rating: number;
  reviews: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  mode: 'online' | 'in-person' | 'hybrid';
  type: 'hackathon' | 'workshop' | 'conference' | 'meetup' | 'webinar';
  capacity?: number;
  registrationUrl?: string;
  rewards?: string;
  image: string;
  tags: string[];
  organizer: IUser['_id'];
  attendees: IUser['_id'][];
  clicks: number;
  registrations: number;
  website?: string;
  analytics: {
    dailyViews: Array<{
      date: Date;
      count: number;
    }>;
    registrationDates: Array<{
      date: Date;
      count: number;
    }>;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface INews extends Document {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  image: string;
  tags: string[];
  views: number;
  likes: IUser['_id'][];
  comments: {
    user: IUser['_id'];
    content: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IRepository extends Document {
  name: string;
  owner: string;
  description: string;
  stars: number;
  forks: number;
  contributors: number;
  likes: IUser['_id'][];
  comments: {
    user: IUser['_id'];
    content: string;
    createdAt: Date;
  }[];
  language: string;
  topics: string[];
  createdAt: Date;
  updatedAt: Date;
} 