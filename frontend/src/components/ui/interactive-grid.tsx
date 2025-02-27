"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function InteractiveGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mousePosition.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      requestAnimationFrame(() => {
        const cells = container.getElementsByClassName("grid-cell");
        Array.from(cells).forEach((cell: Element) => {
          const cellRect = cell.getBoundingClientRect();
          const cellCenter = {
            x: cellRect.left + cellRect.width / 2,
            y: cellRect.top + cellRect.height / 2,
          };

          const distance = Math.sqrt(
            Math.pow(mousePosition.current.x - cellCenter.x, 2) +
            Math.pow(mousePosition.current.y - cellCenter.y, 2)
          );

          const maxDistance = 200; // Increased range
          const opacity = Math.max(0, 1 - distance / maxDistance);
          (cell as HTMLElement).style.opacity = (opacity * 0.5).toString(); // Reduced maximum opacity
        });
      });
    };

    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden -z-10"
    >
      <div 
        className="absolute inset-0 grid grid-cols-[repeat(auto-fill,minmax(30px,1fr))] grid-rows-[repeat(auto-fill,minmax(30px,1fr))]"
        style={{ 
          transform: 'rotate(45deg) scale(1.5)',
          transformOrigin: 'center'
        }}
      >
        {Array.from({ length: 800 }).map((_, i) => (
          <div
            key={i}
            className="grid-cell w-full h-full border border-primary/5 opacity-0 transition-opacity duration-300"
            style={{
              backgroundColor: 'rgba(var(--primary) / 0.05)'
            }}
          />
        ))}
      </div>
    </div>
  );
} 