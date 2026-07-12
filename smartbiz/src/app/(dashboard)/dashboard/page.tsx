"use client";

import dynamic from "next/dynamic";
import { useWindowStore } from "@/stores/useWindowStore";
import OSWindow from "@/components/os/window";

const AICore = dynamic(() => import("@/components/os/ai-command-center"), { ssr: false });
const Warehouse3D = dynamic(() => import("@/features/inventory/Warehouse3D"), { ssr: false });
const CustomerNetwork3D = dynamic(() => import("@/features/customers/CustomerNetwork3D"), { ssr: false });
const SpatialFinance = dynamic(() => import("@/features/finance/SpatialFinance"), { ssr: false });

export default function OSDesktop() {
  const windows = useWindowStore((state) => state.windows);

  const renderComponent = (componentName: string) => {
    switch (componentName) {
      case "Warehouse3D": return <Warehouse3D />;
      case "CustomerNetwork3D": return <CustomerNetwork3D />;
      case "SpatialFinance": return <SpatialFinance />;
      case "AICore": return <AICore />;
      default: return <div className="p-8 text-white/50 flex h-full items-center justify-center">Spatial Module Not Found</div>;
    }
  };

  return (
    <div className="absolute inset-0 z-0">
      {windows.map((w) => (
        <OSWindow key={w.id} id={w.id}>
          {renderComponent(w.component)}
        </OSWindow>
      ))}
    </div>
  );
}
