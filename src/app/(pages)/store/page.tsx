"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import StoreCard from "@/components/store/StoreCard";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import SearchAndFilter from "@/components/layout/SearchAndFilter";
import GridLayout from "@/components/layout/GridLayout";
import { motion } from "framer-motion";

// Mock data for demonstration
const mockTools = [
  {
    id: 1,
    title: "DevFlow",
    description: "A modern project management tool for developers",
    image: "https://picsum.photos/400/300",
    rating: 4.8,
    reviews: 124,
    category: "Productivity",
    tags: ["project-management", "developers", "agile"],
    url: "https://devflow.example.com",
    github: "https://github.com/techlabs/devflow",
  },
  // Add more mock tools as needed
];

export default function StorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTool, setEditingTool] = useState<typeof mockTools[0] | null>(null);
  const [deletingTool, setDeletingTool] = useState<typeof mockTools[0] | null>(null);

  const handleAddTool = async (formData: FormData) => {
    // TODO: Implement tool creation
    console.log("Creating tool:", Object.fromEntries(formData));
    setShowAddForm(false);
  };

  const handleEditTool = async (formData: FormData) => {
    // TODO: Implement tool update
    console.log("Updating tool:", Object.fromEntries(formData));
    setEditingTool(null);
  };

  const handleDeleteTool = async () => {
    // TODO: Implement tool deletion
    console.log("Deleting tool:", deletingTool?.id);
    setDeletingTool(null);
  };

  const filterOptions = [
    { label: "All Categories", value: "all" },
    { label: "Productivity", value: "Productivity" },
    { label: "Developer Tools", value: "Developer Tools" },
    { label: "Design", value: "Design" },
    { label: "Analytics", value: "Analytics" },
  ];

  const filteredTools = mockTools.filter((tool) => {
    const matchesSearch =
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <PageContainer className="py-6">
      <div className="space-y-8">
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-6 rounded-lg border bg-card animate-pulse">
              <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-muted rounded w-full mb-4"></div>
              <div className="h-4 bg-muted rounded w-1/2 mb-6"></div>
              <div className="flex justify-between items-center">
                <div className="h-8 bg-muted rounded w-24"></div>
                <div className="h-4 bg-muted rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
} 