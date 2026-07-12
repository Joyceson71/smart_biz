"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import { Bot, Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login and morph into OS
    router.push(ROUTES.DASHBOARD); // This will map to the new OS route later
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-[#040406] overflow-hidden selection:bg-brand-500/30">
      
      {/* Animated Particles Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#00E5FF]/10 via-transparent to-[#B026FF]/10 mix-blend-screen" />
        {/* Procedural grid or noise would go here, simulating with CSS for now */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="os-panel p-8 backdrop-blur-2xl"
        >
          {/* AI Greeting */}
          <div className="flex flex-col items-center text-center mb-10">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#00E5FF]/20 to-[#B026FF]/20 flex items-center justify-center mb-6 ai-glow border border-white/10"
            >
              <Bot size={32} className="text-[#00E5FF]" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back.</h1>
            <p className="text-white/50 text-sm">
              JARVIS is online. Enter your credentials to access the workspace.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-medium text-white/60 ml-1 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <input 
                  type="email" 
                  defaultValue="admin@smartbiz.ai"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#00E5FF]/50 focus:ring-1 focus:ring-[#00E5FF]/50 transition-all placeholder:text-white/20"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-medium text-white/60 uppercase tracking-wider">Password</label>
                <Link href="#" className="text-xs text-[#00E5FF] hover:text-[#00E5FF]/80 transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <input 
                  type="password" 
                  defaultValue="password123"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#B026FF]/50 focus:ring-1 focus:ring-[#B026FF]/50 transition-all placeholder:text-white/20"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 bg-gradient-to-r from-[#00E5FF] to-[#00B8D4] text-black font-semibold rounded-xl flex items-center justify-center gap-2 mt-4 hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-shadow"
            >
              Initialize Workspace <ArrowRight size={18} />
            </motion.button>
          </form>

        </motion.div>
        
        <p className="text-center mt-8 text-white/40 text-sm">
          Don't have access? <Link href={ROUTES.REGISTER} className="text-white/80 hover:text-white transition-colors">Request invite</Link>
        </p>
      </div>
    </main>
  );
}
