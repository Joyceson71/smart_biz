"use client";

import { useState } from "react";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { addInvoice } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Initial empty line item
const emptyItem = { id: Date.now(), description: "", quantity: 1, price: 0, gst: 18 };

export default function NewInvoicePage() {
  const router = useRouter();
  const [items, setItems] = useState([emptyItem]);
  const [customer, setCustomer] = useState({ name: "", email: "", address: "", gst: "" });
  const [details, setDetails] = useState({ number: "INV-001", date: new Date().toISOString().split("T")[0], dueDate: "" });
  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live calculations
  const subtotal = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const totalGst = items.reduce((acc, item) => acc + (item.quantity * item.price * (item.gst / 100)), 0);
  const total = subtotal + totalGst + Number(shipping) - Number(discount);

  const addItem = () => setItems([...items, { ...emptyItem, id: Date.now() }]);
  
  const updateItem = (id: number, field: string, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };
  
  const removeItem = (id: number) => {
    if (items.length > 1) setItems(items.filter(item => item.id !== id));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("invoice_number", details.number);
      formData.append("due_date", details.dueDate);
      formData.append("customer_name", customer.name);
      formData.append("customer_email", customer.email);
      formData.append("customer_address", customer.address);
      formData.append("gst_number", customer.gst);
      formData.append("subtotal", subtotal.toString());
      formData.append("tax", totalGst.toString());
      formData.append("discount", discount.toString());
      formData.append("shipping", shipping.toString());
      formData.append("total", total.toString());
      
      await addInvoice(formData);
      toast.success("Invoice generated successfully!");
      router.push("/invoices");
    } catch (error) {
      toast.error("Failed to generate invoice.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full bg-slate-950 text-slate-300">
      {/* Left Pane - Builder Form */}
      <div className="w-1/2 border-r border-slate-800 flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <Link href="/invoices">
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold text-white">Invoice Builder</h1>
          </div>
          <Button onClick={handleSave} disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
            <Save className="w-4 h-4" /> {isSubmitting ? "Saving..." : "Save Invoice"}
          </Button>
        </div>

        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          {/* Details Section */}
          <section>
            <h2 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-4">Invoice Details</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Invoice No.</label>
                <Input 
                  className="bg-slate-900 border-slate-800" 
                  value={details.number}
                  onChange={(e) => setDetails({...details, number: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Invoice Date</label>
                <Input 
                  type="date" 
                  className="bg-slate-900 border-slate-800" 
                  value={details.date}
                  onChange={(e) => setDetails({...details, date: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Due Date</label>
                <Input 
                  type="date" 
                  className="bg-slate-900 border-slate-800" 
                  value={details.dueDate}
                  onChange={(e) => setDetails({...details, dueDate: e.target.value})}
                />
              </div>
            </div>
          </section>

          {/* Customer Section */}
          <section>
            <h2 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-4">Bill To</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Customer Name</label>
                <Input 
                  className="bg-slate-900 border-slate-800"
                  value={customer.name}
                  onChange={(e) => setCustomer({...customer, name: e.target.value})} 
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Customer Email</label>
                <Input 
                  type="email" 
                  className="bg-slate-900 border-slate-800"
                  value={customer.email}
                  onChange={(e) => setCustomer({...customer, email: e.target.value})}
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-slate-500 mb-1 block">Billing Address</label>
                <Textarea 
                  className="bg-slate-900 border-slate-800 resize-none h-20"
                  value={customer.address}
                  onChange={(e) => setCustomer({...customer, address: e.target.value})}
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-slate-500 mb-1 block">Customer GST Number (Optional)</label>
                <Input 
                  className="bg-slate-900 border-slate-800"
                  value={customer.gst}
                  onChange={(e) => setCustomer({...customer, gst: e.target.value})}
                />
              </div>
            </div>
          </section>

          {/* Line Items */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-purple-400 uppercase tracking-wider">Line Items</h2>
            </div>
            
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="flex items-start gap-3 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                  <div className="flex-1 space-y-3">
                    <Input 
                      placeholder="Product or Service Description" 
                      className="bg-slate-950 border-slate-800"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    />
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">Qty</label>
                        <Input 
                          type="number" 
                          min={1} 
                          className="bg-slate-950 border-slate-800"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">Price</label>
                        <Input 
                          type="number" 
                          min={0} 
                          className="bg-slate-950 border-slate-800"
                          value={item.price}
                          onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">GST %</label>
                        <Input 
                          type="number" 
                          min={0} 
                          max={100} 
                          className="bg-slate-950 border-slate-800"
                          value={item.gst}
                          onChange={(e) => updateItem(item.id, 'gst', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-slate-500 hover:text-red-400 hover:bg-red-950/30"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button 
              variant="outline" 
              className="w-full mt-4 bg-slate-900 border-slate-800 text-purple-400 hover:bg-slate-800 hover:text-purple-300 border-dashed"
              onClick={addItem}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Item
            </Button>
          </section>

          {/* Adjustments */}
          <section>
            <h2 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-4">Adjustments</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Discount (₹)</label>
                <Input 
                  type="number" 
                  min={0} 
                  className="bg-slate-900 border-slate-800"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Shipping (₹)</label>
                <Input 
                  type="number" 
                  min={0} 
                  className="bg-slate-900 border-slate-800"
                  value={shipping}
                  onChange={(e) => setShipping(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Right Pane - Live Preview (A4 Aspect Ratio container) */}
      <div className="w-1/2 bg-slate-900 overflow-y-auto p-8 flex justify-center">
        <div className="bg-white text-black w-full max-w-[794px] min-h-[1123px] shadow-2xl p-12 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-200 pb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 tracking-tighter">INVOICE</h1>
              <p className="text-slate-500 mt-2">SmartBiz OS Inc.</p>
              <p className="text-slate-500 text-sm">123 Business Road, Tech Park</p>
              <p className="text-slate-500 text-sm">Bangalore, India 560001</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-slate-700">Invoice No: <span className="text-slate-900">{details.number || "---"}</span></p>
              <p className="text-sm text-slate-500 mt-1">Date: {details.date}</p>
              <p className="text-sm text-slate-500">Due Date: {details.dueDate || "---"}</p>
            </div>
          </div>

          {/* Bill To */}
          <div className="mt-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Bill To</h3>
            <p className="font-semibold text-lg">{customer.name || "Customer Name"}</p>
            {customer.email && <p className="text-slate-600 text-sm">{customer.email}</p>}
            {customer.address && <p className="text-slate-600 text-sm whitespace-pre-line mt-1">{customer.address}</p>}
            {customer.gst && <p className="text-slate-600 text-sm mt-1">GSTIN: {customer.gst}</p>}
          </div>

          {/* Table */}
          <div className="mt-12 flex-1">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-800 text-left">
                  <th className="pb-3 font-semibold text-slate-700">Description</th>
                  <th className="pb-3 font-semibold text-slate-700 text-center">Qty</th>
                  <th className="pb-3 font-semibold text-slate-700 text-right">Price</th>
                  <th className="pb-3 font-semibold text-slate-700 text-right">GST %</th>
                  <th className="pb-3 font-semibold text-slate-700 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="text-slate-600">
                {items.map((item, index) => (
                  <tr key={item.id} className="border-b border-slate-200">
                    <td className="py-4">{item.description || "Item description..."}</td>
                    <td className="py-4 text-center">{item.quantity}</td>
                    <td className="py-4 text-right">₹{item.price.toFixed(2)}</td>
                    <td className="py-4 text-right">{item.gst}%</td>
                    <td className="py-4 text-right font-medium text-slate-900">
                      ₹{(item.quantity * item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mt-8">
            <div className="w-64 space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST Tax</span>
                <span>₹{totalGst.toFixed(2)}</span>
              </div>
              {shipping > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span>₹{shipping.toFixed(2)}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg text-slate-900 border-t-2 border-slate-800 pt-3 mt-3">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-slate-200 text-center text-xs text-slate-400">
            Thank you for your business.
          </div>
        </div>
      </div>
    </div>
  );
}
