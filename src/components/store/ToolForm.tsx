"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2, Wrench, Tag, ImageIcon, ListFilter, Globe, Github, DollarSign } from "lucide-react";

interface ToolFormProps {
  initialData?: {
    title: string;
    description: string;
    category: string;
    websiteUrl: string;
    githubUrl?: string;
    image: string;
    price?: string;
    tags: string[];
  };
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

export default function ToolForm({ initialData, onSubmit, onCancel, isEdit = false }: ToolFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(initialData?.image || "");

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

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImagePreview(e.target.value);
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
                {isEdit ? "Edit Tool" : "Submit New Tool"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Share a useful developer tool with the community
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
                  <Wrench className="w-4 h-4 text-primary" />
                  Tool Name
                </span>
              </label>
              <input
                type="text"
                name="title"
                defaultValue={initialData?.title}
                required
                className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Enter tool name"
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
                <option value="Developer Tools">Developer Tools</option>
                <option value="Productivity">Productivity</option>
                <option value="Design">Design Tools</option>
                <option value="Testing">Testing Tools</option>
                <option value="Analytics">Analytics</option>
                <option value="DevOps">DevOps</option>
                <option value="Security">Security</option>
                <option value="Database">Database Tools</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <span className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-primary" />
                  Description
                </span>
              </label>
              <textarea
                name="description"
                defaultValue={initialData?.description}
                required
                rows={4}
                className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Describe what this tool does and why it's useful"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <span className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" />
                    Website URL
                  </span>
                </label>
                <input
                  type="url"
                  name="websiteUrl"
                  defaultValue={initialData?.websiteUrl}
                  required
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Tool's website URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <span className="flex items-center gap-2">
                    <Github className="w-4 h-4 text-primary" />
                    GitHub URL (Optional)
                  </span>
                </label>
                <input
                  type="url"
                  name="githubUrl"
                  defaultValue={initialData?.githubUrl}
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="GitHub repository URL"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <span className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-primary" />
                    Tool Image URL
                  </span>
                </label>
                <input
                  type="url"
                  name="image"
                  defaultValue={initialData?.image}
                  onChange={handleImageUrlChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Enter image URL"
                />
              </div>

              {imagePreview && (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="object-cover w-full h-full"
                    onError={() => setImagePreview("")}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <span className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-primary" />
                    Price (Optional)
                  </span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <input
                    type="text"
                    name="price"
                    defaultValue={initialData?.price}
                    placeholder="Free"
                    className="w-full pl-8 pr-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
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
                  {isEdit ? "Update Tool" : "Submit Tool"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
} 