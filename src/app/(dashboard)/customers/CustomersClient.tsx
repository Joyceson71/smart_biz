"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, Edit, Trash2, Users, Activity, DollarSign } from "lucide-react";
import { addCustomer, updateCustomer, deleteCustomer } from "./actions";
import { motion, Variants } from "framer-motion";

export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  ltv: number;
  status: string;
}

export default function CustomersClient({ initialCustomers }: { initialCustomers: Customer[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredCustomers = initialCustomers.filter(c => 
    c.first_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalCustomers = initialCustomers.length;
  const activeCustomers = initialCustomers.filter(c => c.status === "Active").length;
  const avgLtv = totalCustomers > 0 
    ? initialCustomers.reduce((acc, curr) => acc + (curr.ltv || 0), 0) / totalCustomers 
    : 0;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex flex-col h-full p-6 text-slate-200">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-end mb-6"
      >
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-[0_2px_10px_rgba(168,85,247,0.2)]">
            Client Network
          </h1>
          <p className="text-purple-400 font-bold mt-1 tracking-wide uppercase text-xs">
            Manage your customer database
          </p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger render={(props) => (
            <Button {...props} className="gap-2 clay-btn-primary px-6 py-3 h-auto">
              <Plus className="w-4 h-4" /> Initialize Client
            </Button>
          )} />
          <DialogContent className="neo-flat border-white/10 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-black text-purple-400">Add New Client</DialogTitle>
            </DialogHeader>
            <form action={async (formData) => {
              setIsSubmitting(true);
              try {
                await addCustomer(formData);
                setIsAddOpen(false);
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
          </DialogContent>
        </Dialog>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
      >
        <motion.div variants={itemVariants} className="clay-card p-6 relative overflow-hidden group cursor-pointer">
           <div className="absolute -right-10 -top-10 w-32 h-32 bg-purple-500/20 blur-[50px] rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-700" />
           <div className="flex justify-between items-start relative z-10">
              <div className="w-12 h-12 neo-flat rounded-2xl flex items-center justify-center text-purple-400 shadow-[inset_0_0_15px_rgba(168,85,247,0.2)]">
                <Users className="w-6 h-6" />
              </div>
              <p className="text-4xl font-black text-white tracking-tighter">{totalCustomers}</p>
           </div>
           <h3 className="text-purple-300 text-xs font-black uppercase tracking-widest mt-4 relative z-10 drop-shadow-md">
             Total Network
           </h3>
        </motion.div>

        <motion.div variants={itemVariants} className="clay-card p-6 relative overflow-hidden group cursor-pointer">
           <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-emerald-500/20 blur-[50px] rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-700" />
           <div className="flex justify-between items-start relative z-10">
              <div className="w-12 h-12 neo-flat rounded-2xl flex items-center justify-center text-emerald-400 shadow-[inset_0_0_15px_rgba(16,185,129,0.2)]">
                <Activity className="w-6 h-6" />
              </div>
              <p className="text-4xl font-black text-white tracking-tighter">{activeCustomers}</p>
           </div>
           <h3 className="text-emerald-300 text-xs font-black uppercase tracking-widest mt-4 relative z-10 drop-shadow-md">
             Active Nodes
           </h3>
        </motion.div>

        <motion.div variants={itemVariants} className="clay-card p-6 relative overflow-hidden group cursor-pointer">
           <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-blue-500/20 blur-[50px] rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-700" />
           <div className="flex justify-between items-start relative z-10">
              <div className="w-12 h-12 neo-flat rounded-2xl flex items-center justify-center text-blue-400 shadow-[inset_0_0_15px_rgba(59,130,246,0.2)]">
                <DollarSign className="w-6 h-6" />
              </div>
              <p className="text-4xl font-black text-white tracking-tighter">${avgLtv.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
           </div>
           <h3 className="text-blue-300 text-xs font-black uppercase tracking-widest mt-4 relative z-10 drop-shadow-md">
             Avg Lifetime Value
           </h3>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="clay-card flex-1 flex flex-col overflow-hidden"
      >
        <div className="p-6 border-b border-white/5">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              type="text" 
              placeholder="Search network..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 neo-pressed border-white/5 text-white h-12 rounded-2xl"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-2">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-white/5 hover:bg-transparent">
                <TableHead className="text-slate-400 font-bold uppercase tracking-wider text-xs">Identity</TableHead>
                <TableHead className="text-slate-400 font-bold uppercase tracking-wider text-xs">Comms</TableHead>
                <TableHead className="text-slate-400 font-bold uppercase tracking-wider text-xs">Status</TableHead>
                <TableHead className="text-slate-400 font-bold uppercase tracking-wider text-xs text-right">LTV</TableHead>
                <TableHead className="text-slate-400 font-bold uppercase tracking-wider text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow className="border-none hover:bg-transparent">
                  <TableCell colSpan={5} className="text-center py-12 text-slate-500 font-bold">
                    No nodes match your query.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-default">
                    <TableCell className="font-black text-white">
                      {customer.first_name} {customer.last_name}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-300">{customer.email || "-"}</span>
                        <span className="text-xs text-slate-500 font-medium">{customer.phone || "-"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        customer.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        customer.status === 'New' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {customer.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-black text-slate-200">
                      ${customer.ltv?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          className="h-8 w-8 neo-flat rounded-lg hover:text-blue-400"
                          size="icon"
                          onClick={() => setEditingCustomer(customer)}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button 
                          className="h-8 w-8 neo-flat rounded-lg hover:text-red-400"
                          size="icon"
                          onClick={async () => {
                            if (confirm("Eradicate this node from the network?")) {
                              await deleteCustomer(customer.id);
                            }
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      <Dialog open={!!editingCustomer} onOpenChange={(open) => !open && setEditingCustomer(null)}>
        <DialogContent className="neo-flat border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-blue-400">Configure Node</DialogTitle>
          </DialogHeader>
          {editingCustomer && (
            <form action={async (formData) => {
              setIsSubmitting(true);
              try {
                formData.append("id", editingCustomer.id);
                await updateCustomer(formData);
                setEditingCustomer(null);
              } finally {
                setIsSubmitting(false);
              }
            }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_first_name" className="text-slate-400">First Name</Label>
                  <Input id="edit_first_name" name="first_name" defaultValue={editingCustomer.first_name} required className="neo-pressed border-white/5 text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_last_name" className="text-slate-400">Last Name</Label>
                  <Input id="edit_last_name" name="last_name" defaultValue={editingCustomer.last_name} required className="neo-pressed border-white/5 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_email" className="text-slate-400">Email</Label>
                <Input id="edit_email" name="email" type="email" defaultValue={editingCustomer.email || ""} required className="neo-pressed border-white/5 text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_phone" className="text-slate-400">Phone</Label>
                <Input id="edit_phone" name="phone" defaultValue={editingCustomer.phone || ""} className="neo-pressed border-white/5 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_status" className="text-slate-400">Status</Label>
                  <select 
                    id="edit_status" 
                    name="status" 
                    defaultValue={editingCustomer.status}
                    className="flex h-10 w-full rounded-md border border-white/5 neo-pressed px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 text-white"
                  >
                    <option value="New" className="bg-slate-900 text-white">New</option>
                    <option value="Active" className="bg-slate-900 text-white">Active</option>
                    <option value="Inactive" className="bg-slate-900 text-white">Inactive</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_ltv" className="text-slate-400">LTV ($)</Label>
                  <Input id="edit_ltv" name="ltv" type="number" defaultValue={editingCustomer.ltv} min="0" step="0.01" className="neo-pressed border-white/5 text-white" />
                </div>
              </div>
              <Button type="submit" className="w-full clay-btn-primary mt-4" disabled={isSubmitting}>
                {isSubmitting ? "Syncing..." : "Commit Changes"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
