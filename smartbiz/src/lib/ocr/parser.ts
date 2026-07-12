/**
 * Parse raw OCR text into structured invoice data using Regex heuristics.
 * For a production system, this is usually combined with an LLM pass for higher accuracy.
 */
export function parseInvoiceText(rawText: string) {
  const data: any = {
    invoiceNumber: null,
    date: null,
    totalAmount: null,
    taxAmount: null,
    vendorName: null,
  };

  const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  // 1. Heuristic for Invoice Number
  const invNumberMatch = rawText.match(/(?:invoice\s*(?:no|number|#)?[:\s-]*)([A-Z0-9-]+)/i);
  if (invNumberMatch) {
    data.invoiceNumber = invNumberMatch[1];
  }

  // 2. Heuristic for Date (DD/MM/YYYY or similar)
  const dateMatch = rawText.match(/\b(\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4})\b/);
  if (dateMatch) {
    data.date = dateMatch[1];
  }

  // 3. Heuristic for Total Amount
  // Look for "Total" followed by currency/numbers
  const totalMatch = rawText.match(/(?:total|amount due|grand total)[^\d]*((?:\d{1,3}(?:,\d{3})*|\d+)(?:\.\d{2})?)/i);
  if (totalMatch && totalMatch[1]) {
    data.totalAmount = parseFloat(totalMatch[1].replace(/,/g, ''));
  }

  // 4. Heuristic for Vendor Name (Usually the first line or two)
  if (lines.length > 0) {
    data.vendorName = lines[0]; // Naive approach
  }

  return data;
}
