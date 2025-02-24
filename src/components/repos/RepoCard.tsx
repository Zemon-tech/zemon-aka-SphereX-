"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, GitFork, Eye, GitBranch, Code, MessageCircle, GitPullRequest, ExternalLink, Github, Trash2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
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

interface RepoCardProps {
  id: string;
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  githubUrl: string;
  updatedAt: string;
  creator: {
    name: string;
    id: string;
  };
  currentUserId?: string | null;
  onDelete?: () => void;
  onGitHubClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function RepoCard({
  id,
  name,
  description,
  stars,
  forks,
  language,
  githubUrl,
  updatedAt,
  creator,
  currentUserId,
  onDelete,
  onGitHubClick
}: RepoCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if user is the creator
    if (currentUserId !== creator.id) {
      toast({
        title: "Permission Denied",
        description: "You are not authorized to delete this repository. Only the creator can delete it.",
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
        throw new Error('Please log in to delete a repository');
      }

      // Double check permission before making the request
      if (currentUserId !== creator.id) {
        throw new Error('You are not authorized to delete this repository');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/repos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete repository');
      }

      toast({
        title: "Success",
        description: "Repository deleted successfully",
      });

      // Call the onDelete callback to refresh the list
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error('Error deleting repository:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete repository",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Card className="hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Header Section */}
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <Link
                  href={`/repos/${id}`}
                  className="text-lg font-semibold hover:text-primary transition-colors line-clamp-1 block"
                >
                  {name}
                </Link>
                <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-2">
                  <span className="line-clamp-1">by {creator.name}</span>
                </p>
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={onGitHubClick}
                  title="View on GitHub"
                >
                  <Github className="w-4 h-4" />
                </Button>
                <Link href={`/repos/${id}`}>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8"
                    title="View Details"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </Link>
                {currentUserId === creator.id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive/90"
                    onClick={handleDeleteClick}
                    disabled={isLoading}
                    title="Delete Repository"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
              {description || "No description provided"}
            </p>

            {/* Stats & Info */}
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <Badge 
                variant="secondary" 
                className="font-medium"
              >
                {language}
              </Badge>
              
              <div className="flex items-center gap-1 text-muted-foreground" title="Stars">
                <Star className="w-3.5 h-3.5" />
                {stars.toLocaleString()}
              </div>
              
              <div className="flex items-center gap-1 text-muted-foreground" title="Forks">
                <GitFork className="w-3.5 h-3.5" />
                {forks.toLocaleString()}
              </div>
              
              <div className="text-xs text-muted-foreground ml-auto" title={new Date(updatedAt).toLocaleString()}>
                Updated {new Date(updatedAt).toLocaleDateString(undefined, { 
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Repository</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end sm:justify-start">
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
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 