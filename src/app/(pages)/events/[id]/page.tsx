"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  Share2,
  Heart,
  MessageSquare,
} from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";

// Mock data for demonstration
const mockEventDetail = {
  id: 1,
  title: "Global Hackathon 2024",
  description: `
    Join developers worldwide for a 48-hour hackathon focused on AI and sustainability.
    
    <h2>About the Event</h2>
    <p>This hackathon brings together developers, designers, and innovators to create solutions that address global sustainability challenges using AI technology.</p>
    
    <h2>What to Expect</h2>
    <ul>
      <li>48 hours of intensive coding and collaboration</li>
      <li>Mentorship from industry experts</li>
      <li>Workshops on AI and sustainability</li>
      <li>Networking opportunities</li>
    </ul>
    
    <h2>Prizes</h2>
    <p>Total prize pool of $10,000, including special category awards and sponsorship opportunities.</p>
  `,
  date: "2024-03-15",
  time: "09:00 AM",
  location: "Virtual",
  attendees: 1200,
  price: "Free",
  rewards: "$10,000 in prizes",
  image: "https://picsum.photos/1200/400",
  tags: ["hackathon", "ai", "sustainability"],
  organizer: {
    name: "TechLabs",
    avatar: "https://picsum.photos/100/100",
  },
};

export default function EventDetailPage() {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <PageContainer className="py-6">
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Hero Section */}
        <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
          <img
            src={mockEventDetail.image}
            alt={mockEventDetail.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-center gap-2 text-sm text-white/80 mb-4">
              <Calendar size={16} />
              <span>{mockEventDetail.date}</span>
              <span>•</span>
              <span>{mockEventDetail.time}</span>
              <span className="ml-auto font-medium">{mockEventDetail.price}</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              {mockEventDetail.title}
            </h1>
            <div className="flex flex-wrap gap-2">
              {mockEventDetail.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-white/10 text-white text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="prose prose-lg dark:prose-invert max-w-none mb-8" 
              dangerouslySetInnerHTML={{ __html: mockEventDetail.description }} 
            />

            {/* Organizer */}
            <div className="flex items-center gap-4 p-6 rounded-lg border mb-8">
              <img
                src={mockEventDetail.organizer.avatar}
                alt={mockEventDetail.organizer.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-medium">Organized by</h3>
                <p className="text-muted-foreground">
                  {mockEventDetail.organizer.name}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6 py-4 border-t">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center gap-2 ${
                  isLiked ? "text-red-500" : "text-muted-foreground"
                }`}
              >
                <Heart size={20} className={isLiked ? "fill-current" : ""} />
                <span>Like</span>
              </button>
              <button className="flex items-center gap-2 text-muted-foreground">
                <MessageSquare size={20} />
                <span>Comment</span>
              </button>
              <button className="flex items-center gap-2 text-muted-foreground ml-auto">
                <Share2 size={20} />
                Share
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Info Card */}
            <div className="p-6 rounded-lg border space-y-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin size={20} />
                <span>{mockEventDetail.location}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Users size={20} />
                <span>{mockEventDetail.attendees} attendees</span>
              </div>
              {mockEventDetail.rewards && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Trophy size={20} className="text-yellow-500" />
                  <span>{mockEventDetail.rewards}</span>
                </div>
              )}
              <button className="w-full px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
                Register Now
              </button>
            </div>

            {/* Similar Events */}
            <div className="p-6 rounded-lg border">
              <h3 className="font-semibold mb-4">Similar Events</h3>
              <div className="space-y-4">
                {/* Add similar events list here */}
                <p className="text-muted-foreground">Coming soon...</p>
              </div>
            </div>
          </div>
        </div>
      </motion.article>
    </PageContainer>
  );
} 