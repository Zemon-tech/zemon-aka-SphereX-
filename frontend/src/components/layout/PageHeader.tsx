"use client";

interface PageHeaderProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight mb-3">{title}</h1>
        <p className="text-lg text-muted-foreground">{description}</p>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
} 