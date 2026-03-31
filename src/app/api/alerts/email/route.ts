import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { to, subject, breachName, severity, details } = await req.json();

    if (!to || !subject) {
      return NextResponse.json({ error: "Recipient and subject required" }, { status: 400 });
    }

    const apiKey = process.env.SENDGRID_API_KEY;

    if (apiKey && apiKey !== "your_key_here") {
      try {
        const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            personalizations: [{ to: [{ email: to }] }],
            from: { email: "alerts@shieldscan.app", name: "ShieldScan Alerts" },
            subject,
            content: [
              {
                type: "text/html",
                value: `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f1117; color: #e8e8e8; padding: 32px; border-radius: 12px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 24px;">
                      <div style="width: 32px; height: 32px; background: #00d4aa; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                        <span style="color: black; font-weight: bold; font-size: 14px;">SS</span>
                      </div>
                      <span style="font-size: 18px; font-weight: bold; color: white;">ShieldScan Alert</span>
                    </div>
                    <div style="background: #1a1d27; border: 1px solid rgba(255,255,255,0.07); border-radius: 8px; padding: 20px; margin-bottom: 16px;">
                      <h2 style="color: #ff4757; margin: 0 0 8px;">⚠️ ${breachName || "Security Alert"}</h2>
                      <p style="color: #8b8fa8; font-size: 14px; margin: 0 0 12px;">Severity: <strong style="color: ${severity === "critical" ? "#ff4757" : "#ffa502"}">${severity || "high"}</strong></p>
                      <p style="color: #e8e8e8; font-size: 14px; line-height: 1.6;">${details || "A security event has been detected for your monitored identity."}</p>
                    </div>
                    <a href="https://shieldscan.app/dashboard" style="display: inline-block; background: #00d4aa; color: black; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">View Dashboard →</a>
                    <p style="color: #8b8fa8; font-size: 12px; margin-top: 24px;">You're receiving this because you have email alerts enabled on ShieldScan.</p>
                  </div>
                `,
              },
            ],
          }),
        });

        if (res.ok) {
          return NextResponse.json({ success: true, message: "Email sent" });
        }
        return NextResponse.json({ success: false, message: "SendGrid error" }, { status: 500 });
      } catch (e) {
        console.error("SendGrid error:", e);
      }
    }

    return NextResponse.json({ success: true, message: "Email alert simulated (API key not configured)" });
  } catch {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
