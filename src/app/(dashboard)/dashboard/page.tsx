import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { PageTransition } from "@/components/ui/page-transition";
import { DollarSign, Users, CreditCard, Activity } from "lucide-react";

export default function DashboardPage() {
  return (
    <PageTransition>
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-500">Live Hackathon Demo Mode 🚀</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2,350</div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                +180 new this week
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outstanding Invoices</CardTitle>
              <CreditCard className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">124</div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                43 overdue items
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Activity className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">99.9%</div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                All services operational
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>
                Your revenue trajectory over the past year.
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <OverviewChart />
            </CardContent>
          </Card>
          
          <Card className="col-span-3 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest transactions from your customers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {[
                  { name: "Olivia Martin", email: "olivia.martin@email.com", amount: "+$1,999.00", img: "OM" },
                  { name: "Jackson Lee", email: "jackson.lee@email.com", amount: "+$39.00", img: "JL" },
                  { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: "+$299.00", img: "IN" },
                  { name: "William Kim", email: "will@email.com", amount: "+$99.00", img: "WK" },
                  { name: "Sofia Davis", email: "sofia.davis@email.com", amount: "+$39.00", img: "SD" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-slate-100">
                      {item.img}
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">{item.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {item.email}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">{item.amount}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
