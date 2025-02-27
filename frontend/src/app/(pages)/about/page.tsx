"use client";

import { motion } from "framer-motion";
import { Code, Users, Globe, Shield, Cpu, Sparkles } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";

export default function AboutPage() {
  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto py-12"
      >
        <h1 className="text-4xl font-bold mb-6">About Zemon</h1>
        
        <div className="prose prose-lg dark:prose-invert">
          <p className="text-xl text-muted-foreground mb-8">
            Zemon is India's premier open-source technology platform, fostering innovation and collaboration across all domains of technology development.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Global Community</h3>
              </div>
              <p className="text-muted-foreground">
                Connecting developers, innovators, and tech enthusiasts from across India and beyond.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Code className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Open Source First</h3>
              </div>
              <p className="text-muted-foreground">
                Championing open-source development and collaborative innovation.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Cpu className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Tech Diversity</h3>
              </div>
              <p className="text-muted-foreground">
                From AI/ML to Blockchain, Cybersecurity to Web Development, and beyond.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Community Driven</h3>
              </div>
              <p className="text-muted-foreground">
                Built by developers, for developers, ensuring sustainable growth.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg text-muted-foreground mb-8">
            To establish India's largest and most vibrant open-source ecosystem, fostering technological innovation and collaboration across all domains of software development.
          </p>

          <h2 className="text-3xl font-bold mb-6">Technology Focus Areas</h2>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <span>Artificial Intelligence & Machine Learning</span>
            </li>
            <li className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-primary" />
              <span>Cybersecurity & Privacy</span>
            </li>
            <li className="flex items-center gap-3">
              <Code className="w-5 h-5 text-primary" />
              <span>Web Development & Cloud Computing</span>
            </li>
            <li className="flex items-center gap-3">
              <Cpu className="w-5 h-5 text-primary" />
              <span>Blockchain & Emerging Technologies</span>
            </li>
          </ul>

          <div className="bg-card border rounded-lg p-8 my-12">
            <h2 className="text-2xl font-bold mb-4">Join the Revolution</h2>
            <p className="text-muted-foreground mb-6">
              Whether you're a seasoned developer or just starting your journey, Zemon provides the platform, tools, and community to help you grow and make an impact in the tech world.
            </p>
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              Get Started Today
            </button>
          </div>
        </div>
      </motion.div>
    </PageContainer>
  );
} 