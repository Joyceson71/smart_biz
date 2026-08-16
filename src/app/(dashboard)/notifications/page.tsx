import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { NotificationsClient, NotificationType } from "./NotificationsClient";

export const metadata = {
  title: "Notifications | SmartBiz OS",
};

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Derive notifications from actual data
  const [productsRes, invoicesRes, customersRes] = await Promise.all([
    supabase.from("products").select("id, name, stock, min_stock").eq("user_id", user.id).lte("stock", 10), // We will filter further in code
    supabase.from("invoices").select("id, invoice_number, created_at").eq("user_id", user.id).eq("status", "Overdue"),
    supabase.from("customers").select("id, name, created_at").eq("user_id", user.id)
  ]);

  const notifications: NotificationType[] = [];

  // Low Stock
  const lowStockProducts = (productsRes.data || []).filter(p => (p.stock || 0) <= (p.min_stock || 10));
  lowStockProducts.forEach(p => {
    notifications.push({
      id: `stock-${p.id}`,
      type: "low_stock",
      title: "Low Stock Alert",
      message: `${p.name} is running low (Current stock: ${p.stock || 0}). Time to reorder.`,
      date: new Date().toISOString(),
      read: false
    });
  });

  // Overdue Invoices
  (invoicesRes.data || []).forEach(inv => {
    notifications.push({
      id: `inv-${inv.id}`,
      type: "overdue_invoice",
      title: "Invoice Overdue",
      message: `Invoice ${inv.invoice_number} is now overdue. Consider sending a reminder.`,
      date: inv.created_at,
      read: false
    });
  });

  // New Customers (Last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentCustomers = (customersRes.data || []).filter(c => new Date(c.created_at) >= sevenDaysAgo);
  
  recentCustomers.forEach(c => {
    notifications.push({
      id: `cust-${c.id}`,
      type: "new_customer",
      title: "New Customer",
      message: `${c.name} was added to your contacts.`,
      date: c.created_at,
      read: false
    });
  });

  // Sort by date descending
  notifications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return <NotificationsClient notifications={notifications} />;
}
