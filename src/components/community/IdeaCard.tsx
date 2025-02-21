"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Trash2, Loader2, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

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
  onRefresh?: () => void;
}

export default function IdeaCard({ idea, onDelete, onRefresh }: IdeaCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Generate avatar URL using UI Avatars
  const authorName = idea.author?.name || 'Anonymous';
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random`;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this idea? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      await axios.delete(`http://localhost:5002/api/community/ideas/${idea.id}`);
      toast({
        title: "Success",
        description: "Idea deleted successfully",
      });
      onDelete?.();
    } catch (error) {
      console.error('Error deleting idea:', error);
      toast({
        title: "Error",
        description: "Failed to delete idea. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddComment = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add a comment.",
        variant: "destructive",
      });
      router.push('/login');
      return;
    }

    if (!newComment.trim()) return;

    try {
      setIsSubmittingComment(true);
      const response = await axios.post(
        `http://localhost:5002/api/community/ideas/${idea.id}/comments`,
        { text: newComment },
        {
          headers: {
            'Authorization': `Bearer ${token}`, // Add Bearer prefix back
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Comment added successfully",
        });
        setNewComment("");
        setShowComments(true);
        onRefresh?.();
      }
    } catch (error: any) {
      console.error('Error adding comment:', error);
      
      // Handle different error cases
      if (error.response) {
        switch (error.response.status) {
          case 401:
            localStorage.removeItem('token');
            toast({
              title: "Session Expired",
              description: "Please log in again to continue.",
              variant: "destructive",
            });
            router.push('/login');
            break;
          case 404:
            toast({
              title: "Error",
              description: "The idea was not found.",
              variant: "destructive",
            });
            break;
          default:
            toast({
              title: "Error",
              description: error.response.data.message || "Failed to add comment",
              variant: "destructive",
            });
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to connect to server",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmittingComment(false);
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
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle className="w-4 h-4" />
          {(idea.comments?.length || 0)} Comments
        </Button>

        {showComments && (
          <div className="w-full space-y-4">
            {/* Comments list */}
            {idea.comments?.map((comment) => (
              <div key={comment._id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.avatar} alt={comment.username} />
                  <AvatarFallback>
                    {comment.username ? comment.username[0].toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {comment.username || 'Unknown User'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{comment.text}</p>
                </div>
              </div>
            ))}

            {/* Comment input */}
            <div className="flex gap-2">
              <Input
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              />
              <Button 
                onClick={handleAddComment}
                disabled={isSubmittingComment || !newComment.trim()}
              >
                {isSubmittingComment ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Post'
                )}
              </Button>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}