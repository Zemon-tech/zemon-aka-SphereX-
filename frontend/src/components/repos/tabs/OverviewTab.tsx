"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book, GitBranch, GitCommit } from "lucide-react";
import LanguagesChart from "../charts/LanguagesChart";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import React, { useMemo } from "react";
import type { SyntaxHighlighterProps } from "react-syntax-highlighter";
import type { DetailedHTMLProps, HTMLAttributes } from "react";

interface OverviewTabProps {
  readme: string;
  languages: { name: string; value: number; color: string }[];
  branches: { name: string; lastCommit: string }[];
  lastCommits: { message: string; author: string; date: string }[];
  repoInfo: {
    owner: string;
    name: string;
    defaultBranch: string;
  };
}

export default function OverviewTab({
  readme,
  languages,
  branches,
  lastCommits,
  repoInfo,
}: OverviewTabProps) {
  const getImagePath = (src: string) => {
    if (!src) return "";
    if (src.startsWith("http")) return src;

    // Handle relative paths
    const cleanPath = src.replace(/^[./]+/, "");
    return `https://raw.githubusercontent.com/${repoInfo.owner}/${repoInfo.name}/${repoInfo.defaultBranch}/${cleanPath}`;
  };

  const markdownContent = useMemo(
    () => (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code: ({
            inline,
            className,
            children,
            ...props
          }: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
            inline?: boolean;
          }) => {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <div className="rounded-md overflow-hidden my-4">
                <div className="bg-muted/50 px-4 py-2 text-xs text-muted-foreground border-b">
                  {match[1].toUpperCase()}
                </div>
                <SyntaxHighlighter
                  style={oneDark as SyntaxHighlighterProps["style"]}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    borderRadius: "0 0 6px 6px",
                  }}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code
                className="bg-muted px-1.5 py-0.5 rounded text-sm"
                {...props}
              >
                {children}
              </code>
            );
          },
          h1: ({ node, ...props }) => (
            <h1
              className="text-2xl font-bold mt-8 mb-4 pb-2 border-b"
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className="text-xl font-semibold mt-6 mb-4 pb-2 border-b"
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-lg font-semibold mt-5 mb-3" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="leading-7 [&:not(:first-child)]:mt-4" {...props} />
          ),
          ul: ({ node, children, ...props }) => {
            const items = React.Children.toArray(children);
            return items.length > 20 ? (
              <div className="max-h-[400px] overflow-auto">
                <ul className="my-4 ml-6 list-disc [&>li]:mt-2" {...props}>
                  {children}
                </ul>
              </div>
            ) : (
              <ul className="my-4 ml-6 list-disc [&>li]:mt-2" {...props}>
                {children}
              </ul>
            );
          },
          ol: ({ node, ...props }) => (
            <ol className="my-4 ml-6 list-decimal [&>li]:mt-2" {...props} />
          ),
          li: ({ node, ...props }) => <li className="leading-7" {...props} />,
          a: ({ node, children, ...props }) => {
            const isShield =
              props.href?.includes("shields.io") ||
              props.href?.includes("github-readme-stats") ||
              props.href?.includes("github-profile-trophy");
            return (
              <a
                className={
                  isShield
                    ? "inline-block mx-1"
                    : "text-primary hover:underline"
                }
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              >
                {children}
              </a>
            );
          },
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="mt-4 border-l-4 border-primary/20 pl-4 italic text-muted-foreground"
              {...props}
            />
          ),
          img: ({ node, src, ...props }) => {
            if (!src) return null;

            const imageSrc = getImagePath(src);
            const isShield =
              src.includes("shields.io") ||
              src.includes("github-readme-stats") ||
              src.includes("github-profile-trophy");

            return (
              <span className={isShield ? "inline-block mx-1" : "block my-4"}>
                <img
                  src={imageSrc}
                  className={`${
                    isShield ? "" : "rounded-lg border max-w-full"
                  }`}
                  loading="lazy"
                  onError={(e) => {
                    console.warn("Image failed to load:", imageSrc);
                    e.currentTarget.style.display = "none";
                  }}
                  {...props}
                />
              </span>
            );
          },
          table: ({ node, ...props }) => (
            <div className="my-4 w-full overflow-x-auto">
              <table
                className="min-w-full divide-y divide-border whitespace-nowrap"
                {...props}
              />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th
              className="border bg-muted px-4 py-2 text-left font-semibold"
              {...props}
            />
          ),
          tr: ({ node, ...props }) => (
            <tr className="hover:bg-muted/50 transition-colors" {...props} />
          ),
          td: ({ node, align, ...props }) => (
            <td
              className={`px-4 py-2 text-sm ${
                align === "center" ? "text-center" : ""
              }`}
              {...props}
            />
          ),
          div: ({
            className,
            children,
            ...props
          }: React.ComponentPropsWithoutRef<"div">) => {
            const align = (props as { align?: string }).align;
            return (
              <div
                className={`${className || ""} ${
                  align === "center"
                    ? "text-center flex flex-col items-center"
                    : ""
                }`}
                {...props}
              >
                {children}
              </div>
            );
          },
          hr: ({ node, ...props }) => (
            <hr className="my-8 border-t border-border" {...props} />
          ),
        }}
      >
        {readme || "No README available"}
      </ReactMarkdown>
    ),
    [readme, repoInfo]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 border-b sticky top-0 bg-card z-10">
            <Book className="w-5 h-5" />
            <CardTitle>README.md</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="markdown-body p-6">{markdownContent}</div>
          </CardContent>
        </Card>
      </div>

      {/* Right Sidebar */}
      <div className="space-y-6 lg:sticky lg:top-6 self-start">
        {/* Languages Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Languages Used</CardTitle>
          </CardHeader>
          <CardContent>
            <LanguagesChart data={languages} />
            <div className="mt-4 space-y-2">
              {languages.map((lang) => (
                <div
                  key={lang.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: lang.color }}
                    />
                    <span className="text-sm">{lang.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {lang.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Commits */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <GitCommit className="w-5 h-5" />
            <CardTitle>Recent Commits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lastCommits.slice(0, 5).map((commit, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {commit.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {commit.author} •{" "}
                      {new Date(commit.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Branches List */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <GitBranch className="w-5 h-5" />
            <CardTitle>Branches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {branches.map((branch, index) => (
                <div key={index} className="flex items-center justify-between">
                  <Badge variant="outline">{branch.name}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(branch.lastCommit).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
