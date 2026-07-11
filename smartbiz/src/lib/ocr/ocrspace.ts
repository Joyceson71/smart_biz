export async function scanWithOCRSpace(fileUrl: string) {
  const apiKey = process.env.OCR_SPACE_API_KEY || "helloworld";
  
  // Note: OCR.space free tier requires accessible URLs or base64.
  // In production, we'd pass base64 or a signed URL.
  const response = await fetch("https://api.ocr.space/parse/imageurl?apikey=" + apiKey + "&url=" + encodeURIComponent(fileUrl), {
    method: "GET",
  });

  const data = await response.json();
  
  if (data.IsErroredOnProcessing) {
    throw new Error(data.ErrorMessage?.[0] || "OCR processing failed");
  }

  // Combine all lines of text from all pages
  let rawText = "";
  if (data.ParsedResults) {
    data.ParsedResults.forEach((page: any) => {
      rawText += page.ParsedText + "\n";
    });
  }

  return rawText;
}
