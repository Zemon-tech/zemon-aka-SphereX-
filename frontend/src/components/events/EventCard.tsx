"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Trash2, Monitor, Globe } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { Badge } from "@/components/ui/badge";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    attendees: number;
    price: string;
    rewards: string;
    image: string;
    tags: string[];
    mode: 'online' | 'in-person' | 'hybrid';
    organizer: {
      _id?: string;
      name: string;
      avatar?: string;
    };
  };
  onDelete?: () => void;
}

export default function EventCard({ event, onDelete }: EventCardProps) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(tokenData.id);
        setIsAdmin(tokenData.role === 'admin');
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowDeleteConfirm(true);
  };

  const isAuthorOrAdmin = currentUserId === event.organizer?._id || isAdmin;

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'online':
        return <Monitor className="w-4 h-4" />;
      case 'hybrid':
        return <Globe className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'online':
        return 'bg-blue-100 text-blue-600';
      case 'hybrid':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-green-100 text-green-600';
    }
  };

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="group relative rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      >
        {isAuthorOrAdmin && (
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button
              onClick={handleDeleteClick}
              className="p-2 rounded-full bg-background/80 hover:bg-background border shadow-sm text-destructive hover:bg-red-50"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}

        <Link href={`/events/${event.id}`}>
          <div className="relative h-40">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <Badge 
                className={`${getModeColor(event.mode)} border-0 flex items-center gap-1`}
              >
                {getModeIcon(event.mode)}
                {event.mode}
              </Badge>
              {event.price && (
                <Badge variant="secondary" className="bg-background/90">
                  {event.price}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
              {event.title}
            </h2>
            
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-primary shrink-0" />
                <span className="truncate">{event.date} • {event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-primary shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
            </div>
          </div>
        </Link>
      </motion.article>

      {showDeleteConfirm && (
        <ConfirmDialog
          title="Delete Event"
          message="Are you sure you want to delete this event? This action cannot be undone."
          onConfirm={async () => {
            if (onDelete) {
              onDelete();
            }
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </>
  );
} 