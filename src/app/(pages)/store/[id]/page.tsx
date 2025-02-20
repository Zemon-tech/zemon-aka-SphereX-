"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Star, Globe, Book, Code, MessageSquare, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ToolDetails {
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
  developer_name: string;
  developer_avatar?: string;
  developer_company?: string;
  version?: string;
  lastUpdated?: string;
  screenshots?: string[];
  reviews?: Array<{
    user: {
      name: string;
      avatar: string;
    };
    rating: number;
    comment: string;
    date: string;
  }>;
}

export default function ToolDetailsPage() {
  const params = useParams();
  const { toast } = useToast();
  const [tool, setTool] = useState<ToolDetails | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStoreItem = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/store/${params.id}`);
        const data = await response.json();
        if (data.success) {
          setTool(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch store item details');
        }
      } catch (error) {
        console.error('Error fetching store item details:', error);
        toast({
          title: "Error",
          description: "Failed to load store item details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchStoreItem();
    }
  }, [params.id, toast]);

  if (isLoading) {
    return (
      <PageContainer>
        <div className="animate-pulse space-y-8 py-8">
          <div className="flex items-start gap-8">
            <div className="w-40 h-40 bg-muted rounded-3xl" />
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-muted rounded w-1/2" />
              <div className="h-4 bg-muted rounded w-1/4" />
              <div className="h-10 bg-muted rounded w-32 mt-6" />
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!tool) {
    return (
      <PageContainer>
        <div className="py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Tool not found</h1>
          <Link href="/store" className="text-primary hover:underline">
            Back to Store
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/store" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Store
        </Link>

        {/* Hero Section */}
        <div className="flex items-start gap-8 mb-12">
          <div className="relative w-40 h-40">
            <img
              src={tool.thumbnail}
              alt={tool.name}
              className="w-full h-full rounded-3xl object-cover shadow-lg"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-bold">{tool.name}</h1>
                <p className="text-lg text-muted-foreground mt-2">
                  by {tool.developer_name || 'Unknown Developer'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  onClick={() => window.open(tool.url, '_blank')}
                  size="lg"
                  className="gap-2"
                >
                  Visit Tool
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
                {tool.dev_docs && (
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => window.open(tool.dev_docs, '_blank')}
                    className="gap-2"
                  >
                    <Book className="w-4 h-4" />
                    Documentation
                  </Button>
                )}
              </div>
            </div>

            {/* Rating & Stats */}
            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(tool.average_rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-muted text-muted"
                    }`}
                  />
                ))}
                <span className="text-lg font-medium ml-2">
                  {tool.average_rating.toFixed(1)}
                </span>
                <span className="text-muted-foreground">
                  ({tool.total_reviews} reviews)
                </span>
              </div>
              <div className="w-px h-6 bg-border" />
              <Badge variant="outline">v{tool.version}</Badge>
              <Badge variant="outline">{tool.category}</Badge>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="developer">Developer</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Description */}
            <div className="prose dark:prose-invert max-w-none">
              <h2 className="text-2xl font-semibold mb-4">About this tool</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {tool.description}
              </p>
            </div>

            {/* Screenshots */}
            {Array.isArray(tool.screenshots) && tool.screenshots.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Screenshots</h2>
                <div className="grid grid-cols-2 gap-6">
                  {tool.screenshots.map((screenshot, index) => (
                    <img
                      key={index}
                      src={screenshot}
                      alt={`${tool.name} screenshot ${index + 1}`}
                      className="rounded-xl shadow-lg w-full h-auto hover:scale-[1.02] transition-transform cursor-pointer"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {tool.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            {tool.reviews?.map((review, index) => (
              <div
                key={index}
                className="bg-card border rounded-xl p-6 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={review.user.avatar} />
                      <AvatarFallback>
                        {review.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{review.user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {review.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground">{review.comment}</p>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="developer" className="space-y-6">
            <div className="bg-card border rounded-xl p-8">
              <div className="flex items-center gap-6 mb-8">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={tool.developer_avatar} />
                  <AvatarFallback>
                    {(tool.developer_name || 'Unknown').charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-semibold">
                    {tool.developer_name || 'Unknown Developer'}
                  </h2>
                  {tool.developer_company && (
                    <p className="text-muted-foreground">
                      {tool.developer_company}
                    </p>
                  )}
                </div>
              </div>

              {tool.github_url && (
                <Button 
                  variant="outline" 
                  onClick={() => window.open(tool.github_url, '_blank')}
                  className="gap-2"
                >
                  <Code className="w-4 h-4" />
                  View Source Code
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
} 