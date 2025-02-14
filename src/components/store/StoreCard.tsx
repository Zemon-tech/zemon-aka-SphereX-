"use client";

import { motion } from "framer-motion";
import { Star, Edit2, Trash2, Globe, Github } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface StoreCardProps {
  tool: {
    id: string;
    title: string;
    description: string;
    image: string;
    rating: number;
    reviews: number;
    category: string;
    tags: string[];
    url: string;
    github?: string;
  };
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function StoreCard({ tool, onEdit, onDelete }: StoreCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/store/${tool.id}`);
  };

  const handleLinkClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation(); // Prevent card click when clicking links
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative rounded-lg border bg-card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Admin Actions */}
      {(onEdit || onDelete) && (
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-2 rounded-full bg-background/80 hover:bg-background border shadow-sm"
              title="Edit"
            >
              <Edit2 size={16} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-2 rounded-full bg-background/80 hover:bg-background border shadow-sm text-destructive"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      )}

      <div className="relative h-48">
        <img
          src={tool.image}
          alt={tool.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
      </div>
      
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
            {tool.category}
          </span>
          <div className="flex items-center gap-1 ml-auto">
            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            <span className="text-sm font-medium">{tool.rating}</span>
            <span className="text-xs text-muted-foreground">
              ({tool.reviews})
            </span>
          </div>
        </div>
        
        <div className="block mb-4">
          <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
            {tool.title}
          </h2>
          
          <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
            {tool.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {tool.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={(e) => handleLinkClick(e, tool.url)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
          >
            <Globe size={14} />
            Website
          </button>
          {tool.github && (
            <button
              onClick={(e) => handleLinkClick(e, tool.github!)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
            >
              <Github size={14} />
              Source
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
} 