"use client";

import { motion } from "framer-motion";
import { Activity, DollarSign, Users, CreditCard, ArrowRight, TrendingUp, TrendingDown, BarChart3, Clock } from "lucide-react";
import Link from "next/link";

interface DashboardClientProps {
  totalRevenue: number;
  customerCount: number;
  pendingCount: number;
}

export function DashboardClient({ totalRevenue, customerCount, pendingCount }: DashboardClientProps) {
  const formattedRevenue = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(totalRevenue);

  const STATS = [
    { 
      label: "Total Revenue", 
      value: formattedRevenue, 
      icon: DollarSign, 
      color: "text-emerald-400",
      trend: "+12.5%",
      trendUp: true
    },
    { 
      label: "Active Customers", 
      value: customerCount.toLocaleString(), 
      icon: Users, 
      color: "text-blue-400",
      trend: "+4.2%",
      trendUp: true
    },
    { 
      label: "Pending Invoices", 
      value: pendingCount.toString(), 
      icon: CreditCard, 
      color: "text-amber-400",
      trend: "-2.1%",
      trendUp: false
    },
    { 
      label: "System Health", 
      value: "99.9%", 
      icon: Activity, 
      color: "text-purple-400",
      trend: "Nominal",
      trendUp: true
    }
  ];

  return (
    <div className="w-full flex flex-col gap-6 pb-12 text-slate-200">
      
      {/* Header section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 px-2 flex justify-between items-end"
      >
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Overview
          </h1>
          <p className="text-slate-400 font-medium mt-1">
            Welcome back. Here&apos;s what&apos;s happening with your business today.
          </p>
        </div>
        
        <Link href="/invoices/new" className="hidden sm:flex items-center gap-2 px-6 py-2.5 clay-btn-primary whitespace-nowrap">
          Create Invoice
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>

      {/* Main KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
            whileHover={{ y: -5 }}
            className="clay-card p-6 flex flex-col relative overflow-hidden group cursor-pointer"
          >
            <div className="flex items-start justify-between mb-8">
              <div className={`w-12 h-12 neo-flat rounded-2xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${stat.trendUp ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                {stat.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            
            <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">
              {stat.label}
            </h3>
            <p className="text-3xl font-black text-white tracking-tight">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Secondary Bento Grid Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
        {/* Chart Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 clay-card p-8 flex flex-col min-h-[400px]"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              Revenue Forecast
            </h3>
            <div className="neo-pressed px-4 py-1.5 rounded-full text-xs font-bold text-slate-400">
              This Month
            </div>
          </div>
          
          <div className="flex-1 neo-pressed rounded-2xl flex items-center justify-center border border-white/5">
             <p className="text-slate-500 font-medium">Chart visualization loading...</p>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-1 clay-card p-8 flex flex-col min-h-[400px]"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              Recent Activity
            </h3>
          </div>
          
          <div className="flex flex-col gap-4 flex-1">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer">
                <div className="w-10 h-10 shrink-0 neo-flat rounded-full flex items-center justify-center text-slate-400">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-200 truncate">System updated</p>
                  <p className="text-xs text-slate-400 truncate">Automated sync completed successfully</p>
                </div>
                <div className="text-xs font-bold text-slate-500">
                  {i + 1}h ago
                </div>
              </div>
            ))}
          </div>
          
          <button className="mt-4 py-3 neo-flat rounded-xl text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors">
            View All Activity
          </button>
        </motion.div>
      </div>

    </div>
  );
}
