"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { usePathname } from "next/navigation";

interface PresenceUser { name: string; color: string }

export function PresenceBar() {
  const [others, setOthers] = useState<PresenceUser[]>([]);
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel>;

    async function setup() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      channel = supabase.channel(`presence:${pathname}`, {
        config: { presence: { key: user.id } }
      });

      channel
        .on("presence", { event: "sync" }, () => {
          const state = channel.presenceState<{ name: string; color: string }>();
          const activeOthers = Object.entries(state)
            .filter(([key]) => key !== user.id)
            .map(([, data]) => data[0]);
          setOthers(activeOthers);
        })
        .subscribe(async (status) => {
          if (status === "SUBSCRIBED") {
            await channel.track({
              name: user.email?.split("@")[0] ?? "User",
              color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`,
            });
          }
        });
    }

    setup();
    return () => { channel?.unsubscribe(); };
  }, [pathname]);

  if (others.length === 0) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/60 border border-white/10 text-xs text-slate-400">
      <div className="flex -space-x-1">
        {others.slice(0, 3).map((u, i) => (
          <div key={i} title={u.name}
            style={{ backgroundColor: u.color }}
            className="w-5 h-5 rounded-full border border-slate-900 flex items-center justify-center text-[8px] font-bold text-white shadow-sm ring-1 ring-white/10">
            {u.name[0].toUpperCase()}
          </div>
        ))}
      </div>
      <span>{others.length === 1 ? `${others[0].name} is` : `${others.length} others are`} here</span>
    </div>
  );
}
