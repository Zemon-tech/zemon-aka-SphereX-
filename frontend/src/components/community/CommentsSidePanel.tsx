import { useState, useEffect, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import { X, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Comment {
  _id: string;
  userId: string;
  username: string;
  avatar: string;
  text: string;
  createdAt: string;
}

interface CommentsSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  ideaId: string;
  ideaTitle: string;
  comments: Comment[];
  onRefresh?: () => void;
}

export default function CommentsSidePanel({
  isOpen,
  onClose,
  ideaId,
  ideaTitle,
  comments: initialComments,
  onRefresh
}: CommentsSidePanelProps) {
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [localComments, setLocalComments] = useState<Comment[]>(initialComments);
  const commentsContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const router = useRouter();

  // Scroll to bottom when new comments are added
  useEffect(() => {
    if (commentsContainerRef.current) {
      commentsContainerRef.current.scrollTop = commentsContainerRef.current.scrollHeight;
    }
  }, [localComments]);

  useEffect(() => {
    setLocalComments(initialComments);
  }, [initialComments]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(tokenData.id);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const handleAddComment = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add a comment.",
        variant: "destructive",
      });
      router.push('/auth/login');
      return;
    }

    if (!newComment.trim()) return;

    try {
      setIsSubmittingComment(true);
      const response = await axios.post(
        `http://localhost:5002/api/community/ideas/${ideaId}/comments`,
        { text: newComment },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.data.success) {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const newCommentObj: Comment = {
          _id: response.data.data._id || Date.now().toString(),
          userId: tokenData.id,
          username: tokenData.name,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(tokenData.name)}&background=random`,
          text: newComment,
          createdAt: new Date().toISOString()
        };

        setLocalComments(prev => [...prev, newCommentObj]);
        setNewComment("");
        onRefresh?.();

        toast({
          title: "Success",
          description: "Comment added successfully",
        });
      }
    } catch (error: unknown) {
      console.error('Error adding comment:', error);
      
      if (axios.isAxiosError(error) && error.response) {
        switch (error.response.status) {
          case 401:
            localStorage.removeItem('token');
            toast({
              title: "Session Expired",
              description: "Please log in again to continue.",
              variant: "destructive",
            });
            router.push('/auth/login');
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
              description: error.response.data?.message || "Failed to add comment",
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

  if (!isOpen) return null;

  return (
    <div className="fixed top-[64px] right-0 bottom-0 w-96 bg-background border-l shadow-lg z-50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-6 border-b bg-card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold">{ideaTitle}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 -mr-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">Comments ({localComments.length})</p>
      </div>

      {/* Comments List */}
      <div ref={commentsContainerRef} className="flex-1 overflow-y-auto scroll-smooth" id="comments-container">
        {localComments.length > 0 ? (
          <div className="divide-y">
            {localComments.map((comment) => (
              <div key={comment._id} className="p-4 hover:bg-muted/50">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.avatar} alt={comment.username} />
                    <AvatarFallback>
                      {comment.username ? comment.username[0].toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {comment.username || 'Unknown User'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{comment.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>

      {/* Comment Input */}
      <div className="p-4 border-t bg-card">
        {currentUserId ? (
          <div className="flex gap-2">
            <Input
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              className="flex-1"
            />
            <Button 
              onClick={handleAddComment}
              disabled={isSubmittingComment || !newComment.trim()}
              className="shrink-0"
            >
              {isSubmittingComment ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Post'
              )}
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Sign in to add a comment</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/auth/login')}
            >
              Sign in
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 