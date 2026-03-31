import { NextRequest, NextResponse } from "next/server";
import { getMockBreaches } from "@/lib/mockData";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const apiKey = process.env.RAPIDAPI_KEY;
    const apiHost = process.env.RAPIDAPI_HOST;

    if (apiKey && apiKey !== "your_key_here" && apiHost) {
      console.log("Attempting BreachDirectory API...");
      try {
        const res = await fetch(
          `https://${apiHost}/?term=${encodeURIComponent(email)}&func=auto`,
          {
            headers: {
              "X-RapidAPI-Key": apiKey,
              "X-RapidAPI-Host": apiHost,
            },
          }
        );

        if (res.ok) {
          console.log("BreachDirectory API Success");
          const data = await res.json();
          // Transform if necessary based on API schema
          const mappedBreaches = (data.result || []).map((b: any, idx: number) => {
            const multiSourceMatch = b.sources ? (Array.isArray(b.sources) ? b.sources.join(", ") : b.sources.toString()) : "Unknown Breach";
            const mainName = multiSourceMatch.split(',')[0].trim();
            const hasPassword = b.password || b.hash_password || b.hash;
            
            return {
              id: `api-br-${idx}-${Math.random().toString(36).substr(2, 5)}`,
              name: mainName,
              date: "Historical", // BreachDirectory free tier often lacks exact dates per entry
              description: `A data exposure incident associated with **${multiSourceMatch}** was detected. Your data was compromised and surfaced on dark web or public leak lists.`,
              severity: hasPassword ? "critical" : "high",
              dataExposed: ["Email address", ...(hasPassword ? ["Password (Clear or Hashed)"] : [])],
              affectedAccount: email,
              status: "new",
              source: "BreachDirectory API"
            };
          });
          
          return NextResponse.json({ breaches: mappedBreaches.slice(0, 15), source: "api" });
        } else {
          const errText = await res.text();
          console.error("BreachDirectory API Error Response:", res.status, errText);
        }
      } catch (e) {
        console.error("BreachDirectory Fetch Error:", e);
      }
    } else {
      console.log("BreachDirectory env vars missing or default, using mock data.");
    }

    // Fallback to mock data
    return NextResponse.json({ breaches: getMockBreaches(email), source: "mock" });
  } catch {
    return NextResponse.json({ breaches: getMockBreaches(), source: "mock" });
  }
}
