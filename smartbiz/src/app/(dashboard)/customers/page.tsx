"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { formatINR } from "@/lib/utils/currency";
import { ROUTES } from "@/lib/constants/routes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data
const mockCustomers = [
  { id: "1", name: "Tech Solutions India Pvt Ltd", email: "accounts@techsolutions.in", phone: "+91-22-66778899", balance: 171100, status: "Active" },
  { id: "2", name: "Bangalore Components Ltd", email: "purchase@bangalorecomp.co.in", phone: "+91-80-45678901", balance: 103840, status: "Active" },
  { id: "3", name: "Krishnamurthy & Co", email: "finance@krishnamurthy.biz", phone: "+91-44-56789012", balance: 295000, status: "Active" },
  { id: "4", name: "Mehta Enterprises", email: "info@mehtaenterprises.in", phone: "+91-79-34567890", balance: 63280, status: "Active" },
  { id: "5", name: "Coastal Traders Pvt Ltd", email: "finance@coastaltraders.co.in", phone: "+91-484-3456789", balance: 105020, status: "Overdue" },
];

export default function CustomersPage() {
  const [data] = useState(mockCustomers);

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }: any) => (
        <span className="font-medium text-primary cursor-pointer hover:underline">
          {row.getValue("name")}
        </span>
      ),
    },
    {
      accessorKey: "email",
      header: "Contact",
      cell: ({ row }: any) => (
        <div className="flex flex-col">
          <span className="text-sm">{row.getValue("email")}</span>
          <span className="text-xs text-muted-foreground">{row.original.phone}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${row.getValue("status") === "Active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"}`}>
          {row.getValue("status")}
        </span>
      ),
    },
    {
      accessorKey: "balance",
      header: () => <div className="text-right">Outstanding Balance</div>,
      cell: ({ row }: any) => (
        <div className={`text-right font-semibold ${row.getValue("balance") > 0 ? "text-amber-600 dark:text-amber-500" : ""}`}>
          {formatINR(row.getValue("balance"))}
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
                <DropdownMenuItem>View details</DropdownMenuItem>
                <DropdownMenuItem>Edit customer</DropdownMenuItem>
                <DropdownMenuItem>Create invoice</DropdownMenuItem>
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
        title="Customers"
        description="Manage your accounts receivable clients."
      >
        <Button className="gap-2">
          <PlusCircle className="size-4" />
          <span className="hidden sm:inline">Add Customer</span>
        </Button>
      </PageHeader>

      <DataTable 
        columns={columns} 
        data={data} 
        searchKey="name" 
        searchPlaceholder="Search customers..." 
      />
    </div>
  );
}
