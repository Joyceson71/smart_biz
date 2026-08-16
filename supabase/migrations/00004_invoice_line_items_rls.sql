-- Add RLS policies for invoice_line_items

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own invoice line items') THEN
        CREATE POLICY "Users can view their own invoice line items" ON public.invoice_line_items FOR SELECT TO authenticated USING (
            EXISTS (SELECT 1 FROM public.invoices WHERE id = invoice_line_items.invoice_id AND user_id = auth.uid())
        );
        CREATE POLICY "Users can insert their own invoice line items" ON public.invoice_line_items FOR INSERT TO authenticated WITH CHECK (
            EXISTS (SELECT 1 FROM public.invoices WHERE id = invoice_line_items.invoice_id AND user_id = auth.uid())
        );
        CREATE POLICY "Users can update their own invoice line items" ON public.invoice_line_items FOR UPDATE TO authenticated USING (
            EXISTS (SELECT 1 FROM public.invoices WHERE id = invoice_line_items.invoice_id AND user_id = auth.uid())
        ) WITH CHECK (
            EXISTS (SELECT 1 FROM public.invoices WHERE id = invoice_line_items.invoice_id AND user_id = auth.uid())
        );
        CREATE POLICY "Users can delete their own invoice line items" ON public.invoice_line_items FOR DELETE TO authenticated USING (
            EXISTS (SELECT 1 FROM public.invoices WHERE id = invoice_line_items.invoice_id AND user_id = auth.uid())
        );
    END IF;
END
$$;

