"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Heart, MessageSquare, Share2, Trophy, ArrowLeft } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { API_BASE_URL } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  mode: 'online' | 'in-person' | 'hybrid';
  type: 'hackathon' | 'workshop' | 'conference' | 'meetup' | 'webinar';
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
  price?: string;
}

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [countdown, setCountdown] = useState<CountdownTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (event) {
        try {
          const eventDateTime = new Date(event.date);
          const now = new Date();
          const difference = eventDateTime.getTime() - now.getTime();

          if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            setCountdown({ days, hours, minutes, seconds });
          }
        } catch (error) {
          console.error('Error calculating countdown:', error);
        }
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [event]);

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
      <div className="py-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="relative space-y-4">
            <div className="p-4 bg-card border rounded-lg">
              <div className="grid grid-cols-3 items-center">
                <div className="flex items-center gap-2">
                  <div className="text-lg font-semibold text-primary">TIME LEFT</div>
                </div>
                
                <div className="flex justify-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{countdown.days}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Days</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{countdown.hours}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Hours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{countdown.minutes}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Min</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{countdown.seconds}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Sec</div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => router.back()}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Events
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
              <p className="text-muted-foreground mb-4">{event.description}</p>
            </div>

            <img
              src={event.image}
              alt={event.title}
              className="w-full h-[400px] object-cover rounded-lg"
            />
          </div>

          <div className="space-y-6">
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Calendar className="text-primary" />
                <div>
                  <div className="font-medium">{new Date(event.date).toLocaleDateString()} at {event.time}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="text-primary" />
                <div>
                  <div className="font-medium">{event.location}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Users className="text-primary" />
                <div>
                  <div className="font-medium">{event.registrations} registered</div>
                </div>
              </div>

              {event.rewards && (
                <div className="flex items-center gap-2">
                  <Trophy className="text-primary" />
                  <div>
                    <div className="font-medium">Rewards</div>
                    <div className="text-sm text-muted-foreground">{event.rewards}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex justify-between items-center pt-6 border-t">
              <div className="text-2xl font-bold">
                {event.registrationUrl ? event.registrationUrl : event.capacity ? `€${event.capacity}` : event.price}
              </div>
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
        </motion.div>
      </div>
    </PageContainer>
  );
} 