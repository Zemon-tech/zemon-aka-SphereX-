"use client";

import { Button } from "@/components/ui/button";
import { Github, Star } from "lucide-react";
import Image from "next/image";

interface RepoHeaderProps {
  name: string;
  description: string;
  avatar: string;
  githubUrl: string;
  isStarred?: boolean;
  onStar?: () => void;
}

export default function RepoHeader({ name, description, avatar, githubUrl, isStarred, onStar }: RepoHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 bg-card rounded-xl p-6 border shadow-sm">
      <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-primary/10">
        <Image
          src={avatar}
          alt={name}
          fill
          className="object-cover"
          loading="eager"
          priority
        />
      </div>
      
      <div className="flex-1">
        <h1 className="text-3xl font-bold">{name}</h1>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>
      
      <div className="flex gap-3 self-stretch md:self-center">
        <Button variant="outline" size="sm" asChild>
          <a 
            href={githubUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <Github className="w-4 h-4" />
            View on GitHub
          </a>
        </Button>
        <Button 
          size="sm"
          onClick={onStar}
          className="flex items-center gap-2"
        >
          <Star className="w-4 h-4" />
          {isStarred ? 'Unstar' : 'Star'}
        </Button>
      </div>
    </div>
  );
} 