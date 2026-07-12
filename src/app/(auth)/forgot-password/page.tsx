import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Reset password
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Enter your email address and we will send you a password reset link.
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
            Email
          </label>
          <Input id="email" placeholder="m@example.com" required type="email" />
        </div>
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" type="button">
          Send reset link
        </Button>
      </div>
      <div className="text-center text-sm text-slate-500 dark:text-slate-400">
        Remember your password?{" "}
        <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400">
          Back to login
        </Link>
      </div>
    </div>
  );
}
