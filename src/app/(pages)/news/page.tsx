"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Bell, Plus } from "lucide-react";
import NewsForm from "@/components/news/NewsForm";
import NewsCard from "@/components/news/NewsCard";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import SearchAndFilter from "@/components/layout/SearchAndFilter";
import GridLayout from "@/components/layout/GridLayout";

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
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingNews, setEditingNews] = useState<typeof mockNews[0] | null>(null);
  const [deletingNews, setDeletingNews] = useState<typeof mockNews[0] | null>(null);

  const handleAddNews = async (formData: FormData) => {
    // TODO: Implement news creation
    console.log("Creating news:", Object.fromEntries(formData));
    setShowAddForm(false);
  };

  const handleEditNews = async (formData: FormData) => {
    // TODO: Implement news update
    console.log("Updating news:", Object.fromEntries(formData));
    setEditingNews(null);
  };

  const handleDeleteNews = async () => {
    // TODO: Implement news deletion
    console.log("Deleting news:", deletingNews?.id);
    setDeletingNews(null);
  };

  const filterOptions = [
    { label: "All Categories", value: "all" },
    { label: "Framework Updates", value: "Framework Updates" },
    { label: "Security", value: "Security" },
    { label: "Community", value: "Community" },
    { label: "Tutorials", value: "Tutorials" },
  ];

  const filteredNews = mockNews.filter((news) => {
    const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || news.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <PageContainer>
      <PageHeader
        title="Tech News & Updates"
        description="Stay informed with the latest technology news and community updates."
        action={
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          >
            <Plus size={20} />
            Add News
          </button>
        }
      />

      <SearchAndFilter
        searchPlaceholder="Search news..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filterValue={selectedCategory}
        onFilterChange={setSelectedCategory}
        filterOptions={filterOptions}
      />

      <GridLayout columns={3}>
        {filteredNews.map((news) => (
          <NewsCard
            key={news.id}
            news={news}
            onEdit={() => setEditingNews(news)}
            onDelete={() => setDeletingNews(news)}
          />
        ))}
      </GridLayout>

      {(showAddForm || editingNews) && (
        <NewsForm
          initialData={editingNews || undefined}
          onSubmit={editingNews ? handleEditNews : handleAddNews}
          onCancel={() => {
            setShowAddForm(false);
            setEditingNews(null);
          }}
          isEdit={!!editingNews}
        />
      )}

      {deletingNews && (
        <ConfirmDialog
          title="Delete News Article"
          message="Are you sure you want to delete this news article? This action cannot be undone."
          onConfirm={handleDeleteNews}
          onCancel={() => setDeletingNews(null)}
        />
      )}
    </PageContainer>
  );
} 