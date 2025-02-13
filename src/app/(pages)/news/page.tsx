"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import SearchAndFilter from "@/components/layout/SearchAndFilter";
import { Button } from "@/components/ui/button";
import NewsForm from "@/components/news/NewsForm";

export default function NewsPage() {
  const [showAddForm, setShowAddForm] = useState(false);

  const filterOptions = [
    { label: "All Categories", value: "all" },
    { label: "Framework Updates", value: "Framework Updates" },
    { label: "Security", value: "Security" },
    { label: "Community", value: "Community" },
    { label: "Tutorials", value: "Tutorials" },
  ];

  const handleSubmitNews = async (formData: FormData) => {
    try {
      // TODO: Implement API call to create news
      console.log("Creating news:", Object.fromEntries(formData));
      setShowAddForm(false);
    } catch (error) {
      console.error("Error creating news:", error);
    }
  };

  return (
    <PageContainer className="py-6">
      <PageHeader
        title="Tech News"
        description="Stay updated with the latest developments in the tech world"
        action={
          <Button className="gap-2" onClick={() => setShowAddForm(true)}>
            <Plus className="w-4 h-4" />
            Submit News
          </Button>
        }
      />

      <SearchAndFilter
        searchPlaceholder="Search news articles..."
        searchValue=""
        onSearchChange={() => {}}
        filterValue="all"
        onFilterChange={() => {}}
        filterOptions={filterOptions}
      />

      {/* Loading skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-lg border bg-card overflow-hidden animate-pulse">
            <div className="h-48 bg-muted"></div>
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-4 bg-muted rounded-full w-20"></div>
                <div className="h-4 bg-muted rounded w-24"></div>
              </div>
              <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-full mb-4"></div>
              <div className="h-4 bg-muted rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Add News Form Modal */}
      {showAddForm && (
        <NewsForm
          onSubmit={handleSubmitNews}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </PageContainer>
  );
} 