"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { formatINR } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";
import { ROUTES } from "@/lib/constants/routes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data
const mockExpenses = [
  { id: "1", category: "Office Supplies", description: "A4 Paper & Stationery bulk purchase", date: "2024-04-05", amount: 4500, vendor: "Delhi Packaging Supplies" },
  { id: "2", category: "Travel", description: "Flight Mumbai-Delhi (business trip)", date: "2024-04-15", amount: 18500, vendor: "-" },
  { id: "3", category: "Software & Subscriptions", description: "Google Workspace (annual)", date: "2024-04-01", amount: 14400, vendor: "-" },
  { id: "4", category: "Utilities", description: "MSEB electricity bill (factory)", date: "2024-04-10", amount: 28000, vendor: "TATA Power Solutions" },
  { id: "5", category: "Marketing", description: "Google Ads campaign (April)", date: "2024-04-30", amount: 25000, vendor: "-" },
];

export default function ExpensesPage() {
  const [data] = useState(mockExpenses);

  const columns = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }: any) => <span className="text-muted-foreground">{formatDate(row.getValue("date"))}</span>,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }: any) => (
        <span className="inline-flex items-center rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
          {row.getValue("category")}
        </span>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }: any) => <span className="font-medium">{row.getValue("description")}</span>,
    },
    {
      accessorKey: "vendor",
      header: "Vendor",
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }: any) => (
        <div className="text-right font-semibold">
          {formatINR(row.getValue("amount"))}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }: any) => {
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View receipt</DropdownMenuItem>
                <DropdownMenuItem>Edit expense</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expenses"
        description="Track your business spending and categorize expenses."
      >
        <Button className="gap-2">
          <PlusCircle className="size-4" />
          <span className="hidden sm:inline">Add Expense</span>
        </Button>
      </PageHeader>

      <DataTable 
        columns={columns} 
        data={data} 
        searchKey="description" 
        searchPlaceholder="Search expenses..." 
      />
    </div>
  );
}
