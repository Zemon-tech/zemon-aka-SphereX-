"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Package } from "lucide-react";

interface Dependency {
  name: string;
  version: string;
  latest: string;
  type: "production" | "development";
  hasVulnerabilities: boolean;
  isOutdated: boolean;
}

interface DependenciesTabProps {
  dependencies: Dependency[];
}

export default function DependenciesTab({ dependencies }: DependenciesTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dependencies</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dependencies.map((dep, index) => (
            <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50">
              <Package className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{dep.name}</p>
                  <Badge variant={dep.type === "production" ? "default" : "secondary"}>
                    {dep.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  v{dep.version} {dep.isOutdated && `(Latest: v${dep.latest})`}
                </p>
              </div>
              {dep.hasVulnerabilities && (
                <AlertTriangle className="w-5 h-5 text-destructive" />
              )}
              {!dep.hasVulnerabilities && !dep.isOutdated && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 