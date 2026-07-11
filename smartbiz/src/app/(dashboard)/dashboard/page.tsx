import { Metadata } from "next";
import { Suspense } from "react";
import { TrendingUp, Clock, AlertCircle, Target, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { CashFlowChart } from "@/components/dashboard/cash-flow-chart";
import { RecentInvoices } from "@/components/dashboard/recent-invoices";
import { TopCustomersTable } from "@/components/dashboard/top-customers-table";
import { AlertsPanel } from "@/components/dashboard/alerts-panel";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { formatINR } from "@/lib/utils/currency";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "SmartBiz business intelligence overview — revenue, cash flow, and key metrics",
};

// Mock stats for demo (replace with real Supabase RPC call)
const mockStats = {
  totalRevenue: 1842500,
  totalRevenuePrev: 1520000,
  outstandingAR: 470900,
  outstandingCount: 8,
  overdueAmount: 470720,
  overdueCount: 5,
  netProfit: 615300,
  netMargin: 33.4,
  netProfitPrev: 498000,
};

interface KPICardProps {
  title: string;
  value: string;
  change?: { value: string; positive: boolean };
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  trend?: "up" | "down" | "neutral";
}

function KPICard({ title, value, change, subtitle, icon: Icon, iconColor }: KPICardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow relative overflow-hidden group">
      {/* Subtle gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
          </div>
          <div className={`p-2.5 rounded-xl ${iconColor}`}>
            <Icon className="size-5" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {change && (
            <div className="flex items-center gap-1.5">
              {change.positive ? (
                <ArrowUpRight className="size-3.5 text-green-500" />
              ) : (
                <ArrowDownRight className="size-3.5 text-red-500" />
              )}
              <span className={`text-xs font-medium ${change.positive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {change.value}
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          )}
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default async function DashboardPage() {
  // In production: const stats = await supabase.rpc('get_dashboard_stats', { ... })
  const stats = mockStats;
  const revenueChange = ((stats.totalRevenue - stats.totalRevenuePrev) / stats.totalRevenuePrev * 100).toFixed(1);
  const profitChange = ((stats.netProfit - stats.netProfitPrev) / stats.netProfitPrev * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Good morning, Rajesh! 👋</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Here&apos;s what&apos;s happening with your business today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-normal">
            📅 This Month
          </Badge>
        </div>
      </div>

      {/* ── KPI Cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          title="Total Revenue"
          value={formatINR(stats.totalRevenue)}
          change={{ value: `+${revenueChange}%`, positive: true }}
          icon={TrendingUp}
          iconColor="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        />
        <KPICard
          title="Outstanding AR"
          value={formatINR(stats.outstandingAR)}
          subtitle={`${stats.outstandingCount} invoices pending`}
          icon={Clock}
          iconColor="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
        />
        <KPICard
          title="Overdue Amount"
          value={formatINR(stats.overdueAmount)}
          subtitle={`${stats.overdueCount} invoices overdue`}
          icon={AlertCircle}
          iconColor="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
        />
        <KPICard
          title="Net Profit"
          value={formatINR(stats.netProfit)}
          change={{ value: `+${profitChange}%`, positive: true }}
          subtitle={`${stats.netMargin}% margin`}
          icon={Target}
          iconColor="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
        />
      </div>

      {/* ── Charts Row ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Revenue vs Expenses Chart */}
        <Card className="xl:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Revenue vs Expenses</CardTitle>
            <CardDescription>Last 6 months performance</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<LoadingSkeleton className="h-[280px]" />}>
              <RevenueChart />
            </Suspense>
          </CardContent>
        </Card>

        {/* Cash Flow Forecast */}
        <Card className="xl:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Cash Flow Forecast</CardTitle>
            <CardDescription>Next 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<LoadingSkeleton className="h-[280px]" />}>
              <CashFlowChart />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      {/* ── Bottom Grid ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Recent Invoices */}
        <div className="xl:col-span-2">
          <Suspense fallback={<LoadingSkeleton className="h-[400px]" />}>
            <RecentInvoices />
          </Suspense>
        </div>

        {/* Right column: Top Customers + Alerts */}
        <div className="space-y-4">
          <Suspense fallback={<LoadingSkeleton className="h-[200px]" />}>
            <TopCustomersTable />
          </Suspense>
          <Suspense fallback={<LoadingSkeleton className="h-[180px]" />}>
            <AlertsPanel />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
