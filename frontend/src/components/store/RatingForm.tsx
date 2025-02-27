import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

interface RatingFormProps {
  storeId: string;
  onReviewAdded: () => void;
  existingReview?: {
    rating: number;
    comment: string;
  } | null;
}

export default function RatingForm({ storeId, onReviewAdded, existingReview }: RatingFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment);
    }
  }, [existingReview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Error",
        description: "Please select a rating",
        variant: "destructive",
      });
      return;
    }

    if (comment && comment.length < 10) {
      toast({
        title: "Error",
        description: "If providing a comment, it must be at least 10 characters",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Error",
          description: "Please log in to submit a review",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/store/${storeId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          rating,
          ...(comment && { comment })
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: existingReview ? "Your review has been updated" : "Your review has been added",
        });
        setIsEditing(false);
        onReviewAdded();
      } else {
        throw new Error(data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (existingReview && !isEditing) {
    return (
      <div className="space-y-4">
        <div className="bg-card border rounded-xl p-6">
          <h3 className="font-medium mb-3">Your Rating</h3>
          <div className="flex gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((value) => (
              <Star
                key={value}
                className={`w-6 h-6 ${
                  value <= rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-muted text-muted"
                }`}
              />
            ))}
          </div>
          {existingReview.comment && (
            <>
              <h3 className="font-medium mb-2">Your Review</h3>
              <p className="text-muted-foreground">{existingReview.comment}</p>
            </>
          )}
        </div>
        <Button 
          onClick={() => setIsEditing(true)}
          variant="outline"
          className="w-full"
        >
          Update Your Review
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Your Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              className="focus:outline-none"
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(value)}
            >
              <Star
                className={`w-6 h-6 transition-colors ${
                  value <= (hoverRating || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-muted text-muted"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Your Review (Optional)</label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review here... (optional, but if provided must be at least 10 characters)"
          className="min-h-[100px]"
        />
      </div>

      <div className="flex gap-3">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? "Submitting..." : existingReview ? "Update Review" : "Submit Review"}
        </Button>
        {existingReview && (
          <Button 
            type="button"
            variant="outline"
            onClick={() => {
              setIsEditing(false);
              setRating(existingReview.rating);
              setComment(existingReview.comment);
            }}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
} 