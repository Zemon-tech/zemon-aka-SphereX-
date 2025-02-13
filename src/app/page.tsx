"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Code, Users, Zap } from "lucide-react";
import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Components from previous implementation
const SparklesBackground = () => {
  const sparkles = Array.from({ length: 20 }, (_, i) => ({
    top: `${(i * 5) % 100}%`,
    left: `${((i * 7) + 3) % 100}%`,
    delay: `${(i * 0.2)}s`
  }));

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80" />
      <div
        aria-hidden="true"
        className="absolute inset-0 [--sparkle-color:rgb(var(--primary))] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
      >
        {sparkles.map((sparkle, i) => (
          <div
            key={i}
            className="absolute animate-sparkle"
            style={{
              top: sparkle.top,
              left: sparkle.left,
              width: "2px",
              height: "2px",
              backgroundColor: "var(--sparkle-color)",
              borderRadius: "50%",
              animationDelay: sparkle.delay,
            }}
          />
        ))}
      </div>
    </div>
  );
};

const StatsCard = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <Card>
    <CardContent className="flex items-center gap-4 p-6">
      <div className="p-3 rounded-full bg-primary/10">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </CardContent>
  </Card>
);

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      <SparklesBackground />
      <PageContainer>
        {/* Hero Section */}
        <section className="py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="mb-4" variant="secondary">
              ✨ Welcome to SphereX
            </Badge>
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary/60">
              Building the Future of Open Source
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Join our community of developers, contribute to amazing projects, and shape the future of software development.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" className="gap-2">
                <Sparkles className="w-4 h-4" />
                Explore Projects
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Users className="w-4 h-4" />
                Join Events
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard icon={Code} label="Open Source Projects" value="500+" />
            <StatsCard icon={Users} label="Community Members" value="10,000+" />
            <StatsCard icon={Zap} label="Monthly Downloads" value="1M+" />
          </div>
        </section>

        {/* Featured Projects Section */}
        <section className="py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Projects</h2>
              <p className="text-muted-foreground">
                Discover trending open source projects and contribute to the community.
              </p>
            </div>
            <Button variant="link" className="gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          {/* Loading skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-muted rounded w-full mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="py-16">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />
            <CardContent className="relative p-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Join our growing community of developers and contributors. Start exploring projects, 
                  sharing ideas, and building the future together.
                </p>
                <Button size="lg" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Join Community
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </section>
      </PageContainer>
    </div>
  );
}
