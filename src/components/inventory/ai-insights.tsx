"use client";

import { Sparkles, TrendingUp, AlertTriangle, RefreshCw, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { generateInventoryInsights } from "@/app/(dashboard)/inventory/actions";
import type { Product } from "@/components/inventory/columns";

interface Insight {
  type: "warning" | "success";
  title: string;
  description: string;
  actionText?: string;
}

export function AIInsightsPanel({ products }: { products: Product[] }) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const generated = await generateInventoryInsights(products);
        if (isMounted) setInsights(generated);
      } catch (e) {
        console.error("Failed to generate insights:", e);
        if (isMounted) {
          setInsights([{
            type: "warning",
            title: "Analysis Failed",
            description: "Failed to generate AI insights from the current inventory. Please try again.",
          }]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (products.length > 0) {
      fetchInsights();
    }
    
    return () => {
      isMounted = false;
    };
  }, [products]);

  return (
    <div className="clay-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center">
            AI Insights
          </h2>
        </div>
        <button 
          className="h-8 px-3 rounded-xl neo-flat text-slate-400 hover:text-white transition-colors"
          onClick={async () => {
            setLoading(true);
            try {
              const generated = await generateInventoryInsights(products);
              setInsights(generated);
            } catch (e) {
              console.error(e);
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex-1 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-40 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-purple-500" />
            <p className="text-sm font-bold text-slate-400 animate-pulse">Analyzing inventory...</p>
          </div>
        ) : insights.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-slate-500 text-sm font-bold">
            Not enough data to generate insights.
          </div>
        ) : (
          insights.map((insight, idx) => (
            <div key={idx} className="neo-pressed p-4 rounded-2xl">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl neo-flat ${insight.type === 'warning' ? 'text-amber-500' : 'text-emerald-500'}`}>
                  {insight.type === 'warning' ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : (
                    <TrendingUp className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{insight.title}</h4>
                  <p className="text-xs font-medium text-slate-400 mt-1 leading-relaxed">
                    {insight.description}
                  </p>
                  {insight.actionText && (
                    <button className={`text-xs font-bold mt-2 transition-colors ${insight.type === 'warning' ? 'text-amber-500 hover:text-amber-400' : 'text-emerald-500 hover:text-emerald-400'}`}>
                      {insight.actionText}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="pt-4 mt-4 text-center">
        <p className="text-xs font-bold text-slate-500 flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3" />
          Powered by SmartBiz AI Core
        </p>
      </div>
    </div>
  );
}
