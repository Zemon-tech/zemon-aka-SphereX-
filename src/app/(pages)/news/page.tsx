"use client";

import { motion } from "framer-motion";
import PageContainer from "@/components/layout/PageContainer";

export default function NewsPage() {
  return (
    <PageContainer className="py-6">
      <div className="space-y-8">
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-lg border bg-card overflow-hidden animate-pulse">
              <div className="h-48 bg-muted"></div>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-4 bg-muted rounded-full w-20"></div>
                  <div className="h-4 bg-muted rounded w-24"></div>
                </div>
                <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-full mb-4"></div>
                <div className="h-4 bg-muted rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
} 