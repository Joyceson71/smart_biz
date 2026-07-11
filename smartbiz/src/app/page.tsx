import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white overflow-hidden">
      {/* ── Navigation ───────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center font-bold text-sm">S</div>
          <span className="font-semibold text-lg">SmartBiz</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href={ROUTES.LOGIN} className="text-sm text-white/70 hover:text-white transition-colors px-4 py-2">
            Sign In
          </Link>
          <Link
            href={ROUTES.REGISTER}
            className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 pt-20">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-purple-600/15 rounded-full blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Built for MSME Idea Hackathon 6.0
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Your Business,{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Intelligently Managed
            </span>
          </h1>

          <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
            SmartBiz replaces 5+ disconnected tools with one AI-powered platform.
            OCR invoices, chat with your data, and forecast cash flow — built for Indian MSMEs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href={ROUTES.REGISTER}
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-lg transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25"
            >
              Start Free — No Credit Card
            </Link>
            <Link
              href={ROUTES.DASHBOARD}
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl font-semibold text-lg transition-all backdrop-blur-sm"
            >
              View Demo Dashboard →
            </Link>
          </div>

          {/* ── Feature Pills ──────────────────────────────────────────── */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-white/50">
            {["Invoice OCR", "AI Chat Assistant", "GST Reports", "Cash Flow Forecast", "Multi-user RBAC", "Realtime Notifications"].map((f) => (
              <span key={f} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                ✓ {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature Grid ─────────────────────────────────────────────────── */}
      <section className="relative px-6 py-24 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">
          Everything an MSME needs, nothing it doesn&apos;t
        </h2>
        <p className="text-center text-white/50 mb-16 max-w-2xl mx-auto">
          Purpose-built for business owners who are not accountants. Jargon-free, mobile-first, affordable.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: "📄",
              title: "OCR Invoice Scanning",
              desc: "Upload any invoice — PDF or photo. AI extracts all data in seconds. Zero typing required.",
            },
            {
              icon: "🤖",
              title: "AI Business Assistant",
              desc: "Ask questions in plain English: 'Who owes me the most?' or 'Show my top expenses this month'.",
            },
            {
              icon: "💸",
              title: "Cash Flow Forecast",
              desc: "See exactly what's coming in and going out for the next 30 days. Never be surprised by cash gaps.",
            },
            {
              icon: "📊",
              title: "GST-Ready Reports",
              desc: "Auto-generate P&L, GST summaries, and AR aging reports. Export PDF in one click.",
            },
            {
              icon: "👥",
              title: "Team Roles & RBAC",
              desc: "Add your accountant as Accountant, staff as Viewer. Fine-grained permission control.",
            },
            {
              icon: "🔔",
              title: "Smart Reminders",
              desc: "Automatic payment reminders. Know when invoices are overdue before they become problems.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/8 hover:border-white/20 transition-all group"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-300 transition-colors">
                {feature.title}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="px-6 py-24 text-center">
        <div className="max-w-2xl mx-auto p-12 rounded-3xl bg-blue-600/10 border border-blue-500/20">
          <h2 className="text-3xl font-bold mb-4">Ready to transform your business?</h2>
          <p className="text-white/60 mb-8">
            Join MSMEs across India using SmartBiz to manage their finances intelligently.
          </p>
          <Link
            href={ROUTES.REGISTER}
            className="inline-block px-10 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-lg transition-all hover:scale-[1.02]"
          >
            Start Free Today →
          </Link>
          <p className="text-white/30 text-sm mt-4">No credit card. Freemium forever for micro-businesses.</p>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/10 px-6 py-8 text-center text-white/30 text-sm">
        <p>© 2024 SmartBiz. Built for MSME Idea Hackathon 6.0 with ❤️ in India.</p>
      </footer>
    </main>
  );
}
