"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContributionGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Sample data - replace with actual GitHub contribution data
    const contributions = Array.from({ length: 365 }, () => 
      Math.floor(Math.random() * 5)
    );

    const cellSize = 10;
    const cellPadding = 2;
    // const weeksInYear = 52;
    const daysInWeek = 7;

    // Draw contribution cells
    contributions.forEach((count, index) => {
      const week = Math.floor(index / daysInWeek);
      const day = index % daysInWeek;
      
      const x = week * (cellSize + cellPadding);
      const y = day * (cellSize + cellPadding);

      // Get color based on contribution count
      let color;
      if (count === 0) color = '#ebedf0';
      else if (count === 1) color = '#9be9a8';
      else if (count === 2) color = '#40c463';
      else if (count === 3) color = '#30a14e';
      else color = '#216e39';

      ctx.fillStyle = color;
      ctx.fillRect(x, y, cellSize, cellSize);
    });
  }, []);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Contribution Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <canvas
            ref={canvasRef}
            style={{
              width: '100%',
              height: '160px',
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
} 