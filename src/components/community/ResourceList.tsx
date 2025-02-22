"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Video, Wrench, ExternalLink, Trash2, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import axios from "axios";

interface Resource {
  _id: string;
  title: string;
  description: string;
  resourceType: 'PDF' | 'VIDEO' | 'TOOL';
  url: string;
  addedBy: {
    _id: string;
    name: string;
  } | null;
  createdAt: string;
}

const getResourceIcon = (type: string) => {
  switch (type.toUpperCase()) {
    case 'PDF':
      return FileText;
    case 'VIDEO':
      return Video;
    case 'TOOL':
      return Wrench;
    default:
      return FileText;
  }
};

export default function ResourceList() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resourceToDelete, setResourceToDelete] = useState<Resource | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchResources = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5002/api/community/resources', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Resources fetched:', response.data);
      setResources(response.data);
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError('Failed to load resources. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    // Get current user ID from token
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

  const handleDeleteClick = (resource: Resource) => {
    // Get current user ID from token
    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to delete resources.",
        variant: "destructive",
      });
      return;
    }

    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const currentUserId = tokenData.id;

      // Check if user is the creator
      if (currentUserId !== resource.addedBy?._id) {
        toast({
          title: "Permission Denied",
          description: "You are not authorized to delete this resource. Only the creator can delete it.",
          variant: "destructive",
        });
        return;
      }

      setResourceToDelete(resource);
    } catch (error) {
      console.error('Error decoding token:', error);
      toast({
        title: "Error",
        description: "Failed to verify permissions. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!resourceToDelete) return;

    try {
      setIsDeleting(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to delete a resource');
      }

      const response = await axios.delete(`http://localhost:5002/api/community/resources/${resourceToDelete._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Resource deleted successfully",
        });
        
        // Remove the deleted resource from the state
        setResources(prevResources => 
          prevResources.filter(r => r._id !== resourceToDelete._id)
        );
      }
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete resource",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setResourceToDelete(null);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading resources...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (resources.length === 0) {
    return <div className="text-center py-8">No resources found. Be the first to share one!</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources.map((resource, index) => {
          const Icon = getResourceIcon(resource.resourceType);
          return (
            <motion.div
              key={resource._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-md bg-primary/10">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold group-hover:text-primary transition-colors">
                            {resource.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {resource.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-4">
                        <Badge variant="secondary">
                          {resource.resourceType}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Added by {resource.addedBy?.name || 'Anonymous'}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(resource.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        onClick={() => window.open(resource.url, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      {/* Only show delete button if current user is the creator */}
                      {resource.addedBy && currentUserId === resource.addedBy._id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(resource)}
                          disabled={isDeleting}
                          className="shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {resourceToDelete && (
        <ConfirmDialog
          title="Delete Resource"
          message={`Are you sure you want to delete "${resourceToDelete.title}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setResourceToDelete(null)}
        />
      )}
    </>
  );
} 