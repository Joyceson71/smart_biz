"use client";

import { Sparkles, TrendingUp, AlertTriangle } from "lucide-react";

export function AIInsightsPanel() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <h2 className="text-lg font-bold text-white tracking-tight">AI Insights</h2>
      </div>

      <div className="flex-1 space-y-4">
        {/* Insight 1 */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
          <div className="flex items-start gap-3">
            <div className="bg-amber-500/20 p-2 rounded-md">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Stock Depletion Warning</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                <strong className="text-amber-400">Wireless Mouse (WM-001)</strong> is currently selling 15% faster than last month. Current stock will be depleted in approximately <strong className="text-white">5 days</strong>.
              </p>
              <button className="text-xs font-medium text-amber-500 mt-2 hover:text-amber-400">
                1-Click Restock
              </button>
            </div>
          </div>
        </div>

        {/* Insight 2 */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
          <div className="flex items-start gap-3">
            <div className="bg-emerald-500/20 p-2 rounded-md">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Demand Prediction</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Based on historical sales data, demand for <strong className="text-emerald-400">Ergonomic Chairs</strong> is expected to spike by 20% next week due to upcoming office reopenings.
              </p>
            </div>
          </div>
        </div>

      </div>
      
      <div className="pt-4 border-t border-slate-800 mt-4 text-center">
        <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3" />
          Powered by SmartBiz AI Core
        </p>
      </div>
    </div>
  );
}
