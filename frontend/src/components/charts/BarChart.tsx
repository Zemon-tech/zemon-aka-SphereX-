"use client";

import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface BarChartProps {
  data: any[];
  categories: string[];
}

export function BarChart({ data, categories }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip />
        {categories.map((category, index) => (
          <Bar
            key={category}
            dataKey={category}
            fill={index === 0 ? "#2563eb" : "#16a34a"}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
} 