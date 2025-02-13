"use client";

import { motion } from "framer-motion";
import { Star, GitFork, Eye, Edit2, Trash2 } from "lucide-react";
import Link from "next/link";

interface RepoCardProps {
  repo: {
    id: number;
    name: string;
    owner: string;
    description: string;
    stars: number;
    forks: number;
    watchers: number;
    language: string;
    topics: string[];
  };
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function RepoCard({ repo, onEdit, onDelete }: RepoCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative rounded-lg border bg-card p-6 hover:shadow-lg transition-shadow"
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

      <Link href={`/repos/${repo.id}`}>
        <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
          {repo.owner}/{repo.name}
        </h2>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {repo.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {repo.topics.map((topic) => (
            <span
              key={topic}
              className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
            >
              {topic}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star size={16} className="text-yellow-500" />
            <span>{repo.stars}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitFork size={16} />
            <span>{repo.forks}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye size={16} />
            <span>{repo.watchers}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary" />
            <span>{repo.language}</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
} 