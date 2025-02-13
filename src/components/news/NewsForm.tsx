"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Image, Loader2 } from "lucide-react";

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
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    formData.append("tags", JSON.stringify(tags));
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting news:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div className="bg-card w-full max-w-2xl rounded-lg shadow-lg border p-6">
        <h2 className="text-2xl font-bold mb-6">
          {isEdit ? "Edit News Article" : "Create News Article"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              name="title"
              defaultValue={initialData?.title}
              required
              className="w-full px-4 py-2 rounded-lg border bg-background"
              placeholder="Enter article title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              name="category"
              defaultValue={initialData?.category}
              required
              className="w-full px-4 py-2 rounded-lg border bg-background"
            >
              <option value="">Select category</option>
              <option value="Framework Updates">Framework Updates</option>
              <option value="Security">Security</option>
              <option value="Community">Community</option>
              <option value="Tutorials">Tutorials</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            <textarea
              name="content"
              defaultValue={initialData?.content}
              required
              rows={8}
              className="w-full px-4 py-2 rounded-lg border bg-background"
              placeholder="Write your article content..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <div className="flex gap-4">
              <input
                type="text"
                name="image"
                defaultValue={initialData?.image}
                className="flex-1 px-4 py-2 rounded-lg border bg-background"
                placeholder="Enter image URL"
              />
              <button
                type="button"
                className="px-4 py-2 rounded-lg border hover:bg-accent"
              >
                <Image size={20} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-destructive"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="w-full px-4 py-2 rounded-lg border bg-background"
              placeholder="Type tag and press Enter"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg border hover:bg-accent"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading && <Loader2 size={18} className="animate-spin" />}
              {isEdit ? "Update Article" : "Publish Article"}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
} 