"use client";

import { Search } from "lucide-react";

interface SearchAndFilterProps {
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filterValue: string;
  onFilterChange: (value: string) => void;
  filterOptions: { label: string; value: string }[];
  extraActions?: React.ReactNode;
}

export default function SearchAndFilter({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  filterValue,
  onFilterChange,
  filterOptions,
  extraActions,
}: SearchAndFilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>
      <div className="flex gap-4">
        <select
          value={filterValue}
          onChange={(e) => onFilterChange(e.target.value)}
          className="min-w-[160px] px-4 py-2.5 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          {filterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {extraActions}
      </div>
    </div>
  );
} 