"use client";

import { Bell, Package, AlertTriangle, UserPlus, CheckCircle, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export type NotificationType = {
  id: string;
  type: "low_stock" | "overdue_invoice" | "new_customer";
  title: string;
  message: string;
  date: string;
  read: boolean;
};

interface NotificationsClientProps {
  notifications: NotificationType[];
}

export function NotificationsClient({ notifications: initialNotifications }: NotificationsClientProps) {
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getIcon = (type: NotificationType["type"]) => {
    switch (type) {
      case "low_stock": return <Package className="w-5 h-5 text-amber-400" />;
      case "overdue_invoice": return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case "new_customer": return <UserPlus className="w-5 h-5 text-emerald-400" />;
      default: return <Bell className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white overflow-y-auto">
      <div className="sticky top-0 z-10 bg-slate-900/60 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50 tracking-tight flex items-center gap-3">
            <Bell className="w-6 h-6 text-white/80" /> Notifications
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            You have {unreadCount} unread alert{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-white/10 text-slate-300 gap-2 hover:bg-white/10" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <CheckCircle className="w-4 h-4" /> Mark all read
          </Button>
          <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-950/30 gap-2" onClick={clearAll} disabled={notifications.length === 0}>
            Clear all
          </Button>
        </div>
      </div>

      <div className="p-4 md:p-8 max-w-4xl mx-auto w-full">
        <div className="space-y-4">
          <AnimatePresence>
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-4 md:p-6 rounded-2xl border backdrop-blur-xl flex flex-col md:flex-row gap-4 md:items-start justify-between transition-colors ${
                  notification.read ? 'bg-slate-900/20 border-white/5' : 'bg-slate-900/60 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                }`}
              >
                <div className="flex gap-4 items-start">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notification.read ? 'bg-slate-800' : 'bg-blue-500/10'}`}>
                    {getIcon(notification.type)}
                  </div>
                  <div>
                    <h3 className={`text-base md:text-lg font-semibold ${notification.read ? 'text-slate-300' : 'text-white'}`}>
                      {notification.title}
                    </h3>
                    <p className={`text-sm mt-1 ${notification.read ? 'text-slate-500' : 'text-slate-400'}`}>
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(notification.date).toLocaleString()}
                    </div>
                  </div>
                </div>
                
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 shrink-0 self-start md:self-auto"
                    onClick={() => markAsRead(notification.id)}
                  >
                    Mark as read
                  </Button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {notifications.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-slate-900/20 border border-dashed border-white/10 rounded-3xl">
              <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-slate-600" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">All caught up!</h3>
              <p className="text-slate-500">You don&apos;t have any new notifications.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
