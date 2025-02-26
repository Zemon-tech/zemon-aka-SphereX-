"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Heart, MessageSquare, Share2, Trophy, ArrowLeft, User, Check, Bell, BellPlus, Twitter, Linkedin, Globe, Mail, Phone, Facebook, Instagram } from "lucide-react";
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
  registrationDeadline?: string;
  entryFee?: {
    amount: number;
    currency: string;
  };
  highlights?: string[];
  speakers?: Array<{
    name: string;
    role?: string;
    bio?: string;
    image?: string;
    social?: {
      twitter?: string;
      linkedin?: string;
      website?: string;
    };
  }>;
  workshops?: Array<{
    title: string;
    description?: string;
    speaker?: string;
    duration?: string;
    requirements?: string;
  }>;
  eligibility?: string;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  pastHighlights?: Array<{
    title?: string;
    description?: string;
    image?: string;
  }>;
  sponsors?: Array<{
    name: string;
    logo?: string;
    website?: string;
    tier?: 'platinum' | 'gold' | 'silver' | 'bronze' | 'partner';
  }>;
  socialMedia?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    discord?: string;
  };
  contactInfo?: {
    email?: string;
    phone?: string;
    whatsapp?: string;
  };
  rewards?: string;
  image: string;
  tags: string[];
  website?: string;
  organizer: {
    name: string;
    avatar: string;
  };
  registrations: number;
  clicks: number;
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
      
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to view event details",
          variant: "destructive",
        });
        router.push('/login');
        return;
      }
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
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
          <p className="text-muted-foreground">The event you&apos;re looking for doesn&apos;t exist or has been removed.</p>
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
      <div className="max-w-7xl mx-auto">
        {/* Back Button with Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 hover:bg-transparent hover:text-primary"
            onClick={() => router.push('/events')}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Button>
          <span>/</span>
          <span className="text-foreground">Event Details</span>
        </div>

        {/* Hero Section with Gradient Overlay */}
        <div className="relative h-[500px] rounded-xl overflow-hidden mb-8">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="max-w-3xl">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-primary/20 text-primary hover:bg-primary/30">{event.mode}</Badge>
                <Badge className="bg-secondary/20 text-secondary-foreground hover:bg-secondary/30">{event.type}</Badge>
                {event.entryFee && event.entryFee.amount > 0 && event.entryFee.currency && (
                  <Badge variant="outline" className="border-green-500 text-green-500">
                    {event.entryFee.amount} {event.entryFee.currency}
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl font-bold mb-4 leading-tight">{event.title}</h1>
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span>{event.registrations} Registered</span>
                </div>
              </div>
                </div>
              </div>
            </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4 p-6 bg-card rounded-xl border shadow-sm">
              <Button
                size="lg"
                onClick={handleRegister}
                variant={isRegistered ? "outline" : "default"}
                className={isRegistered ? "border-primary text-primary hover:bg-primary/5" : ""}
              >
                {isRegistered ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Registered
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4 mr-2" />
                    Register Now
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleSetReminder}
                className="border-primary text-primary hover:bg-primary/5"
              >
                {isReminderSet ? (
                  <>
                    <Bell className="w-4 h-4 mr-2" />
                    Reminder Set
                  </>
                ) : (
                  <>
                    <BellPlus className="w-4 h-4 mr-2" />
                    Set Reminder
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleShare}
                className="border-primary text-primary hover:bg-primary/5"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>

            {/* About Section */}
            <div className="p-6 bg-card rounded-xl border shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">About the Event</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">{event.description}</p>
          </div>

            {/* Highlights Section */}
            {event.highlights && event.highlights.length > 0 && (
              <div className="p-6 bg-card rounded-xl border shadow-sm">
                <h2 className="text-2xl font-semibold mb-4">Event Highlights</h2>
                <div className="grid gap-4">
                  {event.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-1.5">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                      <p className="flex-1">{highlight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Speakers Section */}
            {event.speakers && event.speakers.length > 0 && (
              <div className="p-6 bg-card rounded-xl border shadow-sm">
                <h2 className="text-2xl font-semibold mb-6">Featured Speakers</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {event.speakers.map((speaker, index) => (
                    <div key={index} className="flex gap-4 p-4 rounded-lg bg-muted/50">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={speaker.image} alt={speaker.name} />
                        <AvatarFallback className={getAvatarColor(speaker.name)}>
                          {getInitials(speaker.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <h3 className="font-semibold">{speaker.name}</h3>
                        {speaker.role && <p className="text-sm text-muted-foreground">{speaker.role}</p>}
                        {speaker.bio && <p className="text-sm mt-2">{speaker.bio}</p>}
                        {speaker.social && (
                          <div className="flex gap-3 mt-3">
                            {speaker.social.twitter && (
                              <a href={speaker.social.twitter} target="_blank" rel="noopener noreferrer" 
                                 className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="h-4 w-4" />
                              </a>
                            )}
                            {speaker.social.linkedin && (
                              <a href={speaker.social.linkedin} target="_blank" rel="noopener noreferrer"
                                 className="text-muted-foreground hover:text-primary transition-colors">
                                <Linkedin className="h-4 w-4" />
                              </a>
                            )}
                            {speaker.social.website && (
                              <a href={speaker.social.website} target="_blank" rel="noopener noreferrer"
                                 className="text-muted-foreground hover:text-primary transition-colors">
                                <Globe className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Workshops Section */}
            {event.workshops && event.workshops.length > 0 && (
              <div className="p-6 bg-card rounded-xl border shadow-sm">
                <h2 className="text-2xl font-semibold mb-6">Workshop Sessions</h2>
                <div className="grid gap-6">
                  {event.workshops.map((workshop, index) => (
                    <div key={index} className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-start justify-between">
                <div>
                          <h3 className="font-semibold text-lg">{workshop.title}</h3>
                          {workshop.speaker && (
                            <p className="text-sm text-primary mt-1">By {workshop.speaker}</p>
                          )}
                        </div>
                        {workshop.duration && (
                          <Badge variant="outline" className="ml-2">
                            {workshop.duration}
                          </Badge>
                        )}
                      </div>
                      {workshop.description && (
                        <p className="text-muted-foreground mt-2">{workshop.description}</p>
                      )}
                      {workshop.requirements && (
                        <div className="mt-4 p-3 rounded-lg bg-background">
                          <p className="text-sm font-medium">Requirements:</p>
                          <p className="text-sm text-muted-foreground">{workshop.requirements}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
              </div>

          {/* Right Column - Event Details & Info */}
          <div className="space-y-8">
            {/* Countdown Timer */}
            <div className="p-6 bg-card rounded-xl border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Event Starts In</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-primary">{countdown.days}</p>
                  <p className="text-xs text-muted-foreground">Days</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-primary">{countdown.hours}</p>
                  <p className="text-xs text-muted-foreground">Hours</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-primary">{countdown.minutes}</p>
                  <p className="text-xs text-muted-foreground">Minutes</p>
                  </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-primary">{countdown.seconds}</p>
                  <p className="text-xs text-muted-foreground">Seconds</p>
                </div>
              </div>
            </div>

            {/* Registration Progress */}
            {event.capacity && (
              <div className="p-6 bg-card rounded-xl border shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Registration Progress</h3>
                  <span className="text-sm text-muted-foreground">
                    {event.registrations}/{event.capacity}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${Math.min((event.registrations / event.capacity) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {event.capacity - event.registrations} spots remaining
                </p>
              </div>
            )}

            {/* Contact Information */}
            {event.contactInfo && (
              <div className="p-6 bg-card rounded-xl border shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="space-y-3">
                  {event.contactInfo.email && (
                    <a href={`mailto:${event.contactInfo.email}`} 
                       className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                      <Mail className="h-4 w-4" />
                      <span>{event.contactInfo.email}</span>
                    </a>
                  )}
                  {event.contactInfo.phone && (
                    <a href={`tel:${event.contactInfo.phone}`}
                       className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                      <Phone className="h-4 w-4" />
                      <span>{event.contactInfo.phone}</span>
                    </a>
                  )}
                  {event.contactInfo.whatsapp && (
                    <a href={`https://wa.me/${event.contactInfo.whatsapp}`}
                       className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                       target="_blank" rel="noopener noreferrer">
                      <MessageSquare className="h-4 w-4" />
                      <span>WhatsApp</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Social Media Links */}
            {event.socialMedia && Object.values(event.socialMedia).some(Boolean) && (
              <div className="p-6 bg-card rounded-xl border shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
                <div className="flex flex-wrap gap-4">
                  {event.socialMedia.twitter && (
                    <a href={event.socialMedia.twitter} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                      <Twitter className="h-4 w-4" />
                      <span>Twitter</span>
                    </a>
                  )}
                  {event.socialMedia.facebook && (
                    <a href={event.socialMedia.facebook} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                      <Facebook className="h-4 w-4" />
                      <span>Facebook</span>
                    </a>
                  )}
                  {event.socialMedia.instagram && (
                    <a href={event.socialMedia.instagram} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                      <Instagram className="h-4 w-4" />
                      <span>Instagram</span>
                    </a>
                  )}
                  {event.socialMedia.linkedin && (
                    <a href={event.socialMedia.linkedin} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                      <Linkedin className="h-4 w-4" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {event.socialMedia.discord && (
                    <a href={event.socialMedia.discord} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                      <MessageSquare className="h-4 w-4" />
                      <span>Discord</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="p-6 bg-card rounded-xl border shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-muted">
                  {tag}
                </Badge>
              ))}
            </div>
              </div>
            )}
          </div>
        </div>

        {/* FAQs Section */}
        {event.faqs && event.faqs.length > 0 && (
          <div className="mt-8 p-6 bg-card rounded-xl border shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
            <div className="grid gap-4">
              {event.faqs.map((faq, index) => (
                <div key={index} className="p-4 rounded-lg bg-muted/50">
                  <h3 className="font-medium text-lg mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sponsors Section */}
        {event.sponsors && event.sponsors.length > 0 && (
          <div className="mt-8 p-6 bg-card rounded-xl border shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Our Sponsors</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {event.sponsors.map((sponsor, index) => (
                <div key={index} className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
                  {sponsor.logo ? (
                    <img 
                      src={sponsor.logo} 
                      alt={sponsor.name}
                      className="h-20 w-auto object-contain mb-3"
                    />
                  ) : (
                    <div className="h-20 w-full bg-muted rounded-lg flex items-center justify-center mb-3">
                      {sponsor.name}
                    </div>
                  )}
                  <h3 className="font-medium">{sponsor.name}</h3>
                  {sponsor.tier && (
                    <Badge variant="outline" className="mt-2">
                      {sponsor.tier}
                    </Badge>
                  )}
                  {sponsor.website && (
                    <a 
                      href={sponsor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline mt-2"
                    >
                      Visit Website
                    </a>
                  )}
              </div>
              ))}
            </div>
          </div>
        )}

        {/* Website Link */}
        {event.website && (
          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              size="lg"
              className="gap-2"
              onClick={() => window.open(event.website, '_blank')}
            >
              <Globe className="w-4 h-4" />
              Visit Official Website
            </Button>
          </div>
        )}
      </div>
    </PageContainer>
  );
} 