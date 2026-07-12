import { Shield, Sparkles } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex selection:bg-blue-500/30">
      {/* Left side - Auth Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-1/2 xl:px-24 bg-white dark:bg-slate-950">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              SmartBiz
            </span>
          </div>
          {children}
        </div>
      </div>

      {/* Right side - Branding Graphic */}
      <div className="relative hidden w-0 flex-1 lg:block bg-slate-50 dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 h-full w-full object-cover p-12">
          <div className="h-full w-full bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-12 flex flex-col justify-between relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-400/20 blur-3xl rounded-full pointer-events-none" />
            
            <div className="relative z-10 flex gap-2 text-blue-100 items-center font-medium">
              <Shield className="w-5 h-5" />
              <span>Bank-grade security infrastructure</span>
            </div>

            <div className="relative z-10">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Sparkles key={i} className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                ))}
              </div>
              <blockquote className="text-3xl font-semibold leading-tight text-white mb-6">
                &quot;SmartBiz has completely transformed how we handle our finances. 
                Invoicing is a breeze, and our cash flow has never been clearer.&quot;
              </blockquote>
              <div className="text-blue-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-400/30 flex items-center justify-center font-bold text-white">
                  AT
                </div>
                <div>
                  <div className="font-semibold text-white">Alex Thompson</div>
                  <div className="text-sm">Founder, DesignCo</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
