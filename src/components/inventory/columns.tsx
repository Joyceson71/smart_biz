"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Product = {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  category_id?: string;
  supplier_id?: string;
  warehouse_id?: string;
  purchase_price: number;
  selling_price: number;
  current_stock: number; // mapped from stock
  min_stock: number;
  max_stock: number;
  unit: string;
  status: string;
  last_updated: string; // mapped from created_at or updated_at
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Product Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "sku",
    header: "SKU",
  },
  {
    accessorKey: "current_stock",
    header: "Stock",
    cell: ({ row }) => {
      const stock = parseFloat(row.getValue("current_stock"));
      const min_stock = row.original.min_stock;
      
      let colorClass = "text-emerald-500";
      if (stock <= 0) colorClass = "text-red-500 font-bold";
      else if (stock <= min_stock) colorClass = "text-amber-500 font-semibold";
      
      return <div className={colorClass}>{stock} {row.original.unit}</div>;
    },
  },
  {
    accessorKey: "selling_price",
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("selling_price"));
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount);
 
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;
 
      return (
        <DropdownMenu>
          {/* @ts-expect-error Missing asChild type */}
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-white">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(product.sku)}
            >
              Copy SKU
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Edit product</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
];
