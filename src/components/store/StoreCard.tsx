"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Tool {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  developer: {
    _id: string;
    name: string;
  };
}

interface StoreCardProps {
  tool: Tool;
  currentUserId: string | null;
  onDelete?: () => void;
}

export default function StoreCard({ tool, currentUserId, onDelete }: StoreCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  const handleVisitClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(tool.url, '_blank', 'noopener,noreferrer');
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Check if user is the creator of the tool
    if (currentUserId !== tool.developer._id) {
      toast({
        title: "Permission Denied",
        description: "You are not authorized to delete this tool. Only the creator can delete it.",
        variant: "destructive",
      });
      return;
    }
    
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to delete a tool');
      }

      // Double check permission before making the request
      if (currentUserId !== tool.developer._id) {
        throw new Error('You are not authorized to delete this tool');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/store/${tool.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete tool');
      }

      toast({
        title: "Success",
        description: "Tool deleted successfully",
      });

      // Call the onDelete callback to refresh the list
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error('Error deleting tool:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete tool",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  // Get developer name safely
  const developerName = tool.developer?.name || 'Unknown Developer';

  // Get first 3 words of description
  const shortDescription = tool.description
    .split(' ')
    .slice(0, 3)
    .join(' ')
    .concat('...');

  return (
    <>
      <Link href={`/store/${tool.id}`}>
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="group relative h-[160px] bg-card rounded-2xl border hover:border-primary/20 hover:shadow-lg transition-all duration-300"
        >
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                {/* Logo */}
                <div className="relative w-14 h-14">
                  <img
                    src={tool.thumbnail}
                    alt={tool.title}
                    className="w-full h-full rounded-[18px] object-cover shadow-sm group-hover:shadow-md transition-all duration-300"
                  />
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    by {developerName}
                  </p>
                </div>
              </div>

              {/* Visit Button */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleVisitClick}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
                {currentUserId === tool.developer._id && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleDeleteClick}
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground mt-auto line-clamp-1">
              {shortDescription}
            </p>
          </div>
        </motion.article>
      </Link>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tool</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{tool.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 