"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import StoreCard from "@/components/store/StoreCard";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import SearchAndFilter from "@/components/layout/SearchAndFilter";
import GridLayout from "@/components/layout/GridLayout";

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
    <PageContainer>
      <PageHeader
        title="Web Store"
        description="Discover and share amazing web tools and applications."
        action={
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          >
            <Plus size={20} />
            Submit Tool
          </button>
        }
      />

      <SearchAndFilter
        searchPlaceholder="Search tools..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filterValue={selectedCategory}
        onFilterChange={setSelectedCategory}
        filterOptions={filterOptions}
      />

      <GridLayout columns={3}>
        {filteredTools.map((tool) => (
          <StoreCard
            key={tool.id}
            tool={tool}
            onEdit={() => setEditingTool(tool)}
            onDelete={() => setDeletingTool(tool)}
          />
        ))}
      </GridLayout>

      {/* TODO: Add ToolForm component for adding/editing tools */}
      {/* {(showAddForm || editingTool) && (
        <ToolForm
          initialData={editingTool || undefined}
          onSubmit={editingTool ? handleEditTool : handleAddTool}
          onCancel={() => {
            setShowAddForm(false);
            setEditingTool(null);
          }}
          isEdit={!!editingTool}
        />
      )} */}

      {deletingTool && (
        <ConfirmDialog
          title="Delete Tool"
          message="Are you sure you want to delete this tool? This action cannot be undone."
          onConfirm={handleDeleteTool}
          onCancel={() => setDeletingTool(null)}
        />
      )}
    </PageContainer>
  );
} 