"use client";

import { useState, useTransition } from "react";
import { Plus, Folder, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { addCategory, editCategory, deleteCategory } from "./actions";
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

type Category = {
  id: string;
  name: string;
};

export function CategoriesClient({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      startTransition(async () => {
        try {
          await deleteCategory(id);
          setCategories((prev) => prev.filter((c) => c.id !== id));
          toast.success("Category deleted");
        } catch (e: unknown) {
          toast.error((e as Error).message || "Failed to delete");
        }
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("name", name);

        if (editingCategory) {
          formData.append("id", editingCategory.id);
          await editCategory(formData);
          setCategories((prev) =>
            prev.map((c) => (c.id === editingCategory.id ? { ...c, name } : c))
          );
          toast.success("Category updated");
        } else {
          await addCategory(formData);
          // To get the ID, we'd normally re-fetch or return it from the action.
          // For now, we rely on the server action's revalidatePath which will
          // refresh the page data if we are using server components properly.
          // However, since we're using useState, let's just trigger a reload or fake it.
          // In Next.js App Router, revalidatePath doesn't instantly update client state
          // if we manage it locally. Better approach is to rely on the server prop.
          // Wait, initialCategories is passed from the server. If we just let the server
          // re-render us, we don't need to manage state!
          
          window.location.reload(); // Simple approach for now
        }
        setIsModalOpen(false);
      } catch (e: unknown) {
        toast.error((e as Error).message || "Failed to save category");
      }
    });
  };

  return (
    <div className="p-8 h-[calc(100vh-64px)] overflow-auto bg-slate-950 text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Folder className="w-8 h-8 text-blue-500" />
            Categories
          </h1>
          <p className="text-slate-400 mt-1">Manage product categories</p>
        </div>
        <Button onClick={handleOpenAdd} className="bg-blue-600 hover:bg-blue-500">
          <Plus className="w-4 h-4 mr-2" /> Add Category
        </Button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950 text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">Category Name</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4">{cat.name}</td>
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
                      <DropdownMenuItem onClick={() => handleOpenEdit(cat)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(cat.id)} className="text-red-500">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={2} className="px-6 py-8 text-center text-slate-500">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-slate-900 text-white border-slate-800 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Electronics"
                className="bg-slate-950 border-slate-800 text-white"
                required
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
