"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Star,
  Plus,
  ExternalLink,
  Filter,
  ArrowUpRight,
} from "lucide-react";

// Mock data for demonstration
const mockProjects = [
  {
    id: 1,
    title: "DevFlow",
    description: "A modern project management tool for developers",
    image: "https://picsum.photos/400/300",
    rating: 4.8,
    reviews: 124,
    author: "TechLabs",
    category: "Productivity",
    tags: ["project-management", "developers", "agile"],
    url: "https://devflow.example.com",
  },
  {
    id: 2,
    title: "CodeSnap",
    description: "Beautiful code screenshot generator with syntax highlighting",
    image: "https://picsum.photos/400/301",
    rating: 4.6,
    reviews: 89,
    author: "DevTools Inc",
    category: "Developer Tools",
    tags: ["code", "screenshot", "sharing"],
    url: "https://codesnap.example.com",
  },
  // Add more mock projects as needed
];

export default function StorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProjects = mockProjects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Web Store</h1>
        <p className="text-muted-foreground">
          Discover and share amazing web tools and applications.
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background"
          />
        </div>
        <div className="flex gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-lg border bg-background"
          >
            <option value="all">All Categories</option>
            <option value="Productivity">Productivity</option>
            <option value="Developer Tools">Developer Tools</option>
            <option value="Design">Design</option>
            <option value="Analytics">Analytics</option>
          </select>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus size={20} />
            Submit Project
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <motion.article
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border bg-card overflow-hidden group"
          >
            <div className="relative">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-48 object-cover"
              />
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black">
                  <ExternalLink size={20} />
                  Visit Site
                </button>
              </a>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">{project.title}</h2>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span className="text-sm font-medium">{project.rating}</span>
                  <span className="text-xs text-muted-foreground">
                    ({project.reviews})
                  </span>
                </div>
              </div>

              <p className="text-muted-foreground text-sm mb-4">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">by {project.author}</span>
                <span className="px-2 py-1 rounded bg-primary/10 text-primary">
                  {project.category}
                </span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Submit Project CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-12 p-8 rounded-lg bg-primary/5 text-center"
      >
        <h2 className="text-2xl font-semibold mb-4">
          Have a Project to Share?
        </h2>
        <p className="text-muted-foreground mb-6">
          Submit your web application or tool to our store and reach thousands of
          developers.
        </p>
        <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus size={20} />
          Submit Your Project
        </button>
      </motion.div>
    </div>
  );
} 