import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/invoices/[id]
export async function GET(_req: Request, ctx: RouteContext) {
  const { id } = await ctx.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("invoices")
    .select(`
      *, 
      customer:customers(first_name, last_name, email, phone),
      items:invoice_items(*)
    `)
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    const status = error.code === "PGRST116" ? 404 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }

  return NextResponse.json({ data });
}

// PUT /api/invoices/[id]
export async function PUT(req: Request, ctx: RouteContext) {
  const { id } = await ctx.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // RLS enforces ownership; the .eq("user_id") is belt-and-suspenders
  const { data, error } = await supabase
    .from("invoices")
    .update({
      status: body.status,
      amount: body.amount,
      due_date: body.due_date,
      customer_name: body.customer_name,
      customer_email: body.customer_email,
      subtotal: body.subtotal,
      tax: body.tax,
      discount: body.discount,
      shipping: body.shipping,
      total: body.total,
      notes: body.notes,
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    const status = error.code === "PGRST116" ? 404 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }

  return NextResponse.json({ data });
}

// DELETE /api/invoices/[id]
export async function DELETE(_req: Request, ctx: RouteContext) {
  const { id } = await ctx.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("invoices")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return new Response(null, { status: 204 });
}
