import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { ToastProvider } from "@/components/providers/toast-provider";

export const metadata: Metadata = {
  title: {
    default: "SmartBiz — AI-Powered Business Management for MSMEs",
    template: "%s | SmartBiz",
  },
  description:
    "SmartBiz replaces spreadsheets, manual ledgers, and paper invoices with one intelligent platform. OCR invoice scanning, AI business insights, and real-time cash flow — built for Indian MSMEs.",
  keywords: ["MSME", "invoice management", "GST", "accounting", "AI bookkeeping", "cash flow"],
  authors: [{ name: "SmartBiz Team" }],
  creator: "SmartBiz",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: "SmartBiz — AI-Powered Business Management",
    description: "The intelligent platform for Indian MSMEs",
    siteName: "SmartBiz",
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartBiz",
    description: "AI-powered business management for MSMEs",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider>
          <QueryProvider>
            {children}
            <ToastProvider />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
