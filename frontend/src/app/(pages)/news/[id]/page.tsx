"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Eye, Clock, Twitter, Linkedin, Link2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import PageContainer from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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

interface RelatedNews {
  _id: string;
  title: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
  views: number;
}

export default function NewsDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const [news, setNews] = useState<NewsDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedNews, setRelatedNews] = useState<RelatedNews[]>([]);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const newsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news/${params.id}`);
        const newsData = await newsResponse.json();

        if (newsData.success) {
          setNews(newsData.data);
          
          // Fetch related news after we have the category
          const relatedResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/news?limit=3&category=${
              encodeURIComponent(newsData.data.category)
            }`
          );
          const relatedData = await relatedResponse.json();

          // Transform the data to ensure proper date and views
          const transformedRelated = relatedData.data.news
            .filter((item: RelatedNews) => item._id !== params.id)
            .slice(0, 3)
            .map((item: RelatedNews) => ({
              _id: item._id,
              title: item.title,
              category: item.category,
              date: item.date || new Date().toISOString(),
              image: item.image || '/placeholder-news.jpg',
              excerpt: item.excerpt,
              views: typeof item.views === 'number' ? item.views : 0
            }));

          setRelatedNews(transformedRelated);
        } else {
          throw new Error(newsData.message || 'Failed to fetch news detail');
        }
      } catch (error) {
        console.error('Error fetching news detail:', error);
        toast({
          title: "Error",
          description: "Failed to load content",
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

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      toast({
        title: "Success",
        description: "Link copied to clipboard",
      });
      // Reset the copied state after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Error copying link:', error);
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  const handleTwitterShare = () => {
    const shareUrl = window.location.href;
    const shareText = news?.title || 'Check out this article';
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  const handleLinkedInShare = () => {
    const shareUrl = window.location.href;
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedInUrl, '_blank', 'noopener,noreferrer');
  };

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
    <PageContainer className="py-12">
      {/* Back Button */}
      <Link
        href="/news"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span>Back to News</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content - increased width */}
        <article className="lg:col-span-9 space-y-8">
          {/* Header Section */}
          <header className="space-y-6">
            <div className="space-y-4">
              <Badge variant="outline" className="text-primary border-primary/30">
                {news.category}
              </Badge>
              <h1 className="text-4xl font-bold leading-tight tracking-tight">
                {news.title}
              </h1>
            </div>

            {/* Author and Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-b pb-6">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 ring-2 ring-background">
                  <AvatarImage src={news.author?.avatar || '/placeholder-avatar.jpg'} />
                  <AvatarFallback>
                    {news.author?.name?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">
                    {news.author?.name || 'Anonymous'}
                  </p>
                  <time dateTime={news.createdAt} className="text-xs">
                    {new Date(news.createdAt).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </time>
                </div>
              </div>
              <div className="flex items-center gap-4 ml-auto">
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span>{news.views} views</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>5 min read</span>
                </div>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {news.image && (
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg">
              <Image
                src={news.image}
                alt={news.title}
                className="object-cover"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {news.content.split('\n').map((paragraph, index) => (
              <p key={index} className="text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Tags Section */}
          {news.tags && news.tags.length > 0 && (
            <div className="border-t pt-8">
              <h2 className="text-lg font-semibold mb-4">Related Topics</h2>
              <div className="flex flex-wrap gap-2">
                {news.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="px-3 py-1.5 bg-secondary/50 hover:bg-secondary/70 transition-colors cursor-pointer"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Share Section */}
          <div className="border-t pt-8">
            <h2 className="text-lg font-semibold mb-4">Share this article</h2>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 hover:bg-primary/5"
                onClick={handleTwitterShare}
              >
                <Twitter className="w-4 h-4" />
                Twitter
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 hover:bg-primary/5"
                onClick={handleLinkedInShare}
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 hover:bg-primary/5"
                onClick={handleCopyLink}
              >
                <Link2 className="w-4 h-4" />
                {isCopied ? "Copied!" : "Copy Link"}
              </Button>
            </div>
          </div>
        </article>

        {/* Related News Sidebar */}
        <aside className="lg:col-span-3">
          <div className="sticky top-24 bg-card rounded-xl border shadow-sm">
            {/* Header */}
            <div className="p-4 border-b bg-muted/30">
              <h2 className="text-lg font-semibold">Related Articles</h2>
            </div>

            {/* Articles List */}
            <div className="p-4">
              <div className="space-y-6">
                {relatedNews.map((article) => (
                  <Link 
                    href={`/news/${article._id}`} 
                    key={article._id}
                    className="block group"
                  >
                    <div className="space-y-3 hover:bg-muted/50 rounded-lg transition-colors p-2 -mx-2">
                      {/* Image Container */}
                      <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
                        <Image
                          src={article.image}
                          alt={article.title}
                          className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-2 left-2">
                          <Badge 
                            variant="secondary" 
                            className="bg-background/95 text-xs px-2 py-0.5 font-medium"
                          >
                            {article.category}
                          </Badge>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                          {article.title}
                        </h3>
                        
                        {/* Meta Info */}
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <time className="font-medium">
                            {new Date(article.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </time>
                          <div className="flex items-center gap-1 text-xs">
                            <Eye className="w-3.5 h-3.5" />
                            <span>{article.views || 0} views</span>
                          </div>
                        </div>
                      </div>

                      {/* Hover Indicator */}
                      <div className="h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-300" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* View All Link */}
            <div className="p-4 border-t bg-muted/30">
              <Link 
                href="/news" 
                className="text-sm text-primary hover:text-primary/80 font-medium flex items-center justify-center gap-2 group"
              >
                View All Articles
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </PageContainer>
  );
}