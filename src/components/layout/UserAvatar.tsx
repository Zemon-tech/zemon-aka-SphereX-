"use client";

import { ChevronDown, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

interface UserAvatarProps {
  user: {
    name: string;
    avatar?: string;
  };
  onLogout: () => void;
}

export default function UserAvatar({ user, onLogout }: UserAvatarProps) {
  const router = useRouter();
  const { toast } = useToast();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    try {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Call parent's logout handler
      onLogout();

      toast({
        title: "Success",
        description: "Logged out successfully",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative group">
      <div className="flex items-center gap-2 cursor-pointer">
        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span>{getInitials(user.name)}</span>
          )}
        </div>
        <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      </div>

      {/* Dropdown */}
      <div className="absolute right-0 mt-2 w-48 py-2 bg-card border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
        <div className="px-4 py-2 border-b">
          <p className="text-sm font-medium">{user.name}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-sm text-left text-destructive hover:bg-accent flex items-center gap-2 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
} 