/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { renderToStream } from "@react-pdf/renderer";
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Styles for the PDF
const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", color: "#333" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 40, borderBottomWidth: 1, borderBottomColor: "#eee", paddingBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#111" },
  subtitle: { fontSize: 10, color: "#666", marginTop: 4 },
  infoBlock: { textAlign: "right" },
  label: { fontSize: 10, color: "#666", fontWeight: "bold" },
  value: { fontSize: 10, marginTop: 2 },
  sectionTitle: { fontSize: 12, fontWeight: "bold", marginBottom: 10, color: "#666", textTransform: "uppercase" },
  billTo: { marginBottom: 30 },
  table: { display: "flex", width: "auto", borderStyle: "solid", borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0, borderColor: "#eee" },
  tableRow: { margin: "auto", flexDirection: "row" },
  tableColHeader: { width: "20%", borderStyle: "solid", borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, borderColor: "#eee", backgroundColor: "#f9f9f9" },
  tableColHeaderDesc: { width: "40%", borderStyle: "solid", borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, borderColor: "#eee", backgroundColor: "#f9f9f9" },
  tableCol: { width: "20%", borderStyle: "solid", borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, borderColor: "#eee" },
  tableColDesc: { width: "40%", borderStyle: "solid", borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, borderColor: "#eee" },
  tableCellHeader: { margin: 5, fontSize: 10, fontWeight: "bold" },
  tableCell: { margin: 5, fontSize: 10 },
  totals: { marginTop: 30, alignItems: "flex-end" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", width: "40%", marginBottom: 5 },
  totalLabel: { fontSize: 10, color: "#666" },
  totalValue: { fontSize: 10 },
  grandTotal: { flexDirection: "row", justifyContent: "space-between", width: "40%", marginTop: 5, paddingTop: 5, borderTopWidth: 1, borderTopColor: "#333" },
  grandTotalLabel: { fontSize: 12, fontWeight: "bold" },
  grandTotalValue: { fontSize: 12, fontWeight: "bold" },
  footer: { position: "absolute", bottom: 30, left: 40, right: 40, textAlign: "center", borderTopWidth: 1, borderTopColor: "#eee", paddingTop: 10, fontSize: 10, color: "#999" }
});

const InvoiceDocument = ({ invoice, customer, items }: any) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>INVOICE</Text>
          <Text style={styles.subtitle}>SmartBiz OS Inc.</Text>
          <Text style={styles.subtitle}>123 Business Road, Tech Park</Text>
          <Text style={styles.subtitle}>Bangalore, India 560001</Text>
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>Invoice No:</Text>
          <Text style={styles.value}>{invoice.invoice_number}</Text>
          <Text style={[styles.label, { marginTop: 10 }]}>Date:</Text>
          <Text style={styles.value}>{new Date(invoice.created_at).toLocaleDateString()}</Text>
          <Text style={[styles.label, { marginTop: 10 }]}>Due Date:</Text>
          <Text style={styles.value}>{new Date(invoice.due_date).toLocaleDateString()}</Text>
        </View>
      </View>

      <View style={styles.billTo}>
        <Text style={styles.sectionTitle}>Bill To</Text>
        <Text style={[styles.value, { fontWeight: "bold", fontSize: 12, color: "#111" }]}>{customer?.name || invoice.customer_name || "Customer"}</Text>
        {customer?.email && <Text style={styles.value}>{customer.email}</Text>}
        {customer?.phone && <Text style={styles.value}>{customer.phone}</Text>}
      </View>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableColHeaderDesc}><Text style={styles.tableCellHeader}>Description</Text></View>
          <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Qty</Text></View>
          <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Price</Text></View>
          <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Amount</Text></View>
        </View>
        {items.map((item: any, i: number) => (
          <View style={styles.tableRow} key={i}>
            <View style={styles.tableColDesc}><Text style={styles.tableCell}>{item.description}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{item.quantity}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>Rs. {item.price}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>Rs. {(item.quantity * item.price).toFixed(2)}</Text></View>
          </View>
        ))}
      </View>

      <View style={styles.totals}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={styles.totalValue}>Rs. {invoice.subtotal}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tax (GST)</Text>
          <Text style={styles.totalValue}>Rs. {invoice.tax}</Text>
        </View>
        {invoice.discount > 0 && (
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Discount</Text>
            <Text style={styles.totalValue}>- Rs. {invoice.discount}</Text>
          </View>
        )}
        <View style={styles.grandTotal}>
          <Text style={styles.grandTotalLabel}>Total</Text>
          <Text style={styles.grandTotalValue}>Rs. {invoice.amount}</Text>
        </View>
      </View>

      <Text style={styles.footer}>Thank you for your business. For any queries, please contact support@smartbizos.com.</Text>
    </Page>
  </Document>
);

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Fetch Invoice
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (invoiceError || !invoice) {
    return new NextResponse("Invoice not found", { status: 404 });
  }

  // Fetch Items
  const { data: items } = await supabase
    .from("invoice_items")
    .select("*")
    .eq("invoice_id", id);

  // Fetch Customer
  let customer = null;
  if (invoice.customer_id) {
    const { data: custData } = await supabase
      .from("customers")
      .select("*")
      .eq("id", invoice.customer_id)
      .single();
    customer = custData;
  }

  try {
    const stream = await renderToStream(
      <InvoiceDocument invoice={invoice} customer={customer} items={items || []} />
    );
    
    // Create a streaming response
    return new NextResponse(stream as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Invoice-${invoice.invoice_number}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation failed:", error);
    return new NextResponse("PDF generation failed", { status: 500 });
  }
}
