"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Check, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AvatarUploadProps {
  currentAvatar?: string;
  onUpload: (url: string) => void;
}

export default function AvatarUpload({ currentAvatar, onUpload }: AvatarUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      await handleFileUpload(file);
    } else {
      toast({
        title: "Invalid file",
        description: "Please upload an image file",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      // Simulate file upload - replace with actual upload logic
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response - replace with actual upload response
      const uploadedUrl = URL.createObjectURL(file);
      onUpload(uploadedUrl);
      
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload profile picture",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        id="avatar-upload"
      />
      
      <motion.div
        className={`relative w-24 h-24 rounded-full overflow-hidden border-4 ${
          isDragging ? 'border-primary' : 'border-background'
        } shadow-xl`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        animate={{ scale: isDragging ? 1.05 : 1 }}
      >
        <img
          src={currentAvatar || "/placeholder-avatar.jpg"}
          alt="Profile"
          className="w-full h-full object-cover"
        />
        
        <AnimatePresence>
          {(isDragging || isUploading) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center"
            >
              {isUploading ? (
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              ) : (
                <Upload className="w-6 h-6 text-primary" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <label
        htmlFor="avatar-upload"
        className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-primary text-primary-foreground cursor-pointer shadow-lg"
      >
        <Upload className="w-4 h-4" />
      </label>
    </div>
  );
} 