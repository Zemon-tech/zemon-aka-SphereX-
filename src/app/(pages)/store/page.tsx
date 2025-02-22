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
import { useRouter } from "next/navigation";

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
  developer_name?: string;
  version?: string;
  lastUpdated?: string;
}

export default function StorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const { toast } = useToast();
  const router = useRouter();

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
      
      // Get auth token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to submit a tool');
      }
      
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
          'Authorization': `Bearer ${token}`, // Add authorization header
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
        console.error('Server validation errors:', data.errors);
        
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

  const handleSubmitToolClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit a tool.",
        variant: "destructive",
      });
      router.push('/login');
      return;
    }
    
    setShowAddForm(true);
  };

  const filteredItems = storeItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Tool Store</h1>
          <p className="text-muted-foreground mt-1">
            Discover and integrate powerful developer tools
          </p>
        </div>
        <Button onClick={handleSubmitToolClick} className="gap-2">
          <Plus className="w-4 h-4" />
          Submit Tool
        </Button>
      </div>

      <div className="space-y-6">
        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeleton
            [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-[160px] bg-card animate-pulse rounded-2xl border p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-muted rounded-[18px]" />
                    <div className="space-y-2">
                      <div className="h-6 bg-muted rounded w-32" />
                      <div className="h-4 bg-muted rounded w-24" />
                    </div>
                  </div>
                  <div className="w-24 h-7 bg-muted rounded-full flex-shrink-0" />
                </div>
                <div className="mt-auto">
                  <div className="h-4 bg-muted rounded w-2/3" />
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
                  developer: { _id: 'unknown', name: item.developer_name || 'Unknown Developer' },
                  url: item.url,
                }}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No tools found
            </div>
          )}
        </div>
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