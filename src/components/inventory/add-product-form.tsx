"use client";

import { useState } from "react";
// No react-form-hook
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm as useReactHookForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { addInventoryItem } from "@/app/(dashboard)/inventory/actions";

const formSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters."),
  sku: z.string().min(2, "SKU is required."),
  barcode: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  purchase_price: z.coerce.number().min(0),
  selling_price: z.coerce.number().min(0),
  stock: z.coerce.number().min(0),
  min_stock: z.coerce.number().min(0),
  max_stock: z.coerce.number().min(0),
  unit: z.string().default("pcs"),
});

export function AddProductForm({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useReactHookForm<z.infer<typeof formSchema>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: "",
      sku: "",
      barcode: "",
      category: "",
      description: "",
      purchase_price: 0,
      selling_price: 0,
      stock: 0,
      min_stock: 5,
      max_stock: 100,
      unit: "pcs",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (step < 2) {
      nextStep();
      return;
    }
    
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
      // the existing addInventoryItem takes FormData (sku, name, quantity, reorder_level)
      // I should update actions.ts next to support the new schema.
      await addInventoryItem(formData); 
      
      toast.success("Product added successfully!");
      onOpenChange(false);
      form.reset();
      setStep(1);
    } catch (e) {
      console.error(e);
      toast.error("Failed to add product.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const nextStep = async () => {
    // Validate current step fields
    const fieldsToValidate: (keyof z.infer<typeof formSchema>)[] = step === 1 
      ? ["name", "sku", "barcode", "category", "description"] 
      : ["purchase_price", "selling_price", "stock", "min_stock", "max_stock", "unit"];
      
    const isStepValid = await form.trigger(fieldsToValidate);
    if (isStepValid) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <Dialog open={!!open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-slate-950 border-slate-800 text-white shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Add New Product</DialogTitle>
          <DialogDescription className="text-slate-400">
            {step === 1 ? "Step 1: General Information" : "Step 2: Inventory & Pricing"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Wireless Mouse" className="bg-slate-900 border-slate-800" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="sku"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SKU *</FormLabel>
                          <FormControl>
                            <Input placeholder="WM-001" className="bg-slate-900 border-slate-800" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="barcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Barcode</FormLabel>
                          <FormControl>
                            <Input placeholder="890123456789" className="bg-slate-900 border-slate-800" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Product details..." className="bg-slate-900 border-slate-800 resize-none" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="purchase_price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Purchase Price (₹)</FormLabel>
                          <FormControl>
                            <Input type="number" className="bg-slate-900 border-slate-800" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="selling_price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Selling Price (₹)</FormLabel>
                          <FormControl>
                            <Input type="number" className="bg-slate-900 border-slate-800" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Opening Stock</FormLabel>
                          <FormControl>
                            <Input type="number" className="bg-slate-900 border-slate-800" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="min_stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Min Stock Alert</FormLabel>
                          <FormControl>
                            <Input type="number" className="bg-slate-900 border-slate-800" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="unit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit Measure</FormLabel>
                          <FormControl>
                            <Input placeholder="pcs, kg, lit" className="bg-slate-900 border-slate-800" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between mt-8 pt-4 border-t border-slate-800">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={prevStep} className="bg-slate-900 border-slate-800 text-white hover:bg-slate-800">
                  Back
                </Button>
              ) : (
                <div />
              )}
              
              {step < 2 ? (
                <Button type="button" onClick={nextStep} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Next Step
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {isSubmitting ? "Saving..." : "Save Product"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
