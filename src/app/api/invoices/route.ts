import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/invoices — list all invoices for the authenticated user
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("invoices")
    .select(`
      id, invoice_number, amount, status, due_date, created_at,
      customer_name, customer_email, subtotal, tax, discount, shipping, total, notes,
      customer:customers(first_name, last_name, email)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

// POST /api/invoices — create a new invoice
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // Always derive owner from session — never trust client-supplied user_id
  const { data, error } = await supabase
    .from("invoices")
    .insert({
      user_id: user.id,
      customer_id: body.customer_id ?? null,
      invoice_number: body.invoice_number,
      amount: body.amount,
      status: body.status ?? "Pending",
      due_date: body.due_date ?? null,
      customer_name: body.customer_name ?? null,
      customer_email: body.customer_email ?? null,
      subtotal: body.subtotal ?? 0,
      tax: body.tax ?? 0,
      discount: body.discount ?? 0,
      shipping: body.shipping ?? 0,
      total: body.total ?? body.amount,
      notes: body.notes ?? null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Insert line items if provided
  if (body.items && Array.isArray(body.items) && body.items.length > 0) {
    const items = body.items.map((item: {
      product_id?: string;
      product_name: string;
      quantity: number;
      unit_price: number;
      gst_pct?: number;
      total: number;
    }) => ({
      invoice_id: data.id,
      product_id: item.product_id ?? null,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      gst_pct: item.gst_pct ?? 0,
      total: item.total,
    }));

    const { error: itemsError } = await supabase.from("invoice_items").insert(items);
    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ data }, { status: 201 });
}
