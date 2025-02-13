"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Star,
  GitFork,
  Users,
  MessageSquare,
  Heart,
  Filter,
} from "lucide-react";

// Mock data for demonstration
const mockRepos = [
  {
    id: 1,
    name: "next.js",
    owner: "vercel",
    description:
      "The React Framework for Production - Next.js gives you the best developer experience...",
    stars: 12500,
    forks: 2300,
    contributors: 450,
    likes: 890,
    comments: 234,
    language: "TypeScript",
    topics: ["react", "nextjs", "framework"],
  },
  {
    id: 2,
    name: "tailwindcss",
    owner: "tailwindlabs",
    description:
      "A utility-first CSS framework for rapid UI development...",
    stars: 8900,
    forks: 1200,
    contributors: 280,
    likes: 670,
    comments: 156,
    language: "CSS",
    topics: ["css", "framework", "utility"],
  },
  // Add more mock repos as needed
];

export default function ReposPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [repos, setRepos] = useState(mockRepos);

  const filteredRepos = repos.filter((repo) => {
    const matchesSearch =
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage =
      selectedLanguage === "all" || repo.language === selectedLanguage;
    return matchesSearch && matchesLanguage;
  });

  return (
    <div className="container px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Open Source Projects</h1>
        <p className="text-muted-foreground">
          Discover and contribute to amazing open source projects.
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background"
          />
        </div>
        <div className="flex gap-4">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-4 py-2 rounded-lg border bg-background"
          >
            <option value="all">All Languages</option>
            <option value="TypeScript">TypeScript</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Python">Python</option>
            <option value="CSS">CSS</option>
          </select>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
            <Filter size={20} />
            More Filters
          </button>
        </div>
      </div>

      {/* Repository Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRepos.map((repo) => (
          <motion.article
            key={repo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border bg-card p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold hover:text-primary">
                  <a
                    href={`https://github.com/${repo.owner}/${repo.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {repo.owner}/{repo.name}
                  </a>
                </h2>
                <p className="text-muted-foreground mt-2">{repo.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {repo.topics.map((topic) => (
                <span
                  key={topic}
                  className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                >
                  {topic}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star size={16} />
                {repo.stars.toLocaleString()}
              </div>
              <div className="flex items-center gap-1">
                <GitFork size={16} />
                {repo.forks.toLocaleString()}
              </div>
              <div className="flex items-center gap-1">
                <Users size={16} />
                {repo.contributors.toLocaleString()}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1 text-sm hover:text-primary">
                  <Heart size={16} />
                  {repo.likes.toLocaleString()}
                </button>
                <button className="flex items-center gap-1 text-sm hover:text-primary">
                  <MessageSquare size={16} />
                  {repo.comments.toLocaleString()}
                </button>
              </div>
              <span className="text-sm px-2 py-1 rounded bg-primary/10 text-primary">
                {repo.language}
              </span>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
} 