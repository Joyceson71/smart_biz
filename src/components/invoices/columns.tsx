"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type InvoiceData = {
  id: string;
  invoice_number: string;
  customer_name: string;
  amount: number;
  status: string;
  due_date: string;
};

export const columns: ColumnDef<InvoiceData>[] = [
  {
    accessorKey: "invoice_number",
    header: "Invoice #",
  },
  {
    accessorKey: "customer_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Customer
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount);
 
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "due_date",
    header: "Due Date",
    cell: ({ row }) => {
      const dateStr = row.getValue("due_date") as string;
      if (!dateStr) return "-";
      return format(new Date(dateStr), "MMM dd, yyyy");
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      let colorClass = "text-slate-300";
      if (status === "Paid") colorClass = "text-emerald-500 font-semibold";
      if (status === "Overdue") colorClass = "text-red-500 font-semibold";
      if (status === "Pending") colorClass = "text-amber-500 font-medium";
      
      return <div className={colorClass}>{status}</div>;
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const invoice = row.original;
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" />}>
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-white">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(invoice.invoice_number)}
            >
              Copy Invoice #
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem>View PDF</DropdownMenuItem>
            <DropdownMenuItem>Record Payment</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
];
