"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Star, Globe, Github, Tag, Eye, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import PageContainer from "@/components/layout/PageContainer";

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
  author_name: string;
  reviews: Array<{
    user_name: string;
    rating: number;
    comment: string;
    createdAt: string;
  }>;
  average_rating: number;
  total_reviews: number;
  views: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function StoreItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [item, setItem] = useState<StoreItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStoreItem = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/store/${params.id}`);
        const data = await response.json();
        if (data.success) {
          setItem(data.data);
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
        <div className="animate-pulse space-y-4 py-8">
          <div className="h-8 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="h-96 bg-muted rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!item) {
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
      <Link
        href="/store"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft size={20} />
        Back to Store
      </Link>

      <article>
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={item.thumbnail}
              alt={item.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h1 className="text-3xl font-bold">{item.name}</h1>
              <p className="text-muted-foreground">
                Added by {item.author_name} on {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <span className="font-medium">{item.average_rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({item.total_reviews} reviews)</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {item.views} views
            </div>
            <div className="flex items-center gap-1">
              <Tag className="w-4 h-4" />
              {item.category}
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              {item.reviews.length} comments
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Globe className="w-4 h-4" />
              Visit Website
            </a>
            {item.github_url && (
              <a
                href={item.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-accent transition-colors"
              >
                <Github className="w-4 h-4" />
                View Source
              </a>
            )}
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <h2 className="text-xl font-semibold mb-4">About</h2>
          <p className="text-muted-foreground whitespace-pre-wrap">{item.description}</p>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <h2 className="text-xl font-semibold mb-6">Reviews</h2>
          {item.reviews.length > 0 ? (
            <div className="space-y-6">
              {item.reviews.map((review, index) => (
                <div key={index} className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.user_name}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      <span>{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No reviews yet. Be the first to review this tool!
            </p>
          )}
        </div>
      </article>
    </PageContainer>
  );
} 