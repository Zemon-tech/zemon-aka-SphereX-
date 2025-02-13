"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2, Code, Link as LinkIcon, Github, Tag, FileText, Globe } from "lucide-react";

interface ProjectFormProps {
  initialData?: {
    name: string;
    description: string;
    language: string;
    repoUrl: string;
    demoUrl?: string;
    tags: string[];
  };
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

export default function ProjectForm({ initialData, onSubmit, onCancel, isEdit = false }: ProjectFormProps) {
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
                {isEdit ? "Edit Project" : "Add New Project"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Share your open source project with the community
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
                  <Code className="w-4 h-4 text-primary" />
                  Project Name
                </span>
              </label>
              <input
                type="text"
                name="name"
                defaultValue={initialData?.name}
                required
                className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Enter project name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Description
                </span>
              </label>
              <textarea
                name="description"
                defaultValue={initialData?.description}
                required
                rows={4}
                className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Describe your project"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <span className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-primary" />
                  Primary Language
                </span>
              </label>
              <select
                name="language"
                defaultValue={initialData?.language}
                required
                className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="">Select Language</option>
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
                <option value="cpp">C++</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <span className="flex items-center gap-2">
                    <Github className="w-4 h-4 text-primary" />
                    Repository URL
                  </span>
                </label>
                <input
                  type="url"
                  name="repoUrl"
                  defaultValue={initialData?.repoUrl}
                  required
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="GitHub repository URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <span className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" />
                    Demo URL (Optional)
                  </span>
                </label>
                <input
                  type="url"
                  name="demoUrl"
                  defaultValue={initialData?.demoUrl}
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Live demo URL"
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
                placeholder="Separate tags with commas (e.g., web, api, database)"
                className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 transition-all"
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
                  {isEdit ? "Update Project" : "Add Project"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
} 