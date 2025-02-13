"use client";

import { motion } from "framer-motion";
import { FileText, CheckCircle, AlertCircle, HelpCircle } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";

export default function TermsPage() {
  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto py-12"
      >
        <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
        <div className="prose prose-lg dark:prose-invert">
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="my-8">
            <p className="text-lg text-muted-foreground">
              Welcome to Zemon. By using our platform, you agree to these terms. Please read them carefully.
            </p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Platform Usage</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Zemon provides a platform for open-source collaboration, project sharing, and community interaction.
                </p>
                <ul className="space-y-2">
                  <li>You must be at least 13 years old to use the platform</li>
                  <li>You are responsible for maintaining account security</li>
                  <li>You agree to use the platform in compliance with all applicable laws</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Content Guidelines</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>Users must ensure their content:</p>
                <ul className="space-y-2">
                  <li>Respects intellectual property rights</li>
                  <li>Does not contain malicious code or security threats</li>
                  <li>Follows community guidelines and code of conduct</li>
                  <li>Is appropriate for a professional development environment</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Intellectual Property</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Users retain rights to their original content while granting Zemon necessary licenses to operate the platform.
                </p>
                <ul className="space-y-2">
                  <li>Respect open-source licenses and attributions</li>
                  <li>Do not infringe on others' intellectual property</li>
                  <li>Properly license your contributions</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Community Standards</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>We expect all users to:</p>
                <ul className="space-y-2">
                  <li>Be respectful and professional</li>
                  <li>Contribute constructively to discussions</li>
                  <li>Report violations and inappropriate content</li>
                  <li>Help maintain a positive community environment</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Termination</h2>
              <p className="text-muted-foreground">
                Zemon reserves the right to suspend or terminate accounts that violate these terms or pose a risk to the community.
              </p>
            </section>

            <div className="bg-card border rounded-lg p-6 mt-8">
              <h2 className="text-xl font-semibold mb-4">Questions About Terms?</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about our terms of service, please contact our support team.
              </p>
              <a
                href="mailto:legal@zemon.dev"
                className="text-primary hover:underline flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4" />
                Contact Legal Team
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </PageContainer>
  );
} 