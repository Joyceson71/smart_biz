export function SkeletonLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-950 p-6 md:p-12">
      <div className="w-full h-full max-w-6xl mx-auto flex flex-col gap-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center pb-6 border-b border-white/5">
          <div className="space-y-3">
            <div className="w-48 h-8 bg-slate-800/50 rounded-lg"></div>
            <div className="w-32 h-4 bg-slate-800/30 rounded-lg"></div>
          </div>
          <div className="flex gap-3">
            <div className="w-24 h-10 bg-slate-800/40 rounded-xl"></div>
            <div className="w-24 h-10 bg-slate-800/40 rounded-xl"></div>
          </div>
        </div>

        {/* Top Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-slate-800/40 rounded-2xl border border-white/5"></div>
          <div className="h-32 bg-slate-800/40 rounded-2xl border border-white/5"></div>
          <div className="h-32 bg-slate-800/40 rounded-2xl border border-white/5"></div>
        </div>

        {/* Main Content Area Skeleton */}
        <div className="flex-1 min-h-[300px] bg-slate-800/20 rounded-3xl border border-white/5 p-6 flex flex-col gap-4">
          <div className="w-full h-12 bg-slate-800/30 rounded-xl"></div>
          <div className="w-full h-12 bg-slate-800/30 rounded-xl"></div>
          <div className="w-full h-12 bg-slate-800/30 rounded-xl"></div>
          <div className="w-full h-12 bg-slate-800/30 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}
