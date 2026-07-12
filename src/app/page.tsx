import Link from "next/link";
import { ArrowRight, BarChart3, Receipt, Shield, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-50 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              SmartBiz
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition-all hover:shadow-lg hover:shadow-blue-600/25 active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 sm:pt-40 sm:pb-24 lg:pb-32 px-4 mx-auto max-w-7xl text-center">
        <div className="relative inline-flex mb-8">
          <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-400/20 blur-xl rounded-full" />
          <span className="relative inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-300 text-sm font-medium">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            Next Generation MSME Platform
          </span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8">
          Manage your business <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            smarter and faster.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
          SmartBiz is the all-in-one SaaS platform designed specifically for MSMEs. Handle invoices, track expenses, manage customers, and grow your revenue seamlessly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/register"
            className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-all hover:shadow-xl hover:shadow-blue-600/30 active:scale-95"
          >
            Start for free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-full font-semibold transition-all hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95"
          >
            View Demo
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="mt-24 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Receipt,
              title: "Smart Invoicing",
              description: "Create and send professional invoices in seconds. Get paid faster.",
            },
            {
              icon: BarChart3,
              title: "Financial Reports",
              description: "Real-time insights into your cash flow and revenue metrics.",
            },
            {
              icon: Users,
              title: "CRM Built-in",
              description: "Manage customer relationships and track interaction history easily.",
            },
            {
              icon: Shield,
              title: "Bank-grade Security",
              description: "Your data is encrypted and backed up securely on the cloud.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow text-left group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

