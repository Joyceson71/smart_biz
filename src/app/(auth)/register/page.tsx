'use client'

import Link from "next/link";
import { signup } from "../actions";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    setIsPending(true);
    try {
      const result = await signup(formData);
      if (result?.error) {
        setError(result.error);
        setIsPending(false);
      }
    } catch (e) {
      throw e;
    }
  };

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-2 text-center"
      >
        <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-md">
          Create Access
        </h1>
        <p className="text-sm text-slate-400 font-medium">
          Initialize your command center account
        </p>
      </motion.div>

      <form action={handleSubmit} className="space-y-5">
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 text-sm font-semibold text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center shadow-inner"
          >
            {error}
          </motion.div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-2"
          >
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                id="first-name" 
                name="first-name" 
                placeholder="First Name" 
                required 
                className="w-full neo-pressed rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all border-none bg-transparent"
              />
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                id="last-name" 
                name="last-name" 
                placeholder="Last Name" 
                required 
                className="w-full neo-pressed rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all border-none bg-transparent"
              />
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-2"
        >
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              id="email" 
              name="email" 
              placeholder="Email address" 
              required 
              type="email" 
              className="w-full neo-pressed rounded-xl pl-12 pr-4 py-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all border-none bg-transparent"
            />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-2"
        >
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              id="password" 
              name="password" 
              placeholder="Create Password" 
              required 
              type="password" 
              className="w-full neo-pressed rounded-xl pl-12 pr-4 py-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all border-none bg-transparent"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button 
            disabled={isPending} 
            className="group w-full clay-btn-primary py-4 transition-all disabled:opacity-50 flex items-center justify-center gap-2" 
            type="submit"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                Registering...
              </span>
            ) : (
              <>
                Create Account
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </motion.div>
      </form>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-sm text-slate-400 font-medium"
      >
        Already authorized?{" "}
        <Link href="/login" className="font-bold text-blue-400 hover:text-blue-300 transition-colors">
          Sign in
        </Link>
      </motion.div>
    </div>
  );
}
