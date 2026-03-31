import { NextRequest } from "next/server";
import Groq from "groq-sdk";
import { buildSecurityContext, buildBreachAnalysisPrompt } from "@/lib/aiContext";

export async function POST(req: NextRequest) {
  try {
    const { breachName, breachDetails } = await req.json();

    if (!breachName) {
      return new Response(JSON.stringify({ error: "Breach name required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const mockStream = () => {
      const mockResponse = `Based on the ${breachName} breach, your account has been directly exposed with sensitive data types that could enable targeted attacks. Attackers could use the leaked credentials for credential stuffing across your other monitored accounts, particularly those sharing similar passwords. This is a high-urgency situation requiring immediate password changes — prioritize your email and financial accounts first, as they are at secondary risk from this exposure.`;
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          const words = mockResponse.split(" ");
          for (const word of words) {
            controller.enqueue(encoder.encode(word + " "));
            await new Promise((r) => setTimeout(r, 30));
          }
          controller.close();
        },
      });
      return new Response(stream, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    };

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey || apiKey === "your_key_here") {
      return mockStream();
    }

    try {
      const groq = new Groq({ apiKey });
      const context = buildSecurityContext();
      const prompt = buildBreachAnalysisPrompt(breachName, breachDetails || "", context);

      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are a cybersecurity expert providing personalized breach impact analysis. Be concise: 3-4 sentences max." },
          { role: "user", content: prompt },
        ],
        stream: true,
        max_tokens: 1024,
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
            console.error("Streaming error:", e);
          }
          controller.close();
        },
      });

      return new Response(stream, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    } catch (apiError) {
      console.error("Groq API Exception, falling back to mock:", apiError);
      return mockStream();
    }
  } catch (e) {
    console.error("AI analyse-breach error:", e);
    // Ultimate fallback if even mock generation fails
    return new Response("An error occurred analyzing this breach. Please try again.", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
      status: 500,
    });
  }
}
