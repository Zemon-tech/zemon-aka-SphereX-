"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Heart, MessageSquare, Share2, Trophy } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { API_BASE_URL } from "@/lib/api";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: string;
  mode: string;
  capacity?: number;
  registrationUrl?: string;
  rewards?: string;
  image: string;
  tags: string[];
  organizer: {
    name: string;
    avatar: string;
  };
  registrations: number;
  clicks: number;
}

export default function EventDetailPage() {
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/events/${params.id}`);
        const data = await response.json();
        if (data.success) {
          setEvent(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch event details');
        }
      } catch (error) {
        console.error('Error fetching event detail:', error);
        toast({
          title: "Error",
          description: "Failed to load event details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchEventDetail();
    }
  }, [params.id, toast]);

  const handleRegister = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events/${params.id}/register`, {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Successfully registered for the event",
        });
      } else {
        throw new Error(data.message || 'Failed to register for event');
      }
    } catch (error) {
      console.error('Error registering for event:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to register for event",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <PageContainer className="py-6">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-3/4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
          <div className="h-[400px] bg-muted rounded-lg"></div>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!event) {
    return (
      <PageContainer className="py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Event not found</h1>
          <p className="text-muted-foreground">The event you're looking for doesn't exist or has been removed.</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-6">
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="space-y-8">
          {/* Event Header */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
            <div className="flex flex-wrap gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{event.registrations} registered</span>
              </div>
            </div>
          </div>

          {/* Event Image */}
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-[400px] object-cover rounded-lg"
          />

          {/* Event Details */}
          <div className="space-y-6">
            <div className="prose max-w-none">
              <p>{event.description}</p>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Type:</span>
                <span className="capitalize">{event.type}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Mode:</span>
                <span className="capitalize">{event.mode}</span>
              </div>
              {event.capacity && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Capacity:</span>
                  <span>{event.capacity} attendees</span>
                </div>
              )}
            </div>

            {event.rewards && (
              <div className="flex items-center gap-2 text-yellow-500">
                <Trophy className="w-5 h-5" />
                <span>{event.rewards}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Organizer Info */}
            <div className="flex items-center gap-4 p-4 bg-card rounded-lg">
              <img
                src={event.organizer.avatar}
                alt={event.organizer.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-medium">Organized by</h3>
                <p className="text-muted-foreground">{event.organizer.name}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              {event.registrationUrl ? (
                <Button
                  className="flex-1"
                  onClick={() => window.open(event.registrationUrl, '_blank')}
                >
                  Register Now
                </Button>
              ) : (
                <Button className="flex-1" onClick={handleRegister}>
                  Register Now
                </Button>
              )}
              <Button variant="outline" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </motion.article>
    </PageContainer>
  );
} 