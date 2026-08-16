"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Activity, FileText, Wallet, Users, Package } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatDistanceToNow } from "date-fns";

interface ActivityLog {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export function ActivityFeedPanel({ open, onClose }: { open: boolean, onClose: () => void }) {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const supabase = createClient();

  useEffect(() => {
    if (!open) return;

    async function fetchLogs() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("activity_log")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(30);

      if (data) setLogs(data);
    }

    fetchLogs();

    const channel = supabase.channel("activity_feed")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "activity_log" }, (payload) => {
        setLogs(prev => [payload.new as ActivityLog, ...prev].slice(0, 30));
      })
      .subscribe();

    return () => { channel.unsubscribe(); };
  }, [open, supabase]);

  const getIcon = (type: string) => {
    switch(type) {
      case "invoice": return <FileText className="w-4 h-4 text-indigo-400" />;
      case "expense": return <Wallet className="w-4 h-4 text-emerald-400" />;
      case "customer": return <Users className="w-4 h-4 text-blue-400" />;
      case "product": return <Package className="w-4 h-4 text-amber-400" />;
      default: return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  const getMessage = (log: ActivityLog) => {
    const actionMap: Record<string, string> = {
      "invoice.created": "Created invoice",
      "expense.created": "Logged expense",
      "expense.deleted": "Deleted expense",
      "customer.created": "Added customer",
      "vendor.created": "Added vendor",
      "product.created": "Added product",
    };
    const actionText = actionMap[log.action] || log.action;
    let detail = "";
    if (log.metadata?.amount) detail = ` for $${log.metadata.amount}`;
    if (log.metadata?.name) detail = `: ${log.metadata.name}`;
    
    return (
      <span>
        <span className="font-medium text-slate-200">{actionText}</span>
        <span className="text-slate-400">{detail}</span>
      </span>
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-slate-950/20 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-80 bg-slate-900/90 backdrop-blur-2xl border-l border-white/10 z-[200] shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                Activity Feed
              </h2>
              <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {logs.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-8">No recent activity.</p>
              ) : (
                logs.map(log => (
                  <div key={log.id} className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-white/5">
                      {getIcon(log.entity_type)}
                    </div>
                    <div>
                      <p className="text-sm">{getMessage(log)}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
