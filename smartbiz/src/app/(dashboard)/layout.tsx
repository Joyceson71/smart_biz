import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileNav } from "@/components/layout/mobile-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area — offset by sidebar width */}
      <div className="lg:pl-[260px] transition-all duration-300 flex flex-col min-h-screen">
        <Topbar />

        <main className="flex-1 p-4 md:p-6 pb-20 lg:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav (visible only < lg) */}
      <MobileNav />
    </div>
  );
}
