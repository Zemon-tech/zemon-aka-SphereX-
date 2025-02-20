"use client";

import { motion } from "framer-motion";
import { Calendar, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
}

export default function NewsCard({ news }: NewsCardProps) {
  return (
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
  );
} 