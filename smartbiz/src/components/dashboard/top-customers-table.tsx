import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatINR } from "@/lib/utils/currency";

const topCustomers = [
  { name: "Krishnamurthy & Co", revenue: 259600, invoices: 1 },
  { name: "Tech Solutions India", revenue: 171100, invoices: 2 },
  { name: "Capital Distributors", revenue: 212400, invoices: 2 },
  { name: "Bangalore Components", revenue: 108560, invoices: 2 },
  { name: "Western India Electronics", revenue: 92040, invoices: 1 },
];

const maxRevenue = Math.max(...topCustomers.map((c) => c.revenue));

export function TopCustomersTable() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Top Customers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topCustomers.map((customer, i) => (
            <div key={customer.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-muted-foreground text-xs w-4 shrink-0">{i + 1}</span>
                  <span className="font-medium truncate">{customer.name}</span>
                </div>
                <span className="font-semibold text-xs shrink-0 ml-2">
                  {formatINR(customer.revenue)}
                </span>
              </div>
              {/* Progress bar */}
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${(customer.revenue / maxRevenue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
