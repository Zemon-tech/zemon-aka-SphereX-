"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2, Github, Mail, Phone, User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  github_username?: string;
  phone?: string;
  role: string;
}

interface ProfileEditFormProps {
  user: User | null;
  onClose: () => void;
  onUpdate: (user: User) => void;
}

export default function ProfileEditForm({ user, onClose, onUpdate }: ProfileEditFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    github_username: user?.github_username || "",
    phone: user?.phone || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate passwords if being changed
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error("New passwords don't match");
        }
        if (formData.newPassword.length < 8) {
          throw new Error("Password must be at least 8 characters");
        }
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Update local storage with new user data
      localStorage.setItem('user', JSON.stringify(data.data));
      
      onUpdate(data.data);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      onClose();
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            <h2 className="text-xl font-semibold">Edit Profile</h2>
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
            <div className="space-y-1">
              <label className="text-sm font-medium">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 px-3 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary/20"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 px-3 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary/20"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">GitHub Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  <Github className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={formData.github_username}
                  onChange={(e) => setFormData({ ...formData, github_username: e.target.value })}
                  className="w-full pl-10 px-3 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary/20"
                  placeholder="github_username"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 px-3 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary/20"
                  placeholder="+1234567890"
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium mb-4">Change Password</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Current Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      value={formData.currentPassword}
                      onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                      className="w-full pl-10 px-3 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary/20"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      className="w-full pl-10 px-3 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary/20"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Confirm New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full pl-10 px-3 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary/20"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
} 