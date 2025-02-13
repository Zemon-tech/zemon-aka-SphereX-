"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Heart, MessageSquare, Share2 } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";

export default function EventDetailPage() {
  return (
    <PageContainer className="py-6">
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="space-y-8">
          {/* Content will be populated with real data */}
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
            <div className="h-[400px] bg-muted rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </motion.article>
    </PageContainer>
  );
} 