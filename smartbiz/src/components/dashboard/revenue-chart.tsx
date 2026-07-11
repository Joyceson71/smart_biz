"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { formatINR } from "@/lib/utils/currency";

const data = [
  { month: "Feb", revenue: 1245000, expenses: 876000 },
  { month: "Mar", revenue: 1520000, expenses: 1022000 },
  { month: "Apr", revenue: 1384000, expenses: 945000 },
  { month: "May", revenue: 1698000, expenses: 1134000 },
  { month: "Jun", revenue: 1756000, expenses: 1098000 },
  { month: "Jul", revenue: 1842500, expenses: 1227200 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg text-sm">
        <p className="font-semibold mb-2">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.dataKey} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: entry.color }} />
            <span className="text-muted-foreground capitalize">{entry.dataKey}:</span>
            <span className="font-medium">{formatINR(entry.value)}</span>
          </div>
        ))}
        <div className="mt-2 pt-2 border-t border-border">
          <span className="text-muted-foreground">Profit: </span>
          <span className={`font-semibold ${payload[0]?.value - payload[1]?.value > 0 ? "text-green-500" : "text-red-500"}`}>
            {formatINR(payload[0]?.value - payload[1]?.value)}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) => formatINR(v, { compact: true })}
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
          width={60}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }}
          formatter={(value) => <span style={{ color: "hsl(var(--foreground))" }}>{value}</span>}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#3b82f6"
          strokeWidth={2.5}
          fill="url(#colorRevenue)"
          dot={false}
          activeDot={{ r: 5, fill: "#3b82f6" }}
        />
        <Area
          type="monotone"
          dataKey="expenses"
          stroke="#ef4444"
          strokeWidth={2.5}
          fill="url(#colorExpenses)"
          dot={false}
          activeDot={{ r: 5, fill: "#ef4444" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
