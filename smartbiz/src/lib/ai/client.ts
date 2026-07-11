import { OpenAI } from "openai";

// Singleton instance of OpenAI client
// Will gracefully fail or use mock in development if API key is missing
export const aiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "mock-key-for-build",
});

export async function askAI(messages: any[], useMock = false) {
  if (useMock || !process.env.OPENAI_API_KEY) {
    // Return a mock stream for hackathon demo if no key
    return new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode("This is a mock AI response. Please configure OPENAI_API_KEY."));
        controller.close();
      }
    });
  }

  // Actual OpenAI call
  const response = await aiClient.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    stream: true,
  });

  // Convert to standard ReadableStream
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of response) {
        const text = chunk.choices[0]?.delta?.content || "";
        controller.enqueue(new TextEncoder().encode(text));
      }
      controller.close();
    }
  });

  return stream;
}
