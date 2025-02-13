"use client";

import { motion } from "framer-motion";
import { Calendar, Edit2, Trash2, Eye } from "lucide-react";
import Link from "next/link";

interface NewsCardProps {
  news: {
    id: string;
    title: string;
    category: string;
    date: string;
    image: string;
    excerpt: string;
    views?: number;
  };
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function NewsCard({ news, onEdit, onDelete }: NewsCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative rounded-lg border bg-card overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Admin Actions */}
      {(onEdit || onDelete) && (
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-2 rounded-full bg-background/80 hover:bg-background border shadow-sm"
              title="Edit"
            >
              <Edit2 size={16} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-2 rounded-full bg-background/80 hover:bg-background border shadow-sm text-destructive"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      )}

      <Link href={`/news/${news.id}`}>
        <div className="relative">
          <img
            src={news.image}
            alt={news.title}
            className="w-full h-48 object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
        </div>
        
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
              {news.category}
            </span>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar size={14} />
              <span className="text-xs">{news.date}</span>
            </div>
            {news.views && (
              <div className="flex items-center gap-1 text-muted-foreground ml-auto">
                <Eye size={14} />
                <span className="text-xs">{news.views}</span>
              </div>
            )}
          </div>
          
          <h2 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {news.title}
          </h2>
          
          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
            {news.excerpt}
          </p>
          
          <span className="text-primary text-sm font-medium hover:underline">
            Read more
          </span>
        </div>
      </Link>
    </motion.article>
  );
} 