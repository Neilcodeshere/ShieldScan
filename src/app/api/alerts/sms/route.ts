import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { to, message, severity } = await req.json();

    if (!to || !message) {
      return NextResponse.json({ error: "Phone number and message required" }, { status: 400 });
    }

    // Only send SMS for critical severity
    if (severity && severity !== "critical") {
      return NextResponse.json({ success: false, message: "SMS only sent for critical severity alerts" });
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (accountSid && accountSid !== "your_sid_here" && authToken && fromNumber) {
      try {
        const res = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
          {
            method: "POST",
            headers: {
              Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              To: to,
              From: fromNumber,
              Body: `🛡️ ShieldScan CRITICAL ALERT: ${message}`,
            }),
          }
        );

        if (res.ok) {
          return NextResponse.json({ success: true, message: "SMS sent" });
        }
        const errData = await res.json();
        return NextResponse.json({ success: false, message: errData.message || "Twilio error" }, { status: 500 });
      } catch (e) {
        console.error("Twilio error:", e);
      }
    }

    return NextResponse.json({ success: true, message: "SMS alert simulated (Twilio not configured)" });
  } catch {
    return NextResponse.json({ error: "Failed to send SMS" }, { status: 500 });
  }
}
