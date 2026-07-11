import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { scanWithOCRSpace } from "@/lib/ocr/ocrspace";
import { parseInvoiceText } from "@/lib/ocr/parser";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 1. Upload to Supabase Storage temporarily
    const fileName = `${user.id}/${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("invoices")
      .upload(fileName, file);

    if (uploadError) {
      throw uploadError;
    }

    // 2. Get public URL for OCR.space
    const { data: { publicUrl } } = supabase.storage
      .from("invoices")
      .getPublicUrl(fileName);

    // 3. Run OCR (Mocked or actual depending on env)
    let rawText = "";
    if (process.env.OCR_SPACE_API_KEY) {
       rawText = await scanWithOCRSpace(publicUrl);
    } else {
       // Mock for hackathon if no key provided
       rawText = "Tech Solutions India Pvt Ltd\nInvoice No: INV-AWS-24-001\nDate: 01/07/2024\nTotal: 15000.00\nTax: 2700.00";
    }

    // 4. Parse the text
    const structuredData = parseInvoiceText(rawText);

    return NextResponse.json({
      success: true,
      fileUrl: publicUrl,
      rawText,
      data: structuredData
    });

  } catch (error: any) {
    console.error("OCR API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process invoice" },
      { status: 500 }
    );
  }
}
