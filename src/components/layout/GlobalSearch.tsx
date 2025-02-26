"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useDebounce } from "../../hooks/useDebounce";

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  type: "repo" | "tool" | "idea" | "resource" | "news" | "event" | "user";
  url: string;
  icon?: React.ReactNode;
  avatar?: string;
}

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const debouncedQuery = useDebounce(query, 150);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
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
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const searchContent = async () => {
      if (query.length >= 3) {
        setIsOpen(true);
        setIsLoading(true);
      }

      if (debouncedQuery.length < 3) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        // Construct search query for MongoDB text search
        const terms = debouncedQuery.trim().split(/\s+/).filter(Boolean);
        const searchQuery = terms.map(term => `"${term}"`).join(' ');
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/search?q=${encodeURIComponent(searchQuery)}`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
          }
        });

        if (!response.ok) throw new Error('Search failed');

        const data = await response.json();
        console.log('Raw search results:', data.results);
        
        // Map the results to include avatars and ensure proper URL case sensitivity
        const mappedResults = data.results.map((result: any) => {
          // Preserve the original URL case for user types
          const url = result.type === 'user' 
            ? result.url.replace(/\/([^/]+)$/, (_: string, username: string) => 
                `/${result.originalUsername || username}`)
            : result.url;

          return {
            ...result,
            url,
            avatar: 
              result.type === 'user' ? result.avatar || result.profileImage :
              result.type === 'repo' ? result.thumbnail || result.image || result.coverImage :
              result.type === 'resource' ? result.thumbnail || result.image || result.coverImage :
              result.type === 'news' ? result.thumbnail || result.image || result.coverImage :
              result.type === 'event' ? result.thumbnail || result.image || result.coverImage :
              result.type === 'tool' ? result.thumbnail || result.image || result.coverImage :
              undefined
          };
        });

        setResults(mappedResults);
        setIsOpen(true);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchContent();
  }, [debouncedQuery, query]);

  const handleResultClick = (result: SearchResult) => {
    router.push(result.url);
    setIsOpen(false);
    setQuery("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length >= 3) {
      setIsOpen(true);
    }
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
          onFocus={() => query.length >= 3 && setIsOpen(true)}
          placeholder="Search..."
          className="w-full pl-9 pr-12 py-1.5 text-sm bg-background border rounded-md focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
        <kbd className="absolute right-3 hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
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
                  {results.map((result) => (
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
                      <div className="text-xs text-muted-foreground">
                        {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                      </div>
                    </button>
                  ))}
                </div>
              ) : query.length > 0 && query.length < 3 ? (
                <div className="p-2 text-center text-sm text-muted-foreground">
                  Type at least 3 characters to search...
                </div>
              ) : query.length >= 3 ? (
                <div className="p-2 text-center text-sm text-muted-foreground">
                  No results found.
                </div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 