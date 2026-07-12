"use client";

import { PageTransition } from "@/components/ui/page-transition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Search, Mail, Phone, ExternalLink } from "lucide-react";

const customers = [
  { id: 1, name: "Liam Johnson", email: "liam@example.com", phone: "+1 (555) 123-4567", ltv: "$4,250.00", status: "Active", initials: "LJ" },
  { id: 2, name: "Emma Williams", email: "emma@example.com", phone: "+1 (555) 987-6543", ltv: "$1,200.00", status: "Active", initials: "EW" },
  { id: 3, name: "Noah Brown", email: "noah@example.com", phone: "+1 (555) 456-7890", ltv: "$450.00", status: "Inactive", initials: "NB" },
  { id: 4, name: "Olivia Davis", email: "olivia@example.com", phone: "+1 (555) 234-5678", ltv: "$8,890.00", status: "Active", initials: "OD" },
  { id: 5, name: "William Miller", email: "william@example.com", phone: "+1 (555) 876-5432", ltv: "$3,400.00", status: "Active", initials: "WM" },
  { id: 6, name: "Sophia Wilson", email: "sophia@example.com", phone: "+1 (555) 345-6789", ltv: "$150.00", status: "New", initials: "SW" },
  { id: 7, name: "James Moore", email: "james@example.com", phone: "+1 (555) 765-4321", ltv: "$75.00", status: "Inactive", initials: "JM" },
  { id: 8, name: "Isabella Taylor", email: "isabella@example.com", phone: "+1 (555) 678-9012", ltv: "$2,100.00", status: "Active", initials: "IT" },
];

export default function CustomersPage() {
  return (
    <PageTransition>
      <div className="flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              View and manage your client directory.
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              type="search"
              placeholder="Search customers by name or email..."
              className="w-full bg-white dark:bg-slate-950 pl-9 border-slate-200 dark:border-slate-800 shadow-sm"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {customers.map((customer) => (
            <Card key={customer.id} className="group hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md border-slate-200 dark:border-slate-800">
              <CardHeader className="flex flex-row gap-4 p-5 pb-4">
                <Avatar className="h-12 w-12 border-2 border-white dark:border-slate-900 shadow-sm">
                  <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400 font-medium">
                    {customer.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {customer.name}
                    </h3>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                      customer.status === 'Active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      customer.status === 'New' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {customer.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                    {customer.email}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <div className="grid grid-cols-2 gap-4 mt-2 mb-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 dark:text-slate-400 mb-1">Lifetime Value</span>
                    <span className="font-semibold">{customer.ltv}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 dark:text-slate-400 mb-1">Phone</span>
                    <span className="text-sm truncate">{customer.phone}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 pt-2">
                  <Button variant="outline" size="sm" className="w-full h-8 text-xs">
                    <Mail className="mr-1.5 h-3.5 w-3.5" />
                    Email
                  </Button>
                  <Button variant="outline" size="sm" className="w-full h-8 text-xs">
                    <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
