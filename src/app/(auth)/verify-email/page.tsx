import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Mail } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center">
          <Mail className="w-8 h-8 text-blue-500" />
        </div>
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Check your email
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          We&apos;ve sent a verification link to your email address. Please click the link to verify your account.
        </p>
      </div>
      <div className="pt-4 space-y-4">
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" type="button">
          Open Email App
        </Button>
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Didn&apos;t receive the email?{" "}
          <button className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400">
            Click to resend
          </button>
        </div>
      </div>
      <div className="pt-4 text-sm">
        <Link href="/login" className="font-semibold text-slate-600 hover:text-slate-500 dark:text-slate-400">
          Back to login
        </Link>
      </div>
    </div>
  );
}
