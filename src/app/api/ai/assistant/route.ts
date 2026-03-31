import { NextRequest } from "next/server";
import Groq from "groq-sdk";
import { buildSystemPrompt } from "@/lib/aiContext";

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid messages format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey || apiKey === "your_key_here") {
      // Offline fallback streaming response
      const fallbackResponse = "Based on my automated heuristic review of your security context, you have elevated risk. I strongly advise reviewing your most recent breach alerts and changing any reused passwords immediately. Since I am operating in offline-heuristic mode, please consult the Dashboard for granular detail.";

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          const words = fallbackResponse.split(" ");
          for (const word of words) {
            controller.enqueue(encoder.encode(word + " "));
            await new Promise((r) => setTimeout(r, 40));
          }
          controller.close();
        },
      });

      return new Response(stream, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    const groq = new Groq({ apiKey });
    const systemPromptMessage = { role: "system", content: buildSystemPrompt(context) };
    
    // Combine system prompt with conversation history
    const apiMessages = [systemPromptMessage, ...messages];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: apiMessages,
      stream: true,
      max_tokens: 1500,
      temperature: 0.7,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
        } catch (e) {
          console.error("Assistant streaming error:", e);
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (e) {
    console.error("AI assistant error:", e);
    return new Response("An error occurred. Please try again.", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
      status: 500
    });
  }
}
