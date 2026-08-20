"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Activity, Globe, Zap, Shield, Download } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] text-slate-300 overflow-x-hidden selection:bg-blue-500/30 font-sans">
      
      {/* Navigation */}
      <nav className="flex items-center justify-between px-4 sm:px-8 py-6 max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 clay-card flex items-center justify-center">
            <span className="text-blue-500 font-bold text-2xl">S</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-200">SmartBiz</span>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-6 py-2.5 clay-btn text-sm sm:text-base whitespace-nowrap hidden sm:block">
            Log in
          </Link>
          <Link href="/register" className="px-6 py-2.5 clay-btn-primary text-sm sm:text-base whitespace-nowrap">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Main Bento Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)]">
          
          {/* Hero Bento Box (Spans 8 cols) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="md:col-span-8 md:row-span-2 clay-card p-8 sm:p-12 flex flex-col justify-center relative overflow-hidden group"
          >
            {/* Decorative background element */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-400/20 transition-all duration-700"></div>
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full neo-flat text-blue-500 text-sm font-semibold mb-8 w-max">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              The Business OS
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-white leading-[1.1]">
              One Platform.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Infinite Scale.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-xl font-medium leading-relaxed">
              Not a dashboard. Not a CRM. An intelligent operating system that manages, analyzes, and grows your enterprise using autonomous AI.
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <Link 
                href="/register" 
                className="group/btn inline-flex items-center gap-2 px-8 py-4 clay-btn-primary text-lg w-max"
              >
                Enter the Workspace
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
              <a 
                href="#" 
                className="group/btn inline-flex items-center gap-2 px-8 py-4 neo-flat text-slate-300 hover:text-white text-lg w-max rounded-2xl font-bold"
              >
                <Download className="w-5 h-5" />
                Download App
              </a>
            </div>
          </motion.div>

          {/* Metric Box 1 */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="md:col-span-4 clay-card p-8 flex flex-col justify-between group hover:scale-[1.02]"
          >
            <div className="w-12 h-12 neo-flat rounded-2xl flex items-center justify-center text-blue-400 mb-6">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Predictive Analytics</h3>
              <p className="text-slate-400 font-medium">Forecast revenue drops before they happen with neural networks.</p>
            </div>
          </motion.div>

          {/* Metric Box 2 */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="md:col-span-4 clay-card p-8 flex flex-col justify-between group hover:scale-[1.02]"
          >
             <div className="w-12 h-12 neo-flat rounded-2xl flex items-center justify-center text-cyan-400 mb-6">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Global Intelligence</h3>
              <p className="text-slate-400 font-medium">Real-time synchronization across your entire supply chain.</p>
            </div>
          </motion.div>

          {/* Feature Box 1 */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.95, y: 20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
             className="md:col-span-6 clay-card p-8 flex items-center gap-6 group hover:scale-[1.02]"
          >
            <div className="w-16 h-16 shrink-0 neo-flat rounded-2xl flex items-center justify-center text-indigo-400">
              <Zap className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Neural Automation</h3>
              <p className="text-slate-400 font-medium">Automate invoice chasing and expense tracking without human intervention.</p>
            </div>
          </motion.div>

          {/* Feature Box 2 */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.95, y: 20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
             className="md:col-span-6 clay-card p-8 flex items-center gap-6 group hover:scale-[1.02]"
          >
            <div className="w-16 h-16 shrink-0 neo-flat rounded-2xl flex items-center justify-center text-emerald-400">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Enterprise Security</h3>
              <p className="text-slate-400 font-medium">Bank-grade encryption and automated compliance reporting built-in.</p>
            </div>
          </motion.div>

        </div>
      </main>
      
      {/* Footer minimal */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-8 py-12 text-center text-slate-500 font-medium">
        <p>© {new Date().getFullYear()} SmartBiz. The Neomorphic Operating System.</p>
      </footer>
    </div>
  );
}
