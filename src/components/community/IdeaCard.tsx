"use client";

import { motion } from "framer-motion";
import { Heart, MessageSquare, Share2 } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface IdeaCardProps {
  idea: {
    id: string;
    title: string;
    description: string;
    author: {
      name: string;
      avatar: string;
    };
    likes: number;
    comments: number;
    tags: string[];
    createdAt: string;
  };
}

export default function IdeaCard({ idea }: IdeaCardProps) {
  return (
    <Card className="group hover:border-primary/50 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
              {idea.title}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
              {idea.description}
            </p>
          </div>
          <Avatar className="w-10 h-10">
            <AvatarImage src={idea.author.avatar} alt={idea.author.name} />
            <AvatarFallback>{idea.author.name[0]}</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {idea.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="px-6 py-4 border-t bg-muted/50">
        <div className="flex items-center justify-between w-full text-muted-foreground">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="gap-2">
              <Heart className="w-4 h-4" />
              {idea.likes}
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              {idea.comments}
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
} 