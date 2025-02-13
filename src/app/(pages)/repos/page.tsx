"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import RepoCard from "@/components/repos/RepoCard";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import SearchAndFilter from "@/components/layout/SearchAndFilter";
import GridLayout from "@/components/layout/GridLayout";

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
    watchers: 890,
    language: "TypeScript",
    topics: ["react", "nextjs", "framework"],
  },
  // Add more mock repos as needed
];

export default function ReposPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [editingRepo, setEditingRepo] = useState<typeof mockRepos[0] | null>(null);
  const [deletingRepo, setDeletingRepo] = useState<typeof mockRepos[0] | null>(null);

  const handleEditRepo = async (formData: FormData) => {
    // TODO: Implement repo update
    console.log("Updating repo:", Object.fromEntries(formData));
    setEditingRepo(null);
  };

  const handleDeleteRepo = async () => {
    // TODO: Implement repo deletion
    console.log("Deleting repo:", deletingRepo?.id);
    setDeletingRepo(null);
  };

  const filterOptions = [
    { label: "All Languages", value: "all" },
    { label: "TypeScript", value: "TypeScript" },
    { label: "JavaScript", value: "JavaScript" },
    { label: "Python", value: "Python" },
    { label: "Java", value: "Java" },
  ];

  const filteredRepos = mockRepos.filter((repo) => {
    const matchesSearch =
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage = selectedLanguage === "all" || repo.language === selectedLanguage;
    return matchesSearch && matchesLanguage;
  });

  return (
    <PageContainer>
      <PageHeader
        title="Open Source Projects"
        description="Discover and contribute to amazing open source projects."
        action={
          <button
            onClick={() => {/* TODO: Implement repo submission */}}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          >
            <Plus size={20} />
            Submit Project
          </button>
        }
      />

      <SearchAndFilter
        searchPlaceholder="Search projects..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filterValue={selectedLanguage}
        onFilterChange={setSelectedLanguage}
        filterOptions={filterOptions}
      />

      <GridLayout columns={2}>
        {filteredRepos.map((repo) => (
          <RepoCard
            key={repo.id}
            repo={repo}
            onEdit={() => setEditingRepo(repo)}
            onDelete={() => setDeletingRepo(repo)}
          />
        ))}
      </GridLayout>

      {deletingRepo && (
        <ConfirmDialog
          title="Delete Repository"
          message="Are you sure you want to delete this repository? This action cannot be undone."
          onConfirm={handleDeleteRepo}
          onCancel={() => setDeletingRepo(null)}
        />
      )}
    </PageContainer>
  );
} 