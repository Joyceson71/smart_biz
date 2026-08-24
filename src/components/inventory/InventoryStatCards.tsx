import { motion } from "framer-motion";
import { Package, AlertTriangle, IndianRupee, Layers } from "lucide-react";

interface InventoryStatCardsProps {
  totalProducts: number;
  lowStock: number;
  inventoryValue: number;
}

export function InventoryStatCards({ totalProducts, lowStock, inventoryValue }: InventoryStatCardsProps) {
  const formattedValue = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(inventoryValue);

  const stats = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: Package,
      color: "text-blue-400",
      bgBlur: "bg-blue-500/20",
      shadow: "shadow-[inset_0_0_15px_rgba(59,130,246,0.2)]",
      delay: 0.1
    },
    {
      title: "Low Stock Alerts",
      value: lowStock,
      icon: AlertTriangle,
      color: "text-amber-500",
      bgBlur: "bg-amber-500/20",
      shadow: "shadow-[inset_0_0_15px_rgba(245,158,11,0.2)]",
      delay: 0.2
    },
    {
      title: "Inventory Value",
      value: formattedValue,
      icon: IndianRupee,
      color: "text-emerald-400",
      bgBlur: "bg-emerald-500/20",
      shadow: "shadow-[inset_0_0_15px_rgba(16,185,129,0.2)]",
      delay: 0.3
    },
    {
      title: "Health Score",
      value: lowStock > 0 ? "85%" : "100%",
      icon: Layers,
      color: "text-purple-400",
      bgBlur: "bg-purple-500/20",
      shadow: "shadow-[inset_0_0_15px_rgba(168,85,247,0.2)]",
      delay: 0.4
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: stat.delay, ease: "easeOut" }}
            whileHover={{ y: -5 }}
            className="clay-card p-6 flex flex-col relative overflow-hidden group cursor-pointer"
          >
            <div className={`absolute -right-10 -top-10 w-32 h-32 ${stat.bgBlur} blur-[50px] rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-700`} />
            
            <div className="flex items-start justify-between mb-8 relative z-10">
              <div className={`w-12 h-12 neo-flat rounded-2xl flex items-center justify-center ${stat.color} ${stat.shadow}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
            
            <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2 relative z-10 drop-shadow-md">
              {stat.title}
            </h3>
            <p className="text-4xl font-black tracking-tighter text-white relative z-10">
              {stat.value}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
