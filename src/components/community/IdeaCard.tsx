"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Trash2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

interface IdeaCardProps {
  idea: {
    _id: string;
    title: string;
    description: string;
    author: string;
    authorName: string;
    createdAt: string;
  };
  onDelete?: () => void;
}

export default function IdeaCard({ idea, onDelete }: IdeaCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Add fallback for authorName
  const authorName = idea.authorName || 'Anonymous';
  
  // Generate avatar URL using the author's name with fallback
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random`;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this idea? This action cannot be undone.')) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: "Error",
        description: "Please login to delete ideas",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsDeleting(true);
      await axios.delete(`http://localhost:5002/api/community/ideas/${idea._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      toast({
        title: "Success",
        description: "Idea deleted successfully",
      });
      onDelete?.();
    } catch (error: any) {
      console.error('Error deleting idea:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete idea. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="h-full flex flex-col hover:border-primary/50 transition-colors">
      <CardHeader className="flex-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatarUrl} alt={authorName} />
              <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-medium">{authorName}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(idea.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          {user._id === idea.author && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={isDeleting}
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <h3 className="font-semibold mb-2">{idea.title}</h3>
        <p className="text-sm text-muted-foreground">{idea.description}</p>
      </CardContent>
    </Card>
  );
} 