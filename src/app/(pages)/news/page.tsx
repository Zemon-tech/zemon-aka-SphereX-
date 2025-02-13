"use client";

import { motion } from "framer-motion";
import PageContainer from "@/components/layout/PageContainer";

export default function NewsPage() {
  return (
    <PageContainer className="py-6">
      <div className="space-y-8">
        {/* Loading skeleton */}
        <div className="animate-pulse space-y-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 rounded-lg border bg-card">
              <div className="h-4 bg-muted rounded w-24 mb-2"></div>
              <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-muted rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
} 