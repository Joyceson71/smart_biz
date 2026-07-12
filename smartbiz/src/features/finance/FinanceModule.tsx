"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, DollarSign, Wallet, TrendingUp } from "lucide-react";

export default function FinanceModule() {
  return (
    <div className="flex flex-col h-full bg-[#040406] p-6 gap-6 overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white tracking-tight">Financial Overview</h2>
        <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
          <option>Last 30 Days</option>
          <option>This Quarter</option>
          <option>This Year</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign size={80} />
          </div>
          <div className="flex items-center gap-3 mb-4 text-white/60">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <DollarSign className="text-emerald-400" size={20} />
            </div>
            <span className="font-medium uppercase text-xs tracking-wider">Total Revenue</span>
          </div>
          <div className="text-4xl font-bold text-white mb-2">$124,500</div>
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
            <ArrowUpRight size={16} />
            <span>+12.5% from last month</span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet size={80} />
          </div>
          <div className="flex items-center gap-3 mb-4 text-white/60">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <ArrowDownRight className="text-red-400" size={20} />
            </div>
            <span className="font-medium uppercase text-xs tracking-wider">Total Expenses</span>
          </div>
          <div className="text-4xl font-bold text-white mb-2">$42,100</div>
          <div className="flex items-center gap-2 text-red-400 text-sm font-medium">
            <ArrowUpRight size={16} />
            <span>+4.2% from last month</span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp size={80} />
          </div>
          <div className="flex items-center gap-3 mb-4 text-white/60">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <TrendingUp className="text-blue-400" size={20} />
            </div>
            <span className="font-medium uppercase text-xs tracking-wider">Net Profit</span>
          </div>
          <div className="text-4xl font-bold text-white mb-2">$82,400</div>
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
            <ArrowUpRight size={16} />
            <span>+18.1% from last month</span>
          </div>
        </div>
      </div>

      {/* Placeholder for complex 3D or Chart Viz */}
      <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col min-h-[300px]">
        <h3 className="font-medium text-white/80 mb-6">Cash Flow Projection</h3>
        <div className="flex-1 border border-white/5 border-dashed rounded-xl flex items-center justify-center relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-t from-[#00E5FF]/10 to-transparent opacity-50" />
           <div className="text-center z-10">
             <div className="text-white/40 mb-2 font-medium">Interactive Cash Flow Simulation</div>
             <div className="text-xs text-white/30">Connect real data to simulate future projections</div>
           </div>
        </div>
      </div>
    </div>
  );
}
