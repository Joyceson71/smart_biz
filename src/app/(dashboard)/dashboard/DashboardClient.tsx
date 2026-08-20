"use client";

import { motion, Variants } from "framer-motion";
import { Activity, DollarSign, Users, CreditCard, TrendingUp, BarChart3, Clock, Zap } from "lucide-react";
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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="w-full flex flex-col gap-6 pb-12 text-slate-200">
      
      {/* Header section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 px-2 flex justify-between items-end"
      >
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-[0_2px_10px_rgba(56,189,248,0.2)]">
            Command Center
          </h1>
          <p className="text-slate-400 font-bold mt-1 tracking-wide uppercase text-sm">
            System status: Optimal
          </p>
        </div>
        
        <Link href="/invoices/new" className="hidden sm:flex items-center gap-2 px-6 py-3 clay-btn-primary whitespace-nowrap">
          <Zap className="w-4 h-4" />
          Initialize Invoice
        </Link>
      </motion.div>

      {/* Main KPI Bento Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]"
      >
        {/* HERO REVENUE BENTO */}
        <motion.div variants={itemVariants} className="md:col-span-2 md:row-span-2 clay-card p-8 flex flex-col justify-between relative overflow-hidden group cursor-pointer">
          {/* Volumetric Neon Glow */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500/30 blur-[80px] rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-700" />
          
          <div className="flex items-start justify-between relative z-10">
            <div className="w-16 h-16 neo-flat rounded-3xl flex items-center justify-center text-blue-400 shadow-[inset_0_0_20px_rgba(59,130,246,0.2)]">
              <DollarSign className="w-8 h-8" />
            </div>
            <div className="flex items-center gap-1 text-sm font-black px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-400 shadow-[inset_0_0_10px_rgba(16,185,129,0.2)]">
              <TrendingUp className="w-4 h-4" />
              +12.5%
            </div>
          </div>
          
          <div className="relative z-10 mt-8">
            <h3 className="text-blue-300 text-sm font-black uppercase tracking-widest mb-2 drop-shadow-md">
              Gross Revenue
            </h3>
            <p className="text-6xl font-black text-white tracking-tighter drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              {formattedRevenue}
            </p>
          </div>
        </motion.div>

        {/* CUSTOMERS BENTO */}
        <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1 clay-card p-6 flex flex-col justify-between relative overflow-hidden group cursor-pointer">
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-purple-500/20 blur-[60px] rounded-full pointer-events-none group-hover:bg-purple-500/30 transition-colors" />
          
          <div className="flex items-start justify-between relative z-10">
             <h3 className="text-purple-300 text-xs font-black uppercase tracking-widest mb-2 drop-shadow-md">
              Active Network
            </h3>
            <div className="w-10 h-10 neo-flat rounded-xl flex items-center justify-center text-purple-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-4xl font-black text-white tracking-tighter">
              {customerCount.toLocaleString()}
            </p>
          </div>
        </motion.div>

        {/* INVOICES BENTO */}
        <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1 clay-card p-6 flex flex-col justify-between relative overflow-hidden group cursor-pointer">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-500/20 blur-[60px] rounded-full pointer-events-none group-hover:bg-amber-500/30 transition-colors" />
          
          <div className="flex items-start justify-between relative z-10">
             <h3 className="text-amber-300 text-xs font-black uppercase tracking-widest mb-2 drop-shadow-md">
              Pending Capital
            </h3>
            <div className="w-10 h-10 neo-flat rounded-xl flex items-center justify-center text-amber-400">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-4xl font-black text-white tracking-tighter">
              {pendingCount.toString()}
            </p>
          </div>
        </motion.div>

        {/* SYSTEM HEALTH BENTO (Wide) */}
        <motion.div variants={itemVariants} className="md:col-span-2 md:row-span-1 clay-card p-6 flex items-center justify-between relative overflow-hidden group cursor-pointer">
           <div className="flex items-center gap-6 relative z-10 w-full">
              <div className="w-16 h-16 shrink-0 neo-flat rounded-full flex items-center justify-center text-emerald-400">
                <Activity className="w-8 h-8 animate-pulse" />
              </div>
              <div className="flex-1">
                <h3 className="text-emerald-300 text-sm font-black uppercase tracking-widest mb-1 drop-shadow-md">
                  Core Systems
                </h3>
                <div className="w-full h-3 neo-pressed rounded-full overflow-hidden mt-3">
                  <div className="h-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)] w-[99%]" />
                </div>
              </div>
              <p className="text-3xl font-black text-white tracking-tighter ml-4">
                99.9%
              </p>
           </div>
        </motion.div>

        {/* CHART AREA BENTO */}
        <motion.div variants={itemVariants} className="md:col-span-3 md:row-span-2 clay-card p-8 flex flex-col relative overflow-hidden min-h-[350px]">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(56,189,248,0.03)_50%,transparent_75%,transparent_100%)] bg-[length:250px_250px] animate-[gradient_3s_linear_infinite]" />
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <h3 className="text-2xl font-black text-white flex items-center gap-3 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              <BarChart3 className="w-6 h-6 text-cyan-400" />
              Velocity Forecast
            </h3>
            <div className="neo-pressed px-6 py-2 rounded-full text-xs font-black text-cyan-400 uppercase tracking-widest border border-cyan-500/20">
              Q3 Projection
            </div>
          </div>
          
          <div className="flex-1 neo-pressed rounded-3xl flex flex-col items-center justify-center border border-white/5 relative z-10">
            <div className="flex items-end gap-3 h-32 w-full max-w-lg px-8">
              {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                <div key={i} className="flex-1 neo-flat rounded-t-lg bg-cyan-500/20 border-t border-cyan-400/50 transition-all hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.6)]" style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>
        </motion.div>

        {/* RECENT ACTIVITY BENTO */}
        <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-2 clay-card p-6 flex flex-col relative overflow-hidden min-h-[350px]">
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h3 className="text-lg font-black text-white flex items-center gap-2 drop-shadow-md">
              <Clock className="w-5 h-5 text-indigo-400" />
              Event Stream
            </h3>
          </div>
          
          <div className="flex flex-col gap-4 flex-1 relative z-10 overflow-y-auto pr-2">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-2xl neo-pressed border border-white/5 group hover:border-indigo-500/30 transition-colors cursor-pointer">
                <div className="w-8 h-8 shrink-0 neo-flat rounded-full flex items-center justify-center text-indigo-400">
                  <Zap className="w-3 h-3 group-hover:text-cyan-400 transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-slate-200 truncate group-hover:text-white">Neural sync</p>
                  <p className="text-[10px] text-slate-500 truncate uppercase font-bold tracking-wider">T-{i + 1}h</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
