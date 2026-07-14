import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/reports/generate
 *
 * Returns a summary report of key business metrics.
 * NOTE: This is currently a demo-mode endpoint that aggregates real data
 * from the database but does not generate downloadable PDF/Excel files.
 * Full report generation (PDF export, scheduled delivery) is deferred to
 * a future release.
 */
export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? "summary";

  // Fetch real aggregated data
  const [invoicesRes, productsRes, customersRes] = await Promise.all([
    supabase
      .from("invoices")
      .select("amount, status")
      .eq("user_id", user.id),
    supabase
      .from("products")
      .select("stock, purchase_price, selling_price, min_stock")
      .eq("user_id", user.id),
    supabase
      .from("customers")
      .select("status")
      .eq("user_id", user.id),
  ]);

  const invoices = invoicesRes.data ?? [];
  const products = productsRes.data ?? [];
  const customers = customersRes.data ?? [];

  const totalRevenue = invoices
    .filter((i) => i.status === "Paid")
    .reduce((sum, i) => sum + (i.amount ?? 0), 0);

  const pendingRevenue = invoices
    .filter((i) => i.status === "Pending")
    .reduce((sum, i) => sum + (i.amount ?? 0), 0);

  const inventoryValue = products.reduce(
    (sum, p) => sum + (p.stock ?? 0) * (p.purchase_price ?? 0),
    0
  );

  const lowStockCount = products.filter(
    (p) => (p.stock ?? 0) <= (p.min_stock ?? 10)
  ).length;

  return NextResponse.json({
    demoMode: false,
    type,
    generatedAt: new Date().toISOString(),
    data: {
      revenue: {
        total: totalRevenue,
        pending: pendingRevenue,
        invoiceCount: invoices.length,
      },
      inventory: {
        totalProducts: products.length,
        inventoryValue,
        lowStockAlerts: lowStockCount,
      },
      customers: {
        total: customers.length,
        active: customers.filter((c) => c.status === "Active").length,
        new: customers.filter((c) => c.status === "New").length,
      },
    },
  });
}
