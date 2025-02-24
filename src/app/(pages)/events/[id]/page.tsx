"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Heart, MessageSquare, Share2, Trophy, ArrowLeft, User } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { API_BASE_URL } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
  dailyViews?: number[];
  attendees?: Array<{
    name: string;
    avatar: string;
  }>;
  isUserRegistered: boolean;
}

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getInitials(name: string | undefined): string {
  if (!name) return '';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name: string | undefined): string {
  if (!name) return 'bg-primary/10';
  const colors = [
    'bg-red-100',
    'bg-green-100',
    'bg-blue-100',
    'bg-yellow-100',
    'bg-purple-100',
    'bg-pink-100',
    'bg-indigo-100',
  ];
  const index = name.length % colors.length;
  return colors[index];
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const { toast } = useToast();
  const [countdown, setCountdown] = useState<CountdownTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isReminderSet, setIsReminderSet] = useState(false);

  const fetchEventDetail = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_BASE_URL}/api/events/${params.id}`, {
        headers
      });
      const data = await response.json();
      
      if (data.success) {
        setEvent(data.data);
        setIsRegistered(!!data.data.isUserRegistered);
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

  useEffect(() => {
    if (params.id) {
      fetchEventDetail();
    }
  }, [params.id]);

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
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Error",
          description: "Please login to register for the event",
          variant: "destructive",
        });
        router.push('/auth/login');
        return;
      }

      const endpoint = isRegistered ? 'unregister' : 'register';
      const response = await fetch(`${API_BASE_URL}/api/events/${params.id}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setIsRegistered(data.data.isUserRegistered);
        if (event && data.data) {
          setEvent({
            ...event,
            registrations: data.data.registrations,
            isUserRegistered: data.data.isUserRegistered
          });
        }
        toast({
          title: "Success",
          description: data.message,
        });
      }
    } catch (error) {
      console.error('Error with event registration:', error);
      if (error instanceof Error && error.message.includes('authorization')) {
        toast({
          title: "Error",
          description: "Please login to manage event registration",
          variant: "destructive",
        });
        router.push('/auth/login');
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update registration status",
        variant: "destructive",
      });
    }
  };

  const handleSetReminder = () => {
    setIsReminderSet(!isReminderSet);
    toast({
      title: isReminderSet ? "Reminder removed" : "Reminder set",
      description: isReminderSet 
        ? "You will no longer receive notifications for this event" 
        : "You will be notified before the event starts",
    });
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: event?.title,
        text: event?.description,
        url: window.location.href,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (isLoading) {
    return (
      <PageContainer className="py-6">
        <div className="animate-pulse space-y-8">
          <div className="h-[400px] bg-muted rounded-lg"></div>
          <div className="h-8 bg-muted rounded w-3/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
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
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push('/events')}
          >
            Back to Events
          </Button>
        </div>
      </PageContainer>
    );
  }

  const progressPercentage = event.capacity 
    ? (event.registrations / event.capacity) * 100 
    : 0;

  return (
    <PageContainer className="py-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Back Button */}
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => router.push('/events')}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Button>
        </div>

        {/* Hero Section */}
        <div className="relative h-[500px] rounded-xl overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <Badge className="bg-primary">{event.type}</Badge>
              <Badge className="bg-secondary">{event.mode}</Badge>
              {event.price && <Badge className="bg-accent">{event.price}</Badge>}
            </div>
            <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
            <p className="text-lg opacity-90 max-w-3xl">{event.description}</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Date & Time</h3>
            </div>
            <p>{new Date(event.date).toLocaleDateString()}</p>
            <p className="text-muted-foreground">{event.time}</p>
          </div>

          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Location</h3>
            </div>
            <p>{event.location}</p>
            <a 
              href={`https://maps.google.com/?q=${encodeURIComponent(event.location)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary text-sm hover:underline"
            >
              View on Maps
            </a>
          </div>

          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Capacity</h3>
            </div>
            <div className="space-y-2">
              <p>{event.registrations} / {event.capacity || 'Unlimited'}</p>
              {event.capacity && (
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Rewards</h3>
            </div>
            <p>{event.rewards || 'No rewards specified'}</p>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="bg-card border rounded-lg p-8">
          <h3 className="text-lg font-semibold mb-4">Time Remaining</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 bg-background rounded-lg border">
              <div className="text-3xl font-bold text-primary">{countdown.days}</div>
              <div className="text-sm text-muted-foreground">Days</div>
            </div>
            <div className="text-center p-4 bg-background rounded-lg border">
              <div className="text-3xl font-bold text-primary">{countdown.hours}</div>
              <div className="text-sm text-muted-foreground">Hours</div>
            </div>
            <div className="text-center p-4 bg-background rounded-lg border">
              <div className="text-3xl font-bold text-primary">{countdown.minutes}</div>
              <div className="text-sm text-muted-foreground">Minutes</div>
            </div>
            <div className="text-center p-4 bg-background rounded-lg border">
              <div className="text-3xl font-bold text-primary">{countdown.seconds}</div>
              <div className="text-sm text-muted-foreground">Seconds</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mt-8">
          <Button 
            size="lg" 
            className="flex-1 md:flex-none"
            onClick={handleRegister}
            variant={isRegistered ? "destructive" : "default"}
          >
            {isRegistered ? 'Unregister' : 'Register Now'}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex-1 md:flex-none"
            onClick={handleSetReminder}
          >
            {isReminderSet ? 'Remove Reminder' : 'Set Reminder'}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex-1 md:flex-none"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>

        {/* Organizer Info */}
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Organizer</h3>
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12">
              <AvatarImage 
                src={event.organizer?.avatar} 
                alt={event.organizer?.name || 'Organizer'} 
              />
              <AvatarFallback 
                className={`${getAvatarColor(event.organizer?.name)} text-foreground font-medium flex items-center justify-center`}
              >
                {event.organizer?.name ? (
                  getInitials(event.organizer.name)
                ) : (
                  <User className="w-6 h-6 text-muted-foreground" />
                )}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{event.organizer?.name || 'Anonymous'}</p>
              <p className="text-sm text-muted-foreground">Organizer</p>
            </div>
          </div>
        </div>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Event Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Event Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Clicks</span>
                <span className="font-medium">{event.clicks}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Registrations</span>
                <span className="font-medium">{event.registrations}</span>
              </div>
            </div>
          </div>

          {event.dailyViews && event.dailyViews.length > 0 && (
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Daily Views</h3>
              <div className="h-[200px] flex items-end gap-2">
                {event.dailyViews.map((views, index) => (
                  <div
                    key={index}
                    className="bg-primary/20 hover:bg-primary/30 transition-colors rounded-t w-full"
                    style={{
                      height: `${(views / Math.max(...event.dailyViews!)) * 100}%`
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
} 