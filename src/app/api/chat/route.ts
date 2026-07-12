import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const result = streamText({
      model: openai('gpt-4o-mini'),
      messages,
      system: `You are the AI Command Center for SmartBiz OS. You have access to the user's business data via tools.
      Be extremely concise, professional, and act like a high-tech AI assistant (e.g. JARVIS). 
      If a user asks for data you don't have tools for, say you don't have access to that module yet.`,
      tools: {
        getInventoryStatus: tool({
          description: 'Get the current inventory status including low stock items.',
          parameters: z.object({}),
          // @ts-expect-error type mismatch
          execute: async () => {
            const { data, error } = await supabase
              .from('products')
              .select('*')
              .eq('user_id', user.id);
            
            if (error) throw new Error(error.message);
            return {
              totalProducts: data.length,
              lowStockItems: data.filter(p => p.stock < 20).map(p => p.name),
              totalValue: data.reduce((acc, p) => acc + (p.price * p.stock), 0)
            };
          },
        }),
        getCustomerStats: tool({
          description: 'Get statistics about the customers.',
          parameters: z.object({}),
          // @ts-expect-error type mismatch
          execute: async () => {
            const { data, error } = await supabase
              .from('customers')
              .select('*')
              .eq('user_id', user.id);
            
            if (error) throw new Error(error.message);
            return {
              totalCustomers: data.length,
              newCustomers: data.filter(c => c.status === 'New').length,
              activeCustomers: data.filter(c => c.status === 'Active').length,
              averageLTV: data.reduce((acc, c) => acc + c.ltv, 0) / (data.length || 1)
            };
          },
        }),
        getRecentInvoices: tool({
          description: 'Get the 5 most recent invoices and total outstanding amount.',
          parameters: z.object({}),
          // @ts-expect-error type mismatch
          execute: async () => {
            const { data, error } = await supabase
              .from('invoices')
              .select('*')
              .eq('user_id', user.id)
              .order('created_at', { ascending: false })
              .limit(5);
              
            if (error) throw new Error(error.message);
            return {
              recentInvoices: data.map(i => ({ id: i.id, amount: i.amount, status: i.status })),
              outstandingTotal: data.filter(i => i.status === 'Pending').reduce((acc, i) => acc + i.amount, 0)
            };
          },
        })
      },
      // @ts-expect-error type mismatch
      maxSteps: 3,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (result as any).toDataStreamResponse();
  } catch (err: any) {
    return new Response(err.stack || err.message, { status: 500 });
  }
}
