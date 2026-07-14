import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Simulate AI Processing delay (OCR + GPT parsing)
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Return a structured JSON of extracted supplier invoice data
    const extractedData = {
      supplier_name: "TechNova Distributors Ltd.",
      invoice_number: `TN-${Math.floor(Math.random() * 10000)}`,
      date: new Date().toISOString().split("T")[0],
      items: [
        {
          sku: "TN-KB-01",
          name: "Mechanical Keyboard (Blue Switches)",
          quantity: 50,
          purchase_price: 2500,
          selling_price: 4500,
        },
        {
          sku: "TN-MS-02",
          name: "Ergonomic Wireless Mouse",
          quantity: 120,
          purchase_price: 800,
          selling_price: 1500,
        },
        {
          sku: "TN-MN-03",
          name: "27-inch 4K Monitor",
          quantity: 15,
          purchase_price: 18000,
          selling_price: 25000,
        }
      ],
      subtotal: 491000,
      tax: 88380,
      total: 579380
    };

    return NextResponse.json({ data: extractedData }, { status: 200 });
  } catch (error) {
    console.error("OCR Extraction Error:", error);
    return NextResponse.json({ error: "Failed to extract data from invoice" }, { status: 500 });
  }
}
