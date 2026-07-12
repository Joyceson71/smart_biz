'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, User, Bell, Shield, Palette, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="flex h-full bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-xl">
      {/* Sidebar navigation */}
      <div className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white/30 dark:bg-slate-950/20 p-4">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
            <Settings className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Settings</h1>
        </div>

        <nav className="space-y-1">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-700" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white border border-transparent"
                }`}
              >
                <tab.icon className={`w-4 h-4 ${isActive ? "text-blue-600 dark:text-blue-400" : ""}`} />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="max-w-2xl"
          >
            {activeTab === "profile" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Profile</h2>
                  <p className="text-sm text-slate-500 mt-1">Manage your public information and personal details.</p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      JD
                    </div>
                    <Button variant="outline">Change Avatar</Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">First Name</label>
                      <Input defaultValue="John" className="bg-white/50 dark:bg-slate-950/50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</label>
                      <Input defaultValue="Doe" className="bg-white/50 dark:bg-slate-950/50" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                    <Input defaultValue="john@smartbiz.app" disabled className="bg-slate-100 dark:bg-slate-900" />
                    <p className="text-xs text-slate-500">Contact support to change your email address.</p>
                  </div>

                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">Save Changes</Button>
                </div>
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Appearance</h2>
                  <p className="text-sm text-slate-500 mt-1">Customize how SmartBiz OS looks on your device.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="border-2 border-blue-500 rounded-xl p-4 bg-slate-950 cursor-pointer relative overflow-hidden">
                    <div className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <Zap className="w-2.5 h-2.5 text-white" />
                    </div>
                    <div className="h-24 rounded-lg bg-slate-900 border border-slate-800 mb-3 flex flex-col gap-2 p-2">
                      <div className="h-2 w-12 bg-slate-800 rounded-full" />
                      <div className="h-8 bg-slate-800/50 rounded flex items-center px-2">
                        <div className="h-1.5 w-16 bg-slate-700 rounded-full" />
                      </div>
                    </div>
                    <span className="font-medium text-white">Dark Mode</span>
                  </div>
                  
                  <div className="border border-slate-200 rounded-xl p-4 bg-white cursor-pointer hover:border-blue-300 transition-colors opacity-50">
                    <div className="h-24 rounded-lg bg-slate-50 border border-slate-100 mb-3 flex flex-col gap-2 p-2">
                      <div className="h-2 w-12 bg-slate-200 rounded-full" />
                      <div className="h-8 bg-white border border-slate-200 rounded flex items-center px-2 shadow-sm">
                        <div className="h-1.5 w-16 bg-slate-200 rounded-full" />
                      </div>
                    </div>
                    <span className="font-medium text-slate-900">Light Mode (Coming Soon)</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
