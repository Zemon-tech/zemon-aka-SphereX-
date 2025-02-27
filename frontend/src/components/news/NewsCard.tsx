"use client";

import { motion } from "framer-motion";
import { Calendar, Eye, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/api";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useRouter } from "next/navigation";

interface NewsCardProps {
  news: {
    id: string;
    title: string;
    category: string;
    date: string;
    image: string;
    excerpt: string;
    views: number;
  };
  onDelete?: () => void;
}

export default function NewsCard({ news, onDelete }: NewsCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        setIsAdmin(tokenData.role === 'admin');
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to delete the article');
      }

      const response = await fetch(`${API_BASE_URL}/api/news/${news.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete article');
      }

      toast({
        title: "Success",
        description: "Article deleted successfully",
      });

      // Navigate back to news list
      router.push('/news');
      router.refresh();

      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete article",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking delete
    setShowDeleteConfirm(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="group h-[24rem] cursor-pointer rounded-xl bg-card overflow-hidden hover:shadow-xl transition-all duration-300 border hover:border-primary/20"
      >
        {/* Image Container */}
        <div className="relative w-full h-[13rem] overflow-hidden">
          <img
            src={news.image}
            alt={news.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Category Badge */}
          <div className="absolute bottom-4 left-4">
            <Badge 
              variant="secondary" 
              className="backdrop-blur-md bg-white/90 text-foreground font-medium px-3 py-1.5 text-xs"
            >
              {news.category}
            </Badge>
          </div>

          {/* Delete Button - Show only if user is admin */}
          {isAdmin && (
            <div className="absolute top-4 right-4">
              <Button
                variant="destructive"
                size="icon"
                className="w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleDeleteClick}
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Content Container */}
        <div className="p-5 h-[11rem] flex flex-col">
          {/* Title */}
          <h3 className="text-xl font-semibold mb-4 line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {news.title}
          </h3>

          {/* Meta Information */}
          <div className="mt-auto flex items-center justify-between text-sm">
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span className="text-xs">{news.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span className="text-xs">{news.views} views</span>
              </div>
            </div>
            
            <span className="text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Read more →
            </span>
          </div>
        </div>
      </motion.div>

      {showDeleteConfirm && (
        <ConfirmDialog
          title="Delete Article"
          message="Are you sure you want to delete this article? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </>
  );
} 