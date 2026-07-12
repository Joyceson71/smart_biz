"use client";

import { useWindowStore } from "@/stores/useWindowStore";
import OSWindow from "@/components/os/window";
import AICore from "@/components/os/ai-command-center";
import Warehouse3D from "@/features/inventory/Warehouse3D";
import CustomerNetwork3D from "@/features/customers/CustomerNetwork3D";
import SpatialFinance from "@/features/finance/SpatialFinance";

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
