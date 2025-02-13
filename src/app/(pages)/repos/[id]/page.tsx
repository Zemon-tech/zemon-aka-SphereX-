"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  GitFork,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Github,
  Globe,
  Users,
} from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";

// Mock data for demonstration
const mockRepoDetail = {
  id: 1,
  name: "next.js",
  owner: "vercel",
  fullName: "vercel/next.js",
  description:
    "The React Framework for Production - Next.js gives you the best developer experience with all the features you need for production: hybrid static & server rendering, TypeScript support, smart bundling, route pre-fetching, and more. No config needed.",
  stars: 12500,
  forks: 2300,
  watchers: 890,
  language: "TypeScript",
  topics: ["react", "nextjs", "framework", "ssr", "typescript"],
  readme: `
    <h1>Next.js</h1>
    <p>The React Framework for Production...</p>
    
    <h2>Getting Started</h2>
    <pre><code>npx create-next-app@latest</code></pre>
    
    <h2>Features</h2>
    <ul>
      <li>Hybrid Static & Server Rendering</li>
      <li>TypeScript Support</li>
      <li>Smart Bundling</li>
      <li>Route Pre-fetching</li>
    </ul>
  `,
  contributors: [
    {
      id: 1,
      name: "John Doe",
      avatar: "https://picsum.photos/100/100",
      contributions: 256,
    },
    // Add more contributors
  ],
  website: "https://nextjs.org",
  githubUrl: "https://github.com/vercel/next.js",
};

export default function RepoDetailPage() {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <PageContainer className="py-6">
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <span>{mockRepoDetail.owner}</span>
            <span>/</span>
            <span className="font-semibold text-foreground">
              {mockRepoDetail.name}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-4">{mockRepoDetail.fullName}</h1>
          <p className="text-xl text-muted-foreground mb-6">
            {mockRepoDetail.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {mockRepoDetail.topics.map((topic) => (
              <span
                key={topic}
                className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div
              className="prose prose-lg dark:prose-invert max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: mockRepoDetail.readme }}
            />

            {/* Actions */}
            <div className="flex items-center gap-6 py-4 border-t">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center gap-2 ${
                  isLiked ? "text-red-500" : "text-muted-foreground"
                }`}
              >
                <Heart size={20} className={isLiked ? "fill-current" : ""} />
                <span>Like</span>
              </button>
              <button className="flex items-center gap-2 text-muted-foreground">
                <MessageSquare size={20} />
                <span>Comment</span>
              </button>
              <button className="flex items-center gap-2 text-muted-foreground ml-auto">
                <Share2 size={20} />
                Share
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="p-6 rounded-lg border space-y-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Star className="text-yellow-500" size={20} />
                <span>{mockRepoDetail.stars} stars</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <GitFork size={20} />
                <span>{mockRepoDetail.forks} forks</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Eye size={20} />
                <span>{mockRepoDetail.watchers} watching</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: "#3178c6" }}
                />
                <span>{mockRepoDetail.language}</span>
              </div>
              <div className="flex flex-col gap-2 pt-4">
                <a
                  href={mockRepoDetail.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Github size={20} />
                  View on GitHub
                </a>
                <a
                  href={mockRepoDetail.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border hover:bg-accent"
                >
                  <Globe size={20} />
                  Visit Website
                </a>
              </div>
            </div>

            {/* Contributors */}
            <div className="p-6 rounded-lg border">
              <div className="flex items-center gap-2 mb-4">
                <Users size={20} />
                <h3 className="font-semibold">Contributors</h3>
              </div>
              <div className="space-y-4">
                {mockRepoDetail.contributors.map((contributor) => (
                  <div key={contributor.id} className="flex items-center gap-3">
                    <img
                      src={contributor.avatar}
                      alt={contributor.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{contributor.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {contributor.contributions} contributions
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.article>
    </PageContainer>
  );
} 