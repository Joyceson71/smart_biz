"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText, Download, MoreHorizontal } from "lucide-react";
import { formatINR } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";
import { ROUTES } from "@/lib/constants/routes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InvoiceStatus } from "@/types/database";

// Mock data
const mockInvoices = [
  { id: "1", number: "INV-0027", customer: "Tech Solutions India Pvt Ltd", issueDate: "2024-07-09", dueDate: "2024-08-09", totalAmount: 171100, amountPaid: 0, status: "sent" as InvoiceStatus, type: "sale" },
  { id: "2", number: "INV-0026", customer: "Bangalore Components Ltd", issueDate: "2024-07-09", dueDate: "2024-08-24", totalAmount: 103840, amountPaid: 0, status: "draft" as InvoiceStatus, type: "sale" },
  { id: "3", number: "INV-0025", customer: "Krishnamurthy & Co", issueDate: "2024-07-09", dueDate: "2024-09-07", totalAmount: 295000, amountPaid: 0, status: "viewed" as InvoiceStatus, type: "sale" },
  { id: "4", number: "INV-0024", customer: "Mehta Enterprises", issueDate: "2024-07-08", dueDate: "2024-08-07", totalAmount: 113280, amountPaid: 50000, status: "partial" as InvoiceStatus, type: "sale" },
  { id: "5", number: "INV-0020", customer: "Rajasthan Retail Network", issueDate: "2024-07-05", dueDate: "2024-08-05", totalAmount: 92040, amountPaid: 92040, status: "paid" as InvoiceStatus, type: "sale" },
  { id: "6", number: "INV-0021", customer: "Capital Distributors", issueDate: "2024-05-25", dueDate: "2024-06-10", totalAmount: 158120, amountPaid: 0, status: "overdue" as InvoiceStatus, type: "sale" },
];

export default function InvoicesPage() {
  const [data] = useState(mockInvoices);

  const columns = [
    {
      accessorKey: "number",
      header: "Invoice #",
      cell: ({ row }: any) => (
        <Link href={ROUTES.INVOICE_DETAIL(row.original.id)} className="font-medium text-primary hover:underline">
          {row.getValue("number")}
        </Link>
      ),
    },
    {
      accessorKey: "customer",
      header: "Customer",
    },
    {
      accessorKey: "issueDate",
      header: "Date",
      cell: ({ row }: any) => <span className="text-muted-foreground">{formatDate(row.getValue("issueDate"))}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => <StatusBadge status={row.getValue("status")} />,
    },
    {
      accessorKey: "totalAmount",
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }: any) => (
        <div className="text-right font-semibold">
          {formatINR(row.getValue("totalAmount"))}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }: any) => {
        const invoice = row.original;
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
                <DropdownMenuItem asChild>
                  <Link href={ROUTES.INVOICE_DETAIL(invoice.id)}>View details</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Record payment</DropdownMenuItem>
                <DropdownMenuItem>Download PDF</DropdownMenuItem>
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
        title="Invoices"
        description="Manage your sales and purchase invoices."
      >
        <Button variant="outline" className="gap-2">
          <Download className="size-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>
        <Button className="gap-2" asChild>
          <Link href={ROUTES.INVOICE_NEW}>
            <PlusCircle className="size-4" />
            <span className="hidden sm:inline">Create Invoice</span>
          </Link>
        </Button>
        <Button className="gap-2" variant="secondary" asChild>
          <Link href="/invoices/ocr">
            <FileText className="size-4" />
            <span className="hidden sm:inline">Scan Upload</span>
          </Link>
        </Button>
      </PageHeader>

      <DataTable 
        columns={columns} 
        data={data} 
        searchKey="number" 
        searchPlaceholder="Search invoices..." 
      />
    </div>
  );
}
