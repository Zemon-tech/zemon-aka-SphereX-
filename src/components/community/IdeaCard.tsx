"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { Trash2, Loader2, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

interface Comment {
  _id: string;
  userId: string;
  username: string;
  avatar: string;
  text: string;
  createdAt: string;
}

interface IdeaCardProps {
  idea: {
    id: string;
    title: string;
    description: string;
    author: {
      _id: string;
      name: string;
    } | null;
    comments: Comment[];
    createdAt: string;
  };
  onDelete?: () => void;
  onCommentClick?: () => void;
}

export default function IdeaCard({ idea, onDelete, onCommentClick }: IdeaCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        setIsAdmin(tokenData.role === 'admin');
        setCurrentUserId(tokenData.id);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  // Generate avatar URL using UI Avatars
  const authorName = idea.author?.name || 'Anonymous';
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random`;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this idea? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to delete the idea');
      }

      const response = await axios.delete(`http://localhost:5002/api/community/ideas/${idea.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Idea deleted successfully",
        });
        onDelete?.();
      }
    } catch (error: unknown) {
      console.error('Error deleting idea:', error);
      if (axios.isAxiosError(error)) {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to delete idea. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete idea. Please try again.",
          variant: "destructive",
        });
      }
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
          {(isAdmin || currentUserId === idea.author?._id) && (
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
      <CardFooter className="flex flex-col gap-4 pt-4">
        <Button
          variant="ghost"
          size="sm"
          className="w-full flex gap-2"
          onClick={onCommentClick}
        >
          <MessageCircle className="w-4 h-4" />
          {(idea.comments?.length || 0)} Comments
        </Button>
      </CardFooter>
    </Card>
  );
}