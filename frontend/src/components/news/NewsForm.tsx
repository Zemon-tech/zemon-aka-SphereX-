"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2, Newspaper, Tag, ImageIcon, ListFilter } from "lucide-react";

interface NewsFormProps {
  initialData?: {
    title: string;
    content: string;
    category: string;
    image: string;
    tags: string[];
  };
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

export default function NewsForm({ initialData, onSubmit, onCancel, isEdit = false }: NewsFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
    >
      <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-card border rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold">
                {isEdit ? "Edit Article" : "Submit News Article"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Share the latest tech news with the community
              </p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-accent rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                <span className="flex items-center gap-2">
                  <Newspaper className="w-4 h-4 text-primary" />
                  Article Title
                </span>
              </label>
              <input
                type="text"
                name="title"
                defaultValue={initialData?.title}
                required
                className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Enter article title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <span className="flex items-center gap-2">
                  <ListFilter className="w-4 h-4 text-primary" />
                  Category
                </span>
              </label>
              <select
                name="category"
                defaultValue={initialData?.category}
                required
                className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="">Select Category</option>
                <option value="Framework Updates">Framework Updates</option>
                <option value="Security">Security</option>
                <option value="Community">Community</option>
                <option value="Tutorials">Tutorials</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <span className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-primary" />
                  Content
                </span>
              </label>
              <textarea
                name="content"
                defaultValue={initialData?.content}
                required
                rows={8}
                className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Write your article content here..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <span className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-primary" />
                  Tags
                </span>
              </label>
              <input
                type="text"
                name="tags"
                defaultValue={initialData?.tags?.join(", ")}
                placeholder="Separate tags with commas"
                className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <span className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-primary" />
                  Cover Image URL
                </span>
              </label>
              <input
                type="url"
                name="image"
                defaultValue={initialData?.image}
                className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Enter image URL"
              />
            </div>

            <div className="pt-6 border-t">
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 rounded-lg border hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {isLoading && <Loader2 size={18} className="animate-spin" />}
                  {isEdit ? "Update Article" : "Publish Article"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
} 