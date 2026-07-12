import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function ResetPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Set new password
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Please enter your new password below.
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
            New Password
          </label>
          <Input id="password" required type="password" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="confirm-password">
            Confirm Password
          </label>
          <Input id="confirm-password" required type="password" />
        </div>
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" type="button">
          Update password
        </Button>
      </div>
      <div className="text-center text-sm text-slate-500 dark:text-slate-400">
        <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400">
          Back to login
        </Link>
      </div>
    </div>
  );
}
