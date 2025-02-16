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
      className="group h-[28rem] cursor-pointer rounded-xl border bg-card overflow-hidden hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative w-full h-[15rem] overflow-hidden">
        <img
          src={news.image}
          alt={news.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute top-4 left-4">
          <Badge 
            variant="secondary" 
            className="backdrop-blur-md bg-white/90 text-foreground font-medium px-3 py-1"
          >
            {news.category}
          </Badge>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-6 h-[13rem] flex flex-col">
        <div className="flex items-center gap-4 text-sm text-muted-foreground/80 mb-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {news.date}
          </div>
          <div className="flex items-center gap-1.5">
            <Eye className="w-4 h-4" />
            {news.views} views
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-2.5 line-clamp-2 group-hover:text-primary transition-colors duration-300">
          {news.title}
        </h3>

        <p className="text-muted-foreground/90 text-sm line-clamp-2 mb-4 leading-relaxed">
          {news.excerpt}
        </p>

        <div className="mt-auto">
          <span className="inline-flex items-center text-sm font-medium text-primary group-hover:underline">
            Read more
          </span>
        </div>
      </div>
    </motion.div>
  );
} 