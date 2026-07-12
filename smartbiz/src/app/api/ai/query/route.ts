import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { askAI } from "@/lib/ai/client";
import { buildPromptWithContext } from "@/lib/ai/prompts";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: userDataRaw } = await supabase
      .from("users")
      .select("organization_id, role, full_name")
      .eq("id", user.id)
      .single();

    const userData = userDataRaw as any;

    if (!userData) {
      return NextResponse.json({ error: "User data not found" }, { status: 404 });
    }

    const body = await req.json();
    const { messages } = body;

    const systemPrompt = {
      role: "system",
      content: buildPromptWithContext(
        userData.organization_id,
        userData.role,
        userData.full_name || "User"
      ),
    };

    // In a full implementation, this route would handle tool execution.
    // For this prototype, we're doing a direct streaming response.
    const stream = await askAI([systemPrompt, ...messages]);
    
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (error: any) {
    console.error("AI Query Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
