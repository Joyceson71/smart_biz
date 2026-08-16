/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function RealtimeProvider() {
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("realtime-products")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "products" },
        (payload) => {
          const product = payload.new as any;
          if (product && product.stock <= (product.min_stock || 10)) {
            toast.warning(`⚠️ Low stock alert: ${product.name}`, {
              description: `Current stock: ${product.stock}. Reorder soon.`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return null;
}
