"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";

export default function PrivacyPage() {
  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto py-12"
      >
        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
        <div className="prose prose-lg dark:prose-invert">
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="my-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">Data Protection</h2>
            </div>
            <p className="text-muted-foreground">
              At Zemon, we take your privacy seriously. This policy outlines how we collect, use, and protect your personal information when you use our platform.
            </p>
          </div>

          <div className="space-y-8">
            <section>
              <h3 className="text-xl font-semibold mb-4">Information We Collect</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>Account information (name, email, profile data)</li>
                <li>Usage data and platform interactions</li>
                <li>Project contributions and collaboration history</li>
                <li>Technical information (IP address, browser data)</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4">How We Use Your Information</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>Providing and improving our services</li>
                <li>Personalizing your experience</li>
                <li>Communication about updates and features</li>
                <li>Security and fraud prevention</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4">Data Security</h3>
              <p className="text-muted-foreground">
                We implement industry-standard security measures to protect your data:
              </p>
              <ul className="space-y-2 text-muted-foreground mt-2">
                <li>Encryption of sensitive data</li>
                <li>Regular security audits</li>
                <li>Access controls and monitoring</li>
                <li>Secure data storage practices</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4">Your Rights</h3>
              <p className="text-muted-foreground">
                You have the right to:
              </p>
              <ul className="space-y-2 text-muted-foreground mt-2">
                <li>Access your personal data</li>
                <li>Request data correction or deletion</li>
                <li>Opt-out of marketing communications</li>
                <li>Data portability</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
              <p className="text-muted-foreground">
                If you have any questions about our privacy policy or data practices, please contact us at{" "}
                <a href="mailto:privacy@zemon.dev" className="text-primary hover:underline">
                  privacy@zemon.dev
                </a>
              </p>
            </section>
          </div>
        </div>
      </motion.div>
    </PageContainer>
  );
} 