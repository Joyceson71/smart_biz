"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateCustomer } from "./actions";
import type { Customer } from "./CustomersClient";

export function EditCustomerForm({ customer, onSuccess }: { customer: Customer, onSuccess: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form action={async (formData) => {
      setIsSubmitting(true);
      try {
        formData.append("id", customer.id);
        await updateCustomer(formData);
        onSuccess();
      } finally {
        setIsSubmitting(false);
      }
    }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit_first_name" className="text-slate-400">First Name</Label>
          <Input id="edit_first_name" name="first_name" defaultValue={customer.first_name} required className="neo-pressed border-white/5 text-white" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit_last_name" className="text-slate-400">Last Name</Label>
          <Input id="edit_last_name" name="last_name" defaultValue={customer.last_name} required className="neo-pressed border-white/5 text-white" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit_email" className="text-slate-400">Email</Label>
        <Input id="edit_email" name="email" type="email" defaultValue={customer.email || ""} required className="neo-pressed border-white/5 text-white" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit_phone" className="text-slate-400">Phone</Label>
        <Input id="edit_phone" name="phone" defaultValue={customer.phone || ""} className="neo-pressed border-white/5 text-white" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit_status" className="text-slate-400">Status</Label>
          <select 
            id="edit_status" 
            name="status" 
            defaultValue={customer.status}
            className="flex h-10 w-full rounded-md border border-white/5 neo-pressed px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 text-white"
          >
            <option value="New" className="bg-slate-900 text-white">New</option>
            <option value="Active" className="bg-slate-900 text-white">Active</option>
            <option value="Inactive" className="bg-slate-900 text-white">Inactive</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit_ltv" className="text-slate-400">LTV ($)</Label>
          <Input id="edit_ltv" name="ltv" type="number" defaultValue={customer.ltv} min="0" step="0.01" className="neo-pressed border-white/5 text-white" />
        </div>
      </div>
      <Button type="submit" className="w-full clay-btn-primary mt-4" disabled={isSubmitting}>
        {isSubmitting ? "Syncing..." : "Commit Changes"}
      </Button>
    </form>
  );
}
