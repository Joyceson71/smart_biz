/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

import { useRouter } from "next/navigation";

export function RealtimeProvider() {
  const router = useRouter();
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("realtime-products")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        (payload) => {
          // Re-fetch data on any changes
          router.refresh();
          
          if (payload.eventType === "UPDATE" || payload.eventType === "INSERT") {
            const product = payload.new as any;
            if (product && product.stock <= (product.min_stock || 10)) {
              toast.warning(`⚠️ Low stock alert: ${product.name}`, {
                description: `Current stock: ${product.stock}. Reorder soon.`,
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
