import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import { formatINR } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";
import { ArrowRight } from "lucide-react";

type InvoiceStatus = "draft" | "sent" | "viewed" | "partial" | "paid" | "overdue" | "cancelled";

const statusConfig: Record<InvoiceStatus, { label: string; className: string }> = {
  draft:     { label: "Draft",     className: "badge-draft" },
  sent:      { label: "Sent",      className: "badge-sent" },
  viewed:    { label: "Viewed",    className: "badge-viewed" },
  partial:   { label: "Partial",   className: "badge-partial" },
  paid:      { label: "Paid",      className: "badge-paid" },
  overdue:   { label: "Overdue",   className: "badge-overdue" },
  cancelled: { label: "Cancelled", className: "badge-cancelled" },
};

// Mock data — replace with Supabase query
const recentInvoices = [
  { id: "1", number: "INV-0027", customer: "Tech Solutions India Pvt Ltd", date: "2024-07-09", amount: 171100, status: "sent" as InvoiceStatus },
  { id: "2", number: "INV-0026", customer: "Bangalore Components Ltd", date: "2024-07-09", amount: 103840, status: "sent" as InvoiceStatus },
  { id: "3", number: "INV-0025", customer: "Krishnamurthy & Co", date: "2024-07-09", amount: 295000, status: "viewed" as InvoiceStatus },
  { id: "4", number: "INV-0024", customer: "Mehta Enterprises", date: "2024-07-09", amount: 113280, status: "partial" as InvoiceStatus },
  { id: "5", number: "INV-0023", customer: "Hyderabad Retail Hub", date: "2024-07-05", amount: 88500, status: "partial" as InvoiceStatus },
  { id: "6", number: "INV-0022", customer: "Coastal Traders Pvt Ltd", date: "2024-06-10", amount: 105020, status: "overdue" as InvoiceStatus },
  { id: "7", number: "INV-0021", customer: "Capital Distributors", date: "2024-05-25", amount: 158120, status: "overdue" as InvoiceStatus },
  { id: "8", number: "INV-0020", customer: "Rajasthan Retail Network", date: "2024-07-05", amount: 92040, status: "paid" as InvoiceStatus },
];

export function RecentInvoices() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Recent Invoices</CardTitle>
          <Button variant="ghost" size="sm" className="text-primary" asChild>
            <Link href={ROUTES.INVOICES}>
              View all <ArrowRight className="size-3.5 ml-1" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left pb-3 font-medium">#</th>
                <th className="text-left pb-3 font-medium hidden sm:table-cell">Customer</th>
                <th className="text-left pb-3 font-medium hidden md:table-cell">Date</th>
                <th className="text-right pb-3 font-medium">Amount</th>
                <th className="text-right pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map((inv) => {
                const status = statusConfig[inv.status];
                return (
                  <tr key={inv.id} className="border-b border-border/50 last:border-0 hover:bg-accent/30 transition-colors">
                    <td className="py-3 pr-4">
                      <Link href={ROUTES.INVOICE_DETAIL(inv.id)} className="font-medium text-primary hover:underline">
                        {inv.number}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 hidden sm:table-cell">
                      <span className="truncate max-w-[180px] block">{inv.customer}</span>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground hidden md:table-cell">
                      {formatDate(inv.date)}
                    </td>
                    <td className="py-3 text-right font-semibold">
                      {formatINR(inv.amount)}
                    </td>
                    <td className="py-3 text-right pl-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
