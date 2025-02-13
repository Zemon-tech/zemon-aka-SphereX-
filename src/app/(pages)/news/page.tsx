"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Bell } from "lucide-react";

// Mock data for demonstration
const mockNews = [
  {
    id: 1,
    title: "Next.js 14 Released with Improved Performance",
    category: "Framework Updates",
    date: "2024-02-13",
    image: "https://picsum.photos/400/300",
    excerpt:
      "The latest version of Next.js brings significant performance improvements and new features...",
  },
  {
    id: 2,
    title: "Major Security Update for Popular npm Packages",
    category: "Security",
    date: "2024-02-12",
    image: "https://picsum.photos/400/301",
    excerpt:
      "Several widely-used npm packages received critical security updates today...",
  },
  // Add more mock news items as needed
];

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredNews = mockNews.filter((news) => {
    const matchesSearch = news.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || news.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Tech News & Updates</h1>
        <p className="text-muted-foreground">
          Stay informed with the latest technology news and community updates.
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search news..."
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
            <option value="Framework Updates">Framework Updates</option>
            <option value="Security">Security</option>
            <option value="Community">Community</option>
          </select>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
            <Bell size={20} />
            Subscribe
          </button>
        </div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map((news) => (
          <motion.article
            key={news.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border bg-card overflow-hidden"
          >
            <img
              src={news.image}
              alt={news.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {news.category}
                </span>
                <span className="text-xs text-muted-foreground">{news.date}</span>
              </div>
              <h2 className="text-xl font-semibold mb-2">{news.title}</h2>
              <p className="text-muted-foreground text-sm mb-4">
                {news.excerpt}
              </p>
              <button className="text-primary hover:underline text-sm">
                Read more
              </button>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Subscription CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-12 p-8 rounded-lg bg-primary/5 text-center"
      >
        <h2 className="text-2xl font-semibold mb-4">
          Never Miss Important Updates
        </h2>
        <p className="text-muted-foreground mb-6">
          Subscribe to our premium news service for exclusive content and early
          access to events.
        </p>
        <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
          <Bell size={20} />
          Subscribe Now
        </button>
      </motion.div>
    </div>
  );
} 