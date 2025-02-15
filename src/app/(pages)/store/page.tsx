"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import StoreCard from "@/components/store/StoreCard";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import SearchAndFilter from "@/components/layout/SearchAndFilter";
import GridLayout from "@/components/layout/GridLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import ToolForm from "@/components/store/ToolForm";
import { useToast } from "@/components/ui/use-toast";

interface StoreItem {
  _id: string;
  name: string;
  description: string;
  thumbnail: string;
  url: string;
  dev_docs?: string;
  github_url?: string;
  category: string;
  tags: string[];
  price: string;
  average_rating: number;
  total_reviews: number;
  views: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function StorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const { toast } = useToast();

  const filterOptions = [
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

  useEffect(() => {
    fetchStoreItems();
  }, []);

  const fetchStoreItems = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/store`);
      const data = await response.json();
      if (data.success) {
        setStoreItems(data.data.items);
      } else {
        throw new Error(data.message || 'Failed to fetch store items');
      }
    } catch (error) {
      console.error('Error fetching store items:', error);
      toast({
        title: "Error",
        description: "Failed to load store items",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitTool = async (formData: FormData) => {
    try {
      setIsLoading(true);
      
      // Get tags and clean them up
      const tagsString = formData.get('tags')?.toString() || '';
      const tags = tagsString
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      // Convert FormData to JSON object with proper field names
      const toolData = {
        name: formData.get('title')?.toString(),
        description: formData.get('description')?.toString(),
        thumbnail: formData.get('image')?.toString(),
        url: formData.get('websiteUrl')?.toString(),
        github_url: formData.get('githubUrl')?.toString() || undefined,
        category: formData.get('category')?.toString(),
        price: formData.get('price')?.toString() || 'Free',
        tags: tags.length > 0 ? tags : ['uncategorized'],
      };

      // Debug log
      console.log('Submitting tool data:', toolData);

      // Validate required fields
      if (!toolData.name || !toolData.description || !toolData.thumbnail || !toolData.url || !toolData.category) {
        throw new Error('Please fill in all required fields');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/store`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(toolData),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Tool added successfully",
        });
        setShowAddForm(false);
        // Refresh the store items list
        fetchStoreItems();
      } else {
        // Log the error response
        console.error('Server validation errors:', data);
        
        // If there are validation errors, show them in the toast
        if (data.errors && Array.isArray(data.errors)) {
          toast({
            title: "Validation Error",
            description: data.errors.join('\n'),
            variant: "destructive",
          });
        } else {
          throw new Error(data.message || 'Failed to add tool');
        }
      }
    } catch (error) {
      console.error("Error adding tool:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add tool",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = storeItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <PageContainer className="py-6">
      <PageHeader
        title="Developer Tools"
        description="Discover and share powerful tools for developers"
        action={
          <Button className="gap-2" onClick={() => setShowAddForm(true)}>
            <Plus className="w-4 h-4" />
            Submit Tool
          </Button>
        }
      />

      <SearchAndFilter
        searchPlaceholder="Search developer tools..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filterValue={selectedCategory}
        onFilterChange={setSelectedCategory}
        filterOptions={filterOptions}
        extraActions={
          <div className="flex gap-2">
            <select className="px-4 py-2.5 rounded-lg border bg-background">
              <option value="popular">Most Popular</option>
              <option value="recent">Recently Added</option>
              <option value="trending">Trending</option>
            </select>
          </div>
        }
      />

      {/* Store Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {isLoading ? (
          // Loading skeleton
          [...Array(6)].map((_, i) => (
            <div key={i} className="p-6 rounded-lg border bg-card animate-pulse">
              <div className="h-48 bg-muted rounded-lg mb-4"></div>
              <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-muted rounded w-full mb-4"></div>
              <div className="h-4 bg-muted rounded w-1/2 mb-6"></div>
              <div className="flex justify-between items-center">
                <div className="h-8 bg-muted rounded w-24"></div>
                <div className="h-4 bg-muted rounded w-16"></div>
              </div>
            </div>
          ))
        ) : filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <StoreCard
              key={item._id}
              tool={{
                id: item._id,
                title: item.name,
                description: item.description,
                image: item.thumbnail,
                rating: item.average_rating,
                reviews: item.total_reviews,
                category: item.category,
                tags: item.tags,
                url: item.url,
                github: item.github_url,
              }}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No tools found
          </div>
        )}
      </div>

      {/* Add Tool Form Modal */}
      {showAddForm && (
        <ToolForm
          onSubmit={handleSubmitTool}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </PageContainer>
  );
} 