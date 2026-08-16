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
      bgClass: "bg-blue-400/10",
      delay: 0.1
    },
    {
      title: "Low Stock Alerts",
      value: lowStock,
      icon: AlertTriangle,
      color: "text-amber-500",
      bgClass: "bg-amber-500/10",
      delay: 0.2
    },
    {
      title: "Inventory Value",
      value: formattedValue,
      icon: IndianRupee,
      color: "text-emerald-400",
      bgClass: "bg-emerald-400/10",
      delay: 0.3
    },
    {
      title: "Health Score",
      value: lowStock > 0 ? "85%" : "100%",
      icon: Layers,
      color: "text-purple-400",
      bgClass: "bg-purple-400/10",
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
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative overflow-hidden rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-white/10 p-6 group shadow-lg"
          >
            {/* Subtle gradient glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-slate-400 text-sm tracking-wide">{stat.title}</h3>
              <div className={`p-2 rounded-xl ${stat.bgClass}`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <p className={`text-3xl font-bold tracking-tight ${stat.color === 'text-blue-400' ? 'text-white' : stat.color}`}>
              {stat.value}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
