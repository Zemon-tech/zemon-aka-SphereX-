"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Heart,
  MessageSquare,
  Share2,
  Globe,
  Github,
  Download,
  CheckCircle,
} from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";

// Mock data for demonstration
const mockToolDetail = {
  id: 1,
  title: "DevFlow",
  description: "A modern project management tool for developers",
  longDescription: `
    <h2>About DevFlow</h2>
    <p>DevFlow is a comprehensive project management solution designed specifically for development teams. 
    It combines the best features of traditional project management tools with developer-specific needs.</p>

    <h2>Key Features</h2>
    <ul>
      <li>Git integration</li>
      <li>Automated workflows</li>
      <li>Code review management</li>
      <li>Sprint planning tools</li>
      <li>Time tracking</li>
    </ul>

    <h2>Getting Started</h2>
    <p>Sign up for a free account and follow our quick setup guide to get started with DevFlow...</p>
  `,
  image: "https://picsum.photos/1200/400",
  rating: 4.8,
  reviews: 124,
  category: "Productivity",
  tags: ["project-management", "developers", "agile"],
  url: "https://devflow.example.com",
  github: "https://github.com/techlabs/devflow",
  features: [
    "Git Integration",
    "Automated Workflows",
    "Code Review",
    "Sprint Planning",
    "Time Tracking",
  ],
  pricing: {
    free: true,
    plans: [
      {
        name: "Basic",
        price: "Free",
        features: ["Up to 3 projects", "Basic integrations", "Community support"],
      },
      {
        name: "Pro",
        price: "$12/month",
        features: ["Unlimited projects", "Advanced integrations", "Priority support"],
      },
    ],
  },
};

export default function ToolDetailPage() {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <PageContainer className="py-6">
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Hero Section */}
        <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
          <img
            src={mockToolDetail.image}
            alt={mockToolDetail.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-4">
              {mockToolDetail.category}
            </span>
            <h1 className="text-4xl font-bold text-white mb-4">
              {mockToolDetail.title}
            </h1>
            <div className="flex items-center gap-4 text-white/80">
              <div className="flex items-center gap-1">
                <Star className="fill-yellow-500 text-yellow-500" size={20} />
                <span className="font-medium">{mockToolDetail.rating}</span>
                <span>({mockToolDetail.reviews} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div
              className="prose prose-lg dark:prose-invert max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: mockToolDetail.longDescription }}
            />

            {/* Features */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockToolDetail.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 text-muted-foreground"
                  >
                    <CheckCircle size={20} className="text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

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
            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <a
                href={mockToolDetail.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Globe size={20} />
                Visit Website
              </a>
              {mockToolDetail.github && (
                <a
                  href={mockToolDetail.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border hover:bg-accent"
                >
                  <Github size={20} />
                  View Source
                </a>
              )}
            </div>

            {/* Pricing Plans */}
            <div className="p-6 rounded-lg border">
              <h3 className="font-semibold mb-4">Pricing Plans</h3>
              <div className="space-y-4">
                {mockToolDetail.pricing.plans.map((plan) => (
                  <div key={plan.name} className="p-4 rounded-lg border">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{plan.name}</h4>
                      <span className="text-primary font-semibold">
                        {plan.price}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle size={16} className="text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="p-6 rounded-lg border">
              <h3 className="font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {mockToolDetail.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.article>
    </PageContainer>
  );
} 