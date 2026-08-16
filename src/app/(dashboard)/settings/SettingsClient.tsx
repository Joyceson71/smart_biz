"use client";

import { useState, useTransition, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, User, Bell, Shield, Palette, Zap, Loader2, Camera, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { updateProfile, updatePassword } from "./actions";
import { toast } from "sonner";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
];

interface SettingsClientProps {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string | null;
}

function Toggle({ checked, onToggle }: { checked: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${checked ? "bg-blue-600" : "bg-slate-600"}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow ${checked ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}

export function SettingsClient({ firstName, lastName, email, avatarUrl }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState("profile");
  const [isPending, startTransition] = useTransition();
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile state
  const [profileForm, setProfileForm] = useState({ first_name: firstName, last_name: lastName });

  // Notification toggles
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    lowStockAlerts: true,
    invoiceReminders: true,
    weeklyReport: false,
  });

  // Security form
  const [securityForm, setSecurityForm] = useState({ new_password: "", confirm_password: "" });

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("first_name", profileForm.first_name);
    formData.append("last_name", profileForm.last_name);
    startTransition(async () => {
      try {
        await updateProfile(formData);
        toast.success("Profile updated successfully!");
      } catch {
        toast.error("Failed to update profile.");
      }
    });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (securityForm.new_password !== securityForm.confirm_password) {
      toast.error("Passwords do not match.");
      return;
    }
    const formData = new FormData();
    formData.append("new_password", securityForm.new_password);
    startTransition(async () => {
      try {
        await updatePassword(formData);
        toast.success("Password updated successfully!");
        setSecurityForm({ new_password: "", confirm_password: "" });
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to update password.");
      }
    });
  };

  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "?";

  return (
    <div className="flex flex-col md:flex-row h-full bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-xl overflow-hidden">
      {/* Mobile: Horizontal pill tabs */}
      <div className="md:hidden flex gap-1 p-3 border-b border-slate-200 dark:border-slate-800 bg-white/30 dark:bg-slate-950/20 overflow-x-auto">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Desktop: Sidebar navigation */}
      <div className="hidden md:block w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white/30 dark:bg-slate-950/20 p-4">
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
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 md:p-8 overflow-auto">
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
                <form onSubmit={handleProfileSave} className="space-y-6">
                  <div className="flex items-center gap-6">
                    {avatarUrl ? (
                      <Image src={avatarUrl} alt="Avatar" width={80} height={80} className="w-20 h-20 rounded-full object-cover shadow-lg" />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        {initials}
                      </div>
                    )}
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={() => toast.info("Avatar upload coming soon.")}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2"
                      >
                        <Camera className="w-4 h-4" />
                        Change Avatar
                      </Button>
                      <p className="text-xs text-slate-400 mt-1">JPG, PNG or GIF up to 2MB</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">First Name</label>
                      <Input
                        name="first_name"
                        value={profileForm.first_name}
                        onChange={e => setProfileForm({ ...profileForm, first_name: e.target.value })}
                        className="bg-white/50 dark:bg-slate-950/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</label>
                      <Input
                        name="last_name"
                        value={profileForm.last_name}
                        onChange={e => setProfileForm({ ...profileForm, last_name: e.target.value })}
                        className="bg-white/50 dark:bg-slate-950/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                    <Input value={email} disabled className="bg-slate-100 dark:bg-slate-900" />
                    <p className="text-xs text-slate-500">Contact support to change your email address.</p>
                  </div>

                  <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700 text-white">
                    {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : "Save Changes"}
                  </Button>
                </form>
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

            {activeTab === "notifications" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Notifications</h2>
                  <p className="text-sm text-slate-500 mt-1">Control which notifications you receive.</p>
                </div>
                <div className="space-y-4">
                  {[
                    { key: "emailAlerts" as const, label: "Email Alerts", description: "Receive important alerts via email." },
                    { key: "lowStockAlerts" as const, label: "Low Stock Alerts", description: "Get notified when products run low." },
                    { key: "invoiceReminders" as const, label: "Invoice Reminders", description: "Reminders for overdue invoices." },
                    { key: "weeklyReport" as const, label: "Weekly Report", description: "A weekly summary of your business." },
                  ].map(({ key, label, description }) => (
                    <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{label}</p>
                        <p className="text-sm text-slate-500">{description}</p>
                      </div>
                      <Toggle
                        checked={notifications[key]}
                        onToggle={() => setNotifications(prev => ({ ...prev, [key]: !prev[key] }))}
                      />
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => toast.success("Notification preferences saved!")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Save Preferences
                </Button>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Security</h2>
                  <p className="text-sm text-slate-500 mt-1">Manage your password and account security.</p>
                </div>
                <form onSubmit={handlePasswordChange} className="space-y-5 p-6 rounded-2xl bg-white/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/50">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Change Password</h3>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">New Password</label>
                    <div className="relative">
                      <Input
                        required
                        type={showNewPw ? "text" : "password"}
                        placeholder="Min. 8 characters"
                        className="bg-white/50 dark:bg-slate-950/50 pr-10"
                        value={securityForm.new_password}
                        onChange={e => setSecurityForm({ ...securityForm, new_password: e.target.value })}
                      />
                      <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" onClick={() => setShowNewPw(!showNewPw)}>
                        {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Confirm New Password</label>
                    <div className="relative">
                      <Input
                        required
                        type={showCurrentPw ? "text" : "password"}
                        placeholder="Repeat new password"
                        className="bg-white/50 dark:bg-slate-950/50 pr-10"
                        value={securityForm.confirm_password}
                        onChange={e => setSecurityForm({ ...securityForm, confirm_password: e.target.value })}
                      />
                      <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" onClick={() => setShowCurrentPw(!showCurrentPw)}>
                        {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700 text-white">
                    {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Updating...</> : "Update Password"}
                  </Button>
                </form>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
