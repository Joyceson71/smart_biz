import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col h-full bg-slate-950 text-white w-full overflow-hidden items-center justify-center space-y-4">
      <div className="relative">
        <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full animate-pulse" />
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin relative z-10" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-center tracking-tight">Loading Invoices...</h3>
        <p className="text-sm text-slate-500 mt-2 text-center">Fetching your billing data and 3D environment</p>
      </div>
    </div>
  );
}
