'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signup } from "../actions";
import { useState, useTransition } from "react";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await signup(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Create an account
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Enter your details to get started with SmartBiz
        </p>
      </div>
      <form action={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm font-medium text-red-500 bg-red-100/10 border border-red-500/20 rounded-md">
            {error}
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="first-name">
              First name
            </label>
            <Input id="first-name" name="first-name" placeholder="John" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="last-name">
              Last name
            </label>
            <Input id="last-name" name="last-name" placeholder="Doe" required />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
            Email
          </label>
          <Input id="email" name="email" placeholder="m@example.com" required type="email" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
            Password
          </label>
          <Input id="password" name="password" required type="password" />
        </div>
        <Button disabled={isPending} className="w-full bg-blue-600 hover:bg-blue-700 text-white" type="submit">
          {isPending ? "Creating account..." : "Create account"}
        </Button>
      </form>
      <div className="text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400">
          Sign in
        </Link>
      </div>
    </div>
  );
}
