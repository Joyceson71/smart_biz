"use client";

import { useState, useTransition, useEffect } from "react";
import { Plus, Truck, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { addSupplier, editSupplier, deleteSupplier } from "./actions";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Supplier = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  gst_number: string | null;
};

export function SuppliersClient({ initialSuppliers }: { initialSuppliers: Supplier[] }) {
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Keep state in sync with props
  useEffect(() => {
    setSuppliers(initialSuppliers);
  }, [initialSuppliers]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gst_number: "",
  });

  const handleOpenAdd = () => {
    setEditingSupplier(null);
    setFormData({ name: "", email: "", phone: "", gst_number: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sup: Supplier) => {
    setEditingSupplier(sup);
    setFormData({
      name: sup.name,
      email: sup.email || "",
      phone: sup.phone || "",
      gst_number: sup.gst_number || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this supplier?")) {
      startTransition(async () => {
        try {
          await deleteSupplier(id);
          toast.success("Supplier deleted");
          router.refresh();
        } catch (e: unknown) {
          toast.error((e as Error).message || "Failed to delete");
        }
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    startTransition(async () => {
      try {
        const data = new FormData();
        data.append("name", formData.name);
        data.append("email", formData.email);
        data.append("phone", formData.phone);
        data.append("gst_number", formData.gst_number);

        if (editingSupplier) {
          data.append("id", editingSupplier.id);
          await editSupplier(data);
          toast.success("Supplier updated");
        } else {
          await addSupplier(data);
          toast.success("Supplier added");
        }
        setIsModalOpen(false);
        router.refresh();
      } catch (e: unknown) {
        toast.error((e as Error).message || "Failed to save supplier");
      }
    });
  };

  return (
    <div className="p-8 h-[calc(100vh-64px)] overflow-auto bg-slate-950 text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Truck className="w-8 h-8 text-amber-500" />
            Suppliers
          </h1>
          <p className="text-slate-400 mt-1">Manage where your products come from</p>
        </div>
        <Button onClick={handleOpenAdd} className="bg-blue-600 hover:bg-blue-500">
          <Plus className="w-4 h-4 mr-2" /> Add Supplier
        </Button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950 text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Contact</th>
              <th className="px-6 py-4 font-medium">GST Number</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {suppliers.map((sup) => (
              <tr key={sup.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 font-medium">{sup.name}</td>
                <td className="px-6 py-4 text-slate-400">
                  {sup.email && <div>{sup.email}</div>}
                  {sup.phone && <div>{sup.phone}</div>}
                  {!sup.email && !sup.phone && "-"}
                </td>
                <td className="px-6 py-4 text-slate-400">{sup.gst_number || "-"}</td>
                <td className="px-6 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger render={(props) => (
                      <Button {...props} variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    )}>
                      <span className="sr-only">Open menu</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-white">
                      <DropdownMenuItem onClick={() => handleOpenEdit(sup)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(sup.id)} className="text-red-500">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
            {suppliers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  No suppliers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-slate-900 text-white border-slate-800 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingSupplier ? "Edit Supplier" : "Add Supplier"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Acme Corp"
                className="bg-slate-950 border-slate-800 text-white"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Email (Optional)</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="sales@acme.com"
                className="bg-slate-950 border-slate-800 text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Phone (Optional)</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 555-1234"
                className="bg-slate-950 border-slate-800 text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">GST Number (Optional)</label>
              <Input
                value={formData.gst_number}
                onChange={(e) => setFormData({ ...formData, gst_number: e.target.value })}
                placeholder="GSTIN"
                className="bg-slate-950 border-slate-800 text-white"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-500">
                {isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
