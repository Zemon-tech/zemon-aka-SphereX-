"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import PageContainer from "@/components/layout/PageContainer";

interface NewsDetail {
  _id: string;
  title: string;
  content: string;
  category: string;
  image: string;
  tags: string[];
  author: {
    name: string;
    avatar: string;
  };
  createdAt: string;
  views: number;
  likes: string[];
}

export default function NewsDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const [news, setNews] = useState<NewsDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/news/${params.id}`);
        const data = await response.json();
        if (data.success) {
          setNews(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch news detail');
        }
      } catch (error) {
        console.error('Error fetching news detail:', error);
        toast({
          title: "Error",
          description: "Failed to load news article",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchNewsDetail();
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

  if (!news) {
    return (
      <PageContainer>
        <div className="py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Article not found</h1>
          <Link href="/news" className="text-primary hover:underline">
            Back to News
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-8">
      <Link
        href="/news"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft size={20} />
        Back to News
      </Link>

      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{news.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <img
                src={news.author?.avatar || '/placeholder-avatar.jpg'}
                alt={news.author?.name || 'Anonymous'}
                className="w-6 h-6 rounded-full"
              />
              <span>{news.author?.name || 'Anonymous'}</span>
            </div>
            <span>•</span>
            <time dateTime={news.createdAt}>
              {new Date(news.createdAt).toLocaleDateString()}
            </time>
            <span>•</span>
            <span>{news.views} views</span>
          </div>
        </header>

        {news.image && (
          <img
            src={news.image}
            alt={news.title}
            className="w-full h-[400px] object-cover rounded-lg mb-8"
          />
        )}

        <div className="prose prose-lg max-w-none">
          {news.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {news.tags && news.tags.length > 0 && (
          <div className="mt-8 pt-8 border-t">
            <h2 className="text-lg font-semibold mb-4">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {news.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-secondary rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </PageContainer>
  );
} 