"use client";

import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { formatINR } from "@/lib/utils/currency";

// Next 30 days simulated cash flow
const generateData = () => {
  const data = [];
  let balance = 485000;
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const cashIn = i === 3 ? 147500 : i === 7 ? 103840 : i === 12 ? 295000 : i === 18 ? 230100 : i === 25 ? 84960 : 0;
    const cashOut = i === 5 ? 40120 : i === 10 ? 14160 : i === 20 ? 33040 : i === 28 ? 17700 : 0;
    balance += cashIn - cashOut;
    data.push({
      date: date.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      cashIn,
      cashOut: -cashOut,
      balance,
    });
  }
  return data;
};

const data = generateData();

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg text-sm min-w-[160px]">
        <p className="font-semibold mb-2">{label}</p>
        {payload.map((entry: any) => (
          entry.value !== 0 && (
            <div key={entry.dataKey} className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground capitalize">{entry.dataKey === "cashIn" ? "In" : entry.dataKey === "cashOut" ? "Out" : "Balance"}:</span>
              <span className={`font-medium ${entry.dataKey === "cashIn" ? "text-green-500" : entry.dataKey === "cashOut" ? "text-red-500" : "text-foreground"}`}>
                {formatINR(Math.abs(entry.value))}
              </span>
            </div>
          )
        ))}
      </div>
    );
  }
  return null;
};

export function CashFlowChart() {
  // Show only days that have activity
  const activeData = data.filter(d => d.cashIn !== 0 || d.cashOut !== 0 || data.indexOf(d) === 0 || data.indexOf(d) === data.length - 1);

  return (
    <div className="space-y-3">
      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <p className="text-xs text-green-600 dark:text-green-400 font-medium">Expected In</p>
          <p className="text-lg font-bold text-green-700 dark:text-green-300">
            {formatINR(data.reduce((s, d) => s + d.cashIn, 0))}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-xs text-red-600 dark:text-red-400 font-medium">Expected Out</p>
          <p className="text-lg font-bold text-red-700 dark:text-red-300">
            {formatINR(Math.abs(data.reduce((s, d) => s + d.cashOut, 0)))}
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <ComposedChart data={activeData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
          <YAxis tickFormatter={(v) => formatINR(Math.abs(v), { compact: true })} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={50} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="cashIn" radius={[4, 4, 0, 0]}>
            {activeData.map((_, i) => <Cell key={i} fill="#22c55e" fillOpacity={0.8} />)}
          </Bar>
          <Bar dataKey="cashOut" radius={[4, 4, 0, 0]}>
            {activeData.map((_, i) => <Cell key={i} fill="#ef4444" fillOpacity={0.8} />)}
          </Bar>
          <Line type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={2} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
