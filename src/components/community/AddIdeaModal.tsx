"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

interface AddIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIdeaAdded?: () => void;
}

export default function AddIdeaModal({ isOpen, onClose, onIdeaAdded }: AddIdeaModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Detailed auth check logging
    console.log('Auth Check:', {
      hasToken: Boolean(token),
      tokenValue: token ? `${token.substring(0, 10)}...` : 'missing',
      user,
      hasUserId: Boolean(user?._id),
      localStorage: {
        allKeys: Object.keys(localStorage),
        token: Boolean(localStorage.getItem('token')),
        user: Boolean(localStorage.getItem('user'))
      }
    });

    if (!token || !user?._id) {
      console.log('Auth check failed:', { token: Boolean(token), userId: Boolean(user?._id) });
      toast({
        title: "Error",
        description: "Please login to share ideas",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      console.log('Making API request:', {
        url: 'http://localhost:5002/api/community/ideas',
        data: formData,
        headers: config.headers
      });

      const response = await axios.post(
        'http://localhost:5002/api/community/ideas',
        formData,
        config
      );

      console.log('API Response:', response.data);

      if (response.status === 201) {
        toast({
          title: "Success",
          description: "Your idea has been shared successfully!",
        });
        setFormData({
          title: "",
          description: "",
          tags: "",
        });
        onIdeaAdded?.();
        onClose();
      }
    } catch (error: any) {
      console.error('Request error:', {
        error,
        response: error.response?.data,
        status: error.response?.status
      });

      if (error.response?.status === 401) {
        console.log('Auth failed - clearing session');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        toast({
          title: "Authentication Error",
          description: "Session expired. Please login again.",
          variant: "destructive",
        });
        
        window.location.href = '/login';
      } else {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to share your idea. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
    >
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card w-full max-w-lg rounded-xl border shadow-lg"
        >
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">Share Your Idea</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-muted"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter your idea title"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your idea in detail"
                className="min-h-[120px]"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tags</label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="Add tags separated by commas"
              />
              <p className="text-xs text-muted-foreground">
                Example: React, TypeScript, Web Development
              </p>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sharing...
                  </>
                ) : (
                  'Share Idea'
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
} 