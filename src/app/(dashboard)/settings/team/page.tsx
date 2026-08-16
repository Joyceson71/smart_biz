import { Users } from "lucide-react";

export default function TeamPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
      <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-white/10 flex items-center justify-center">
        <Users className="w-7 h-7 text-slate-400" />
      </div>
      <h2 className="text-lg font-semibold text-white">Team</h2>
      <p className="text-sm text-slate-400 max-w-xs">
        Team management is coming soon. Invite and manage your employees here.
      </p>
    </div>
  );
}
