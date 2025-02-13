"use client";

import { motion } from "framer-motion";
import { ArrowRight, Github, Globe, Calendar } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-8">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-gradient-to-r from-primary/10 via-background to-primary/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container px-4 text-center space-y-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold">
            Welcome to{" "}
            <span className="text-primary">
              Sphere<span className="text-foreground">X</span>
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your gateway to the open source community. Discover projects, connect with developers,
            and stay updated with the latest in tech.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/repos"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Explore Projects <ArrowRight size={20} />
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
            >
              Join Events <Calendar size={20} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Featured Sections */}
      <section className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Featured Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-lg border bg-card text-card-foreground"
          >
            <div className="flex items-center gap-4 mb-4">
              <Github className="w-8 h-8 text-primary" />
              <h2 className="text-xl font-semibold">Featured Projects</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Discover trending open source projects and contribute to the community.
            </p>
            <Link
              href="/repos"
              className="inline-flex items-center text-sm text-primary hover:underline"
            >
              View Projects <ArrowRight size={16} className="ml-1" />
            </Link>
          </motion.div>

          {/* Latest News */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-lg border bg-card text-card-foreground"
          >
            <div className="flex items-center gap-4 mb-4">
              <Globe className="w-8 h-8 text-primary" />
              <h2 className="text-xl font-semibold">Latest News</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Stay updated with the latest tech news, blogs, and community updates.
            </p>
            <Link
              href="/news"
              className="inline-flex items-center text-sm text-primary hover:underline"
            >
              Read News <ArrowRight size={16} className="ml-1" />
            </Link>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-lg border bg-card text-card-foreground"
          >
            <div className="flex items-center gap-4 mb-4">
              <Calendar className="w-8 h-8 text-primary" />
              <h2 className="text-xl font-semibold">Upcoming Events</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Join hackathons, workshops, and community events worldwide.
            </p>
            <Link
              href="/events"
              className="inline-flex items-center text-sm text-primary hover:underline"
            >
              View Events <ArrowRight size={16} className="ml-1" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
