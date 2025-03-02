"use client";

import { Search } from "lucide-react";

interface SearchAndFilterProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  filter: string;
  onFilterChange: (value: string) => void;
  filterOptions: Array<{
    label: string;
    value: string;
  }>;
  extraActions?: React.ReactNode;
}

// const categories = [
//   { label: "All Categories", value: "all" },
//   { label: "Developer Tools", value: "Developer Tools" },
//   { label: "Productivity", value: "Productivity" },
//   { label: "Design", value: "Design" },
//   { label: "Testing", value: "Testing" },
//   { label: "Analytics", value: "Analytics" },
//   { label: "DevOps", value: "DevOps" },
//   { label: "Security", value: "Security" },
//   { label: "Database", value: "Database" },
// ];

export default function SearchAndFilter({
  placeholder = "Search...",
  value,
  onChange,
  filter,
  onFilterChange,
  filterOptions = [],
  extraActions
}: SearchAndFilterProps) {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>
      <div>
        <select
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="min-w-[160px] px-4 py-2.5 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          {filterOptions?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {extraActions && (
        <div className="ml-auto">{extraActions}</div>
      )}
    </div>
  );
} 