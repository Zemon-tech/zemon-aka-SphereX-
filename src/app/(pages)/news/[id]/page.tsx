"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, MessageSquare, Share2, Calendar, User } from "lucide-react";
import Link from "next/link";

// Mock data for demonstration
const mockNewsDetail = {
  id: 1,
  title: "Next.js 14 Released with Improved Performance",
  content: `
    <p>The Next.js team has announced the release of version 14, bringing significant performance improvements and new features to the popular React framework.</p>
    
    <h2>Key Features</h2>
    <ul>
      <li>Improved server components with partial rendering</li>
      <li>Enhanced static optimization</li>
      <li>Better TypeScript support</li>
      <li>New middleware capabilities</li>
    </ul>
    
    <p>The update focuses on developer experience and build performance, with some users reporting up to 40% faster build times...</p>
  `,
  author: {
    name: "John Doe",
    avatar: "https://github.com/shadcn.png",
    role: "Tech Writer",
  },
  category: "Framework Updates",
  date: "2024-02-13",
  image: "https://picsum.photos/800/400",
  tags: ["nextjs", "react", "web-development"],
  views: 1234,
  likes: 567,
  comments: [
    {
      id: 1,
      user: {
        name: "Alice Smith",
        avatar: "https://github.com/shadcn.png",
      },
      content: "This is amazing! Can't wait to try the new features.",
      date: "2024-02-13",
    },
    // Add more comments as needed
  ],
};

export default function NewsDetailPage({ params }: { params: { id: string } }) {
  const [isLiked, setIsLiked] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement comment submission
    console.log("Comment submitted:", commentText);
    setCommentText("");
  };

  return (
    <div className="container px-4 py-8">
      <Link
        href="/news"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8"
      >
        <ArrowLeft size={20} />
        Back to News
      </Link>

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <img
          src={mockNewsDetail.image}
          alt={mockNewsDetail.title}
          className="w-full h-[400px] object-cover rounded-lg mb-8"
        />

        <div className="flex items-center gap-4 mb-6">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
            {mockNewsDetail.category}
          </span>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar size={16} />
            <span className="text-sm">{mockNewsDetail.date}</span>
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-6">{mockNewsDetail.title}</h1>

        <div className="flex items-center gap-4 mb-8">
          <img
            src={mockNewsDetail.author.avatar}
            alt={mockNewsDetail.author.name}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <p className="font-medium">{mockNewsDetail.author.name}</p>
            <p className="text-sm text-muted-foreground">
              {mockNewsDetail.author.role}
            </p>
          </div>
        </div>

        <div
          className="prose prose-zinc dark:prose-invert max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: mockNewsDetail.content }}
        />

        <div className="flex flex-wrap gap-2 mb-8">
          {mockNewsDetail.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-6 py-4 border-t border-b mb-8">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`flex items-center gap-2 ${
              isLiked ? "text-red-500" : "text-muted-foreground"
            }`}
          >
            <Heart size={20} className={isLiked ? "fill-current" : ""} />
            <span>{mockNewsDetail.likes + (isLiked ? 1 : 0)}</span>
          </button>
          <button className="flex items-center gap-2 text-muted-foreground">
            <MessageSquare size={20} />
            <span>{mockNewsDetail.comments.length}</span>
          </button>
          <button className="flex items-center gap-2 text-muted-foreground ml-auto">
            <Share2 size={20} />
            Share
          </button>
        </div>

        {/* Comments Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Comments</h2>
          
          <form onSubmit={handleComment} className="mb-8">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-4 rounded-lg border bg-background min-h-[100px] mb-4"
            />
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Post Comment
            </button>
          </form>

          <div className="space-y-6">
            {mockNewsDetail.comments.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <img
                  src={comment.user.avatar}
                  alt={comment.user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{comment.user.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {comment.date}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </motion.article>
    </div>
  );
} 