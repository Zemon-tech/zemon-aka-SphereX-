"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "../../hooks/useDebounce";

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  type: "repo" | "tool" | "idea" | "resource" | "news" | "event" | "user";
  url: string;
  icon?: React.ReactNode;
  avatar?: string;
  originalUsername?: string;
  profileImage?: string;
  thumbnail?: string;
  image?: string;
  coverImage?: string;
}

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const debouncedQuery = useDebounce(query, 300);

  const filterOptions = [
    { label: "All", value: "all" },
    { label: "Users", value: "user" },
    { label: "News", value: "news" },
    { label: "Repos", value: "repo" },
    { label: "Tools", value: "tool" },
    { label: "Events", value: "event" },
    { label: "Ideas", value: "idea" },
    { label: "Resources", value: "resource" },
  ];

  // Group results by type
  const groupedResults = results.reduce((acc, result) => {
    if (activeFilter !== "all" && result.type !== activeFilter) {
      return acc;
    }
    
    const group = acc[result.type] || [];
    group.push(result);
    acc[result.type] = group;
    return acc;
  }, {} as Record<string, SearchResult[]>);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setQuery("");
        setActiveFilter("all");
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (event.key === "Escape") {
        setIsOpen(false);
        setQuery("");
        setActiveFilter("all");
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const searchContent = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const searchQuery = debouncedQuery.trim();
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/search?q=${encodeURIComponent(searchQuery)}`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
          }
        });

        if (!response.ok) throw new Error('Search failed');

        const data = await response.json();
        
        const mappedResults = data.results.map((result: SearchResult) => ({
          ...result,
          avatar: 
            result.type === 'user' ? result.avatar || result.profileImage :
            result.type === 'repo' ? result.thumbnail || result.image || result.coverImage :
            result.type === 'resource' ? result.thumbnail || result.image || result.coverImage :
            result.type === 'news' ? result.thumbnail || result.image || result.coverImage :
            result.type === 'event' ? result.thumbnail || result.image || result.coverImage :
            result.type === 'tool' ? result.thumbnail || result.image || result.coverImage :
            undefined
        }));

        setResults(mappedResults);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchContent();
  }, [debouncedQuery]);

  const handleResultClick = (result: SearchResult) => {
    router.push(result.url);
    setIsOpen(false);
    setQuery("");
    setActiveFilter("all");
    setIsFilterOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Show loading state immediately for better UX
    if (value.trim()) {
      setIsLoading(true);
    }
    
    // Always keep search open when typing
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleFilterClick = (value: string) => {
    setActiveFilter(value);
    setIsFilterOpen(false);
  };

  const getCurrentFilterLabel = () => {
    const filter = filterOptions.find(option => option.value === activeFilter);
    return filter ? filter.label : "Filter";
  };

  return (
    <div ref={searchRef} className="relative w-[300px]">
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder="Search..."
          className="w-full pl-9 pr-32 py-1.5 text-sm bg-background border rounded-md focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
        <div className="absolute right-3 flex items-center gap-2">
          {isOpen ? (
            <div ref={filterRef} className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-1.5 px-2 py-1 text-xs rounded border bg-muted hover:bg-muted/80 transition-colors"
              >
                {getCurrentFilterLabel()}
                <ChevronDown className="w-3 h-3" />
              </button>
              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-1 w-32 py-1 bg-background rounded-md border shadow-lg z-[60]"
                  >
                    {filterOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleFilterClick(option.value)}
                        className={`w-full text-left px-3 py-1.5 text-xs transition-colors hover:bg-accent ${
                          activeFilter === option.value ? "text-primary font-medium" : ""
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-1 w-full bg-background rounded-md border shadow-lg overflow-hidden z-50"
          >
            <div className="max-h-[300px] overflow-y-auto overscroll-contain">
              {isLoading ? (
                <div className="p-2 text-center text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                </div>
              ) : results.length > 0 ? (
                <div className="py-1">
                  {Object.entries(groupedResults).map(([type, items]) => items.length > 0 && (
                    <div key={type}>
                      <div className="px-3 py-2 text-xs font-medium text-muted-foreground flex items-center gap-3">
                        <div className="h-[1px] flex-1 bg-border/60"></div>
                        <div className="text-center px-3">
                          {type.charAt(0).toUpperCase() + type.slice(1)}s
                        </div>
                        <div className="h-[1px] flex-1 bg-border/60"></div>
                      </div>
                      {items.map((result) => (
                        <button
                          key={result.id}
                          onClick={() => handleResultClick(result)}
                          className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-accent"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full overflow-hidden bg-primary/10">
                            {result.avatar ? (
                              <img 
                                src={result.avatar} 
                                alt={result.title}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/Zemon.svg';
                                }}
                              />
                            ) : (
                              <img 
                                src="/Zemon.svg" 
                                alt="Default"
                                className="h-5 w-5"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">
                              {result.title}
                            </div>
                            {result.description && (
                              <div className="text-xs text-muted-foreground truncate">
                                {result.description}
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              ) : query.trim() ? (
                <div className="p-2 text-center text-sm text-muted-foreground">
                  No results found.
                </div>
              ) : (
                <div className="p-2 text-center text-sm text-muted-foreground">
                  Start typing to search...
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 