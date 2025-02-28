"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Star, Book, Code } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import RatingForm from "@/components/store/RatingForm";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { API_BASE_URL } from "@/lib/api";
import Image from "next/image";

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
  author: {
    _id: string;
    name: string;
    avatar?: string;
  };
  version?: string;
  lastUpdated?: string;
  screenshots?: string[];
  images: string[];
  reviews?: Array<{
    user_name: string;
    rating: number;
    comment: string;
    createdAt: string;
  }>;
}

export default function StoreItemPage() {
  const params = useParams();
  const { toast } = useToast();
  const [tool, setTool] = useState<ToolDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userReview, setUserReview] = useState<{ rating: number; comment: string; } | null>(null);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchStoreItem();
  }, [params.id]);

  useEffect(() => {
    // Find user's review when tool data is loaded
    if (tool?.reviews) {
      const token = localStorage.getItem('token');
      if (token) {
        // Decode the token to get user info (assuming JWT)
        try {
          const tokenData = JSON.parse(atob(token.split('.')[1]));
          const review = tool.reviews.find(r => r.user_name === tokenData.name);
          if (review) {
            setUserReview({
              rating: review.rating,
              comment: review.comment
            });
          } else {
            setUserReview(null);
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          setUserReview(null);
        }
      }
    }
  }, [tool]);

  useEffect(() => {
    // Get current user ID from token
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(tokenData.id);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const fetchStoreItem = async () => {
    try {
      setIsLoading(true);
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

  const handleAddImage = async () => {
    try {
      setIsAddingImage(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to add images');
      }

      const response = await fetch(`${API_BASE_URL}/api/store/${tool?._id}/images`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ imageUrl: newImageUrl }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add image');
      }

      // Update local state
      setTool(prevTool => ({
        ...prevTool!,
        images: [...(prevTool?.images || []), newImageUrl],
      }));

      setNewImageUrl('');
      toast({
        title: "Success",
        description: "Image added successfully",
      });
    } catch (error) {
      console.error('Error adding image:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add image",
        variant: "destructive",
      });
    } finally {
      setIsAddingImage(false);
    }
  };

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
            <Image
              src={tool.thumbnail}
              alt={`${tool.name} thumbnail`}
              width={500}
              height={300}
              className="w-full h-auto rounded-lg"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-bold">{tool.name}</h1>
                <p className="text-lg text-muted-foreground mt-2">
                  by {tool.author?.name || 'Unknown Developer'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  onClick={() => window.open(tool.url, '_blank')}
                  size="lg"
                  className="gap-2"
                >
                  Visit Tool
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
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < Math.floor(tool.average_rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-muted text-muted"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">
                    {tool.average_rating.toFixed(1)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {tool.total_reviews} {tool.total_reviews === 1 ? 'review' : 'reviews'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline">{tool.category}</Badge>
                <Badge variant="outline">{tool.price}</Badge>
              </div>
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

            {/* Images Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Images</h2>
                {currentUserId && tool?.author?._id && currentUserId === tool.author._id && (
                  <div className="flex items-center gap-4">
                    <Input
                      type="url"
                      placeholder="Enter image URL"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="w-80"
                    />
                    <Button 
                      onClick={handleAddImage}
                      disabled={!newImageUrl || isAddingImage}
                    >
                      {isAddingImage ? "Adding..." : "Add Image"}
                    </Button>
                  </div>
                )}
              </div>

              {tool.images && tool.images.length > 0 ? (
                <Carousel className="w-full max-w-4xl mx-auto">
                  <CarouselContent>
                    {tool.images.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="aspect-video w-full overflow-hidden rounded-xl">
                          <Image
                            src={image}
                            alt={`${tool.name} screenshot`}
                            width={800}
                            height={600}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              ) : (
                <div className="text-center py-12 text-muted-foreground border rounded-xl">
                  No images available
                </div>
              )}
            </div>

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

          <TabsContent value="reviews" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-semibold mb-6">
                  {userReview ? 'Your Review' : 'Add Your Review'}
                </h2>
                <RatingForm 
                  storeId={tool._id} 
                  existingReview={userReview}
                  onReviewAdded={() => {
                    fetchStoreItem();
                  }} 
                />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-6">
                  Reviews ({tool.total_reviews})
                </h2>
                <div className="space-y-6">
                  {tool.reviews && tool.reviews.length > 0 ? (
                    tool.reviews.map((review, index) => (
                      <div
                        key={index}
                        className="bg-card border rounded-xl p-6 space-y-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>
                                {review.user_name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{review.user_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(review.createdAt).toLocaleDateString()}
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
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      No reviews yet. Be the first to review!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="developer" className="space-y-6">
            <div className="bg-card border rounded-xl p-8">
              <div className="flex items-center gap-6 mb-8">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={tool.author?.avatar} />
                  <AvatarFallback>
                    {tool.author?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-semibold">
                    {tool.author?.name || 'Unknown Developer'}
                  </h2>
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