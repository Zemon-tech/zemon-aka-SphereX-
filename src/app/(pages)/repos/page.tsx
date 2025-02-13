"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, GitBranch, Star, ArrowUpDown } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import SearchAndFilter from "@/components/layout/SearchAndFilter";
import { Button } from "@/components/ui/button";
import ProjectForm from "@/components/projects/ProjectForm";

export default function ReposPage() {
  const [showAddForm, setShowAddForm] = useState(false);

  const filterOptions = [
    { label: "All Languages", value: "all" },
    { label: "JavaScript", value: "javascript" },
    { label: "TypeScript", value: "typescript" },
    { label: "Python", value: "python" },
    { label: "Java", value: "java" },
    { label: "Go", value: "go" },
    { label: "Rust", value: "rust" },
  ];

  const handleSubmitProject = async (formData: FormData) => {
    try {
      // TODO: Implement API call to create project
      console.log("Creating project:", Object.fromEntries(formData));
      setShowAddForm(false);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <PageContainer className="py-6">
      <PageHeader
        title="Open Source Projects"
        description="Explore and contribute to amazing open source projects"
        action={
          <Button className="gap-2" onClick={() => setShowAddForm(true)}>
            <Plus className="w-4 h-4" />
            Add Project
          </Button>
        }
      />

      <SearchAndFilter
        searchPlaceholder="Search repositories..."
        searchValue=""
        onSearchChange={() => {}}
        filterValue="all"
        onFilterChange={() => {}}
        filterOptions={filterOptions}
        extraActions={
          <div className="flex gap-2">
            <select className="px-4 py-2.5 rounded-lg border bg-background">
              <option value="stars">Most Stars</option>
              <option value="forks">Most Forks</option>
              <option value="recent">Recently Added</option>
              <option value="updated">Recently Updated</option>
            </select>
            <Button variant="outline" className="gap-2">
              <GitBranch className="w-4 h-4" />
              Fork Stats
            </Button>
            <Button variant="outline" className="gap-2">
              <Star className="w-4 h-4" />
              Star History
            </Button>
          </div>
        }
      />

      {/* Loading skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-6 rounded-lg border bg-card animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-muted rounded"></div>
              <div className="flex-1">
                <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </div>
            <div className="h-4 bg-muted rounded w-full mb-4"></div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-4 bg-muted rounded w-16"></div>
                <div className="h-4 bg-muted rounded w-16"></div>
                <div className="h-4 bg-muted rounded w-16"></div>
              </div>
              <div className="h-3 w-3 bg-muted rounded-full"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Project Form Modal */}
      {showAddForm && (
        <ProjectForm
          onSubmit={handleSubmitProject}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </PageContainer>
  );
}