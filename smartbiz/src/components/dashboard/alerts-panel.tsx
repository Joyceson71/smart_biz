import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { formatINR } from "@/lib/utils/currency";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";

const overdueInvoices = [
  { id: "21", number: "INV-0021", customer: "Coastal Traders Pvt Ltd", amount: 105020, daysOverdue: 30 },
  { id: "22", number: "INV-0022", customer: "Capital Distributors", amount: 158120, daysOverdue: 15 },
  { id: "23", number: "INV-0023", customer: "NE Trading Company", amount: 66080, daysOverdue: 10 },
  { id: "24", number: "INV-0024", customer: "Chennai Auto Parts", amount: 56640, daysOverdue: 5 },
  { id: "25", number: "INV-0025", customer: "Kolkata Wholesale Market", amount: 84960, daysOverdue: 1 },
];

export function AlertsPanel() {
  return (
    <Card className="border-red-200 dark:border-red-900/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2 text-red-600 dark:text-red-400">
          <AlertCircle className="size-4" />
          Overdue Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2.5">
          {overdueInvoices.map((inv) => (
            <Link
              key={inv.id}
              href={ROUTES.INVOICE_DETAIL(inv.id)}
              className="flex items-center justify-between p-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors group"
            >
              <div className="min-w-0">
                <p className="text-xs font-semibold text-red-700 dark:text-red-300">{inv.number}</p>
                <p className="text-xs text-red-600/80 dark:text-red-400/80 truncate">{inv.customer}</p>
              </div>
              <div className="text-right shrink-0 ml-2">
                <p className="text-xs font-bold text-red-700 dark:text-red-300">{formatINR(inv.amount)}</p>
                <p className="text-[10px] text-red-500">{inv.daysOverdue}d overdue</p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
