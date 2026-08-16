"use client";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

interface Props {
  expenses: { category: string; amount: number }[];
}

export function ExpenseCategoryChart({ expenses }: Props) {
  const grouped = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + e.amount;
    return acc;
  }, {});

  const data = Object.entries(grouped).map(([name, value]) => ({ name, value }));

  return (
    <div className="bg-slate-900/60 backdrop-blur border border-white/10 rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-slate-300 mb-4">Spending by Category</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
            paddingAngle={3} dataKey="value">
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }}
            formatter={(v) => [`$${Number(v).toLocaleString()}`, ""]}
          />
          <Legend iconType="circle" iconSize={8}
            formatter={v => <span className="text-xs text-slate-400">{v}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
