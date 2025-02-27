"use client";

import { Line, LineChart as RechartsLineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface LineChartProps {
  data: any[];
  categories: string[];
}

export function LineChart({ data, categories }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={data}>
        <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip />
        {categories.map((category, index) => (
          <Line
            key={category}
            type="monotone"
            dataKey={category}
            stroke={index === 0 ? "#2563eb" : "#16a34a"}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
} 