import { openai } from '@ai-sdk/openai';
import { stepCountIs, streamText, dynamicTool, jsonSchema } from 'ai';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/rate-limit';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Empty JSON schema for tools that take no arguments
const noArgs = jsonSchema<Record<string, never>>({
  type: 'object',
  properties: {},
  additionalProperties: false,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const userId = user.id;

    const rateLimit = checkRateLimit(`chat_${userId}`, 10, 60 * 1000); // 10 reqs per minute
    if (!rateLimit.success) {
      return new Response('Too Many Requests', { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': rateLimit.limit.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': rateLimit.reset.toString(),
        }
      });
    }


    const result = streamText({
      model: openai('gpt-4o-mini'),
      messages,
      system: `You are the AI Command Center for SmartBiz OS. You have access to the user's business data via tools.
      Be extremely concise, professional, and act like a high-tech AI assistant (e.g. JARVIS). 
      If a user asks for data you don't have tools for, say you don't have access to that module yet.`,
      tools: {
        getInventoryStatus: dynamicTool({
          description: 'Get the current inventory status including low stock items and total value.',
          inputSchema: noArgs,
          execute: async () => {
            const { data, error } = await supabase
              .from('products')
              .select('name, stock, purchase_price, min_stock')
              .eq('user_id', userId);
            
            if (error) throw new Error(error.message);
            const rows = data ?? [];
            return {
              totalProducts: rows.length,
              lowStockItems: rows.filter(p => (p.stock ?? 0) < (p.min_stock ?? 10)).map(p => p.name),
              totalValue: rows.reduce((acc, p) => acc + ((p.purchase_price ?? 0) * (p.stock ?? 0)), 0)
            };
          },
        }),
        getCustomerStats: dynamicTool({
          description: 'Get statistics about the customers including active and new counts.',
          inputSchema: noArgs,
          execute: async () => {
            const { data, error } = await supabase
              .from('customers')
              .select('status, ltv')
              .eq('user_id', userId);
            
            if (error) throw new Error(error.message);
            const rows = data ?? [];
            return {
              totalCustomers: rows.length,
              newCustomers: rows.filter(c => c.status === 'New').length,
              activeCustomers: rows.filter(c => c.status === 'Active').length,
              averageLTV: rows.reduce((acc, c) => acc + (c.ltv ?? 0), 0) / (rows.length || 1)
            };
          },
        }),
        getRecentInvoices: dynamicTool({
          description: 'Get the 5 most recent invoices and total outstanding amount.',
          inputSchema: noArgs,
          execute: async () => {
            const { data, error } = await supabase
              .from('invoices')
              .select('id, amount, status')
              .eq('user_id', userId)
              .order('created_at', { ascending: false })
              .limit(5);
              
            if (error) throw new Error(error.message);
            const rows = data ?? [];
            return {
              recentInvoices: rows.map(i => ({ id: i.id, amount: i.amount, status: i.status })),
              outstandingTotal: rows.filter(i => i.status === 'Pending').reduce((acc, i) => acc + (i.amount ?? 0), 0)
            };
          },
        })
      },
      stopWhen: stepCountIs(3),
    });

    return result.toTextStreamResponse();
  } catch (err: unknown) {
    if (err instanceof Error) {
      return new Response(err.stack || err.message, { status: 500 });
    }
    return new Response(String(err), { status: 500 });
  }
}
