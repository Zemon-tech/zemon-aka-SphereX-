"use client";

import { Search } from "lucide-react";

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
}

const categories = [
  { label: "All Categories", value: "all" },
  { label: "Developer Tools", value: "Developer Tools" },
  { label: "Productivity", value: "Productivity" },
  { label: "Design", value: "Design" },
  { label: "Testing", value: "Testing" },
  { label: "Analytics", value: "Analytics" },
  { label: "DevOps", value: "DevOps" },
  { label: "Security", value: "Security" },
  { label: "Database", value: "Database" },
];

export default function SearchAndFilter({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: SearchAndFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <input
          type="text"
          placeholder="Search tools..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>
      <div>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="min-w-[160px] px-4 py-2.5 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          {categories.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
} 