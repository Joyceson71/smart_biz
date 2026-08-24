"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addCustomer } from "./actions";

export function AddCustomerForm({ onSuccess }: { onSuccess: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form action={async (formData) => {
      setIsSubmitting(true);
      try {
        await addCustomer(formData);
        onSuccess();
      } finally {
        setIsSubmitting(false);
      }
    }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name" className="text-slate-400">First Name</Label>
          <Input id="first_name" name="first_name" required className="neo-pressed border-white/5 text-white" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name" className="text-slate-400">Last Name</Label>
          <Input id="last_name" name="last_name" required className="neo-pressed border-white/5 text-white" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-slate-400">Email</Label>
        <Input id="email" name="email" type="email" required className="neo-pressed border-white/5 text-white" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-slate-400">Phone</Label>
        <Input id="phone" name="phone" className="neo-pressed border-white/5 text-white" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ltv" className="text-slate-400">Initial LTV ($)</Label>
        <Input id="ltv" name="ltv" type="number" defaultValue="0" min="0" step="0.01" className="neo-pressed border-white/5 text-white" />
      </div>
      <Button type="submit" className="w-full clay-btn-primary mt-4" disabled={isSubmitting}>
        {isSubmitting ? "Processing..." : "Add Client"}
      </Button>
    </form>
  );
}
