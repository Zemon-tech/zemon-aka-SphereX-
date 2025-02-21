"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface StoreCardProps {
  tool: {
    id: string;
    title: string;
    description: string;
    image: string;
    developer: {
      _id: string;
      name: string;
    } | null;
    url: string;
  };
}

export default function StoreCard({ tool }: StoreCardProps) {
  const handleVisitClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(tool.url, '_blank', 'noopener,noreferrer');
  };

  // Get developer name safely
  const developerName = tool.developer?.name || 'Unknown Developer';

  // Get first 3 words of description
  const shortDescription = tool.description
    .split(' ')
    .slice(0, 3)
    .join(' ')
    .concat('...');

  return (
    <Link href={`/store/${tool.id}`}>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="group relative h-[160px] bg-card rounded-2xl border hover:border-primary/20 hover:shadow-lg transition-all duration-300"
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              {/* Logo */}
              <div className="relative w-14 h-14">
                <img
                  src={tool.image}
                  alt={tool.title}
                  className="w-full h-full rounded-[18px] object-cover shadow-sm group-hover:shadow-md transition-all duration-300"
                />
              </div>

              {/* Content */}
              <div>
                <h3 className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
                  {tool.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  by {developerName}
                </p>
              </div>
            </div>

            {/* Visit Button */}
            <button
              onClick={handleVisitClick}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-xs font-medium px-4 py-1.5 rounded-full flex items-center gap-1.5 transition-all duration-300 group/btn"
            >
              Visit Site
              <ArrowUpRight 
                className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" 
              />
            </button>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground mt-auto line-clamp-1">
            {shortDescription}
          </p>
        </div>
      </motion.article>
    </Link>
  );
} 