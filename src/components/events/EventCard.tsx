"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Edit2, Trash2, Trophy } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

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
    e.preventDefault(); // Prevent navigation
    setShowDeleteConfirm(true);
  };

  const isAuthorOrAdmin = currentUserId === event.organizer?._id || isAdmin;

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="group relative rounded-lg border bg-card overflow-hidden hover:shadow-lg transition-shadow"
      >
        {/* Delete Button */}
        {isAuthorOrAdmin && (
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button
              onClick={handleDeleteClick}
              className="p-2 rounded-full bg-background/80 hover:bg-background border shadow-sm text-destructive"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}

        <Link href={`/events/${event.id}`}>
          <div className="relative h-48">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
          
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar size={14} />
                <span>{event.date}</span>
                <span>•</span>
                <span>{event.time}</span>
              </div>
              <span className="ml-auto text-sm font-medium text-primary">
                {event.price}
              </span>
            </div>
            
            <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
              {event.title}
            </h2>
            
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
              {event.description}
            </p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <MapPin size={16} />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users size={16} />
                <span>{event.attendees} attendees</span>
              </div>
            </div>

            {event.rewards && (
              <div className="flex items-center gap-2 text-sm">
                <Trophy className="text-yellow-500" size={16} />
                <span className="text-muted-foreground">{event.rewards}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mt-4">
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
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