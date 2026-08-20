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
      delay: 0.1
    },
    {
      title: "Low Stock Alerts",
      value: lowStock,
      icon: AlertTriangle,
      color: "text-amber-500",
      delay: 0.2
    },
    {
      title: "Inventory Value",
      value: formattedValue,
      icon: IndianRupee,
      color: "text-emerald-400",
      delay: 0.3
    },
    {
      title: "Health Score",
      value: lowStock > 0 ? "85%" : "100%",
      icon: Layers,
      color: "text-purple-400",
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
            <div className="flex items-start justify-between mb-8">
              <div className={`w-12 h-12 neo-flat rounded-2xl flex items-center justify-center ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
            
            <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">
              {stat.title}
            </h3>
            <p className="text-3xl font-black tracking-tight text-white">
              {stat.value}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
