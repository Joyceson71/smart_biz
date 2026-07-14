import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const ocrApiKey = process.env.OCRSPACE_API_KEY;
    if (!ocrApiKey) {
      console.warn("OCRSPACE_API_KEY not found. Falling back to mock data.");
      // Fallback mock if no API key is provided
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return NextResponse.json({ data: getMockData() }, { status: 200 });
    }

    // 1. Extract Text using OCRSpace (Handles PDF & Images natively)
    const ocrFormData = new FormData();
    ocrFormData.append("file", file);
    ocrFormData.append("apikey", ocrApiKey);
    ocrFormData.append("language", "eng");
    ocrFormData.append("isTable", "true");

    const ocrRes = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      body: ocrFormData,
    });
    
    if (!ocrRes.ok) {
      throw new Error(`OCR Space API responded with status ${ocrRes.status}`);
    }
    
    const ocrData = await ocrRes.json();
    if (ocrData.IsErroredOnProcessing) {
      throw new Error(ocrData.ErrorMessage?.[0] || "OCR Processing failed");
    }

    const parsedText = ocrData.ParsedResults?.map((pr: { ParsedText: string }) => pr.ParsedText).join("\n") || "";
    
    if (!parsedText || parsedText.trim().length === 0) {
      return NextResponse.json({ error: "No text could be extracted from the file." }, { status: 400 });
    }

    // 2. Parse structured data using OpenAI via Vercel AI SDK
    const schema = z.object({
      supplier_name: z.string().describe("The name of the vendor/supplier. If not found, use 'Unknown Supplier'"),
      invoice_number: z.string().describe("Invoice or Bill number. Generate a random one like INV-XXXX if missing."),
      date: z.string().describe("Invoice date in YYYY-MM-DD format."),
      items: z.array(z.object({
        sku: z.string().describe("Stock Keeping Unit. If none found, generate a short logical one based on name"),
        name: z.string().describe("Product name"),
        quantity: z.number().describe("Quantity purchased"),
        purchase_price: z.number().describe("Unit price of the item"),
        selling_price: z.number().describe("Estimate a retail selling price (usually 30-50% margin) if not explicitly present"),
      })),
      subtotal: z.number(),
      tax: z.number(),
      total: z.number()
    });

    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: schema,
      prompt: `Extract the invoice details from the following OCR text. Ensure all fields are filled. If some numerical values are missing, make a logical guess or set to 0.\n\nOCR TEXT:\n${parsedText}`
    });

    return NextResponse.json({ data: object }, { status: 200 });
  } catch (error) {
    console.error("OCR Extraction Error:", error);
    return NextResponse.json({ error: "Failed to extract data from invoice" }, { status: 500 });
  }
}

function getMockData() {
  return {
    supplier_name: "TechNova Distributors Ltd.",
    invoice_number: `TN-${Math.floor(Math.random() * 10000)}`,
    date: new Date().toISOString().split("T")[0],
    items: [
      { sku: "TN-KB-01", name: "Mechanical Keyboard (Blue Switches)", quantity: 50, purchase_price: 2500, selling_price: 4500 },
      { sku: "TN-MS-02", name: "Ergonomic Wireless Mouse", quantity: 120, purchase_price: 800, selling_price: 1500 },
    ],
    subtotal: 221000,
    tax: 39780,
    total: 260780
  };
}
