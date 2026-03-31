import { getMockBreaches, getMockAlerts, getMockDarkWebMentions } from "./mockData";
import { getDefaultRiskScore } from "./riskEngine";

export interface MonitoredIdentities {
  emails: string[];
  phones: string[];
  usernames: string[];
}

export interface UserSecurityContext {
  monitoredIdentities: MonitoredIdentities;
  riskScore: number;
  riskLevel: string;
  breaches: { name: string; date: string; severity: string; dataExposed: string[]; affectedAccount: string }[];
  unresolvedAlerts: { title: string; severity: string; description: string }[];
  darkWebMentions: { platform: string; dataType: string; risk: string }[];
}

export function getMonitoredIdentities(): MonitoredIdentities {
  if (typeof window === "undefined") {
    return { emails: [], phones: [], usernames: [] };
  }
  try {
    const stored = localStorage.getItem("monitored_identities");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch { }
  return { emails: ["user@example.com"], phones: [], usernames: [] };
}

export function buildSecurityContext(): UserSecurityContext {
  const identities = getMonitoredIdentities();
  const primaryEmail = identities.emails[0] || "user@example.com";
  const breaches = getMockBreaches(primaryEmail);
  const alerts = getMockAlerts(primaryEmail);
  const darkWeb = getMockDarkWebMentions();
  const risk = getDefaultRiskScore();

  return {
    monitoredIdentities: identities,
    riskScore: risk.score,
    riskLevel: risk.level,
    breaches: breaches.map((b) => ({
      name: b.name,
      date: b.date,
      severity: b.severity,
      dataExposed: b.dataExposed,
      affectedAccount: b.affectedAccount,
    })),
    unresolvedAlerts: alerts
      .filter((a) => !a.read)
      .map((a) => ({
        title: a.title,
        severity: a.severity,
        description: a.description,
      })),
    darkWebMentions: darkWeb.map((d) => ({
      platform: d.platform,
      dataType: d.dataType,
      risk: d.risk,
    })),
  };
}

export function buildSystemPrompt(context: UserSecurityContext): string {
  return `You are Joi, ShieldScan's personal AI cybersecurity advisor. You have full knowledge of this user's security situation.

Their monitored identities are:
- Emails: ${context.monitoredIdentities.emails.join(", ") || "None"}
- Phone numbers: ${context.monitoredIdentities.phones.join(", ") || "None"}
- Usernames: ${context.monitoredIdentities.usernames.join(", ") || "None"}

Their current risk score is: ${context.riskScore}/100 (${context.riskLevel})

Their detected breaches are:
${context.breaches.map((b) => `- ${b.name} (${b.date}): Severity ${b.severity}, exposed [${b.dataExposed.join(", ")}] for account ${b.affectedAccount}`).join("\n")}

Their unresolved alerts are:
${context.unresolvedAlerts.map((a) => `- [${a.severity.toUpperCase()}] ${a.title}: ${a.description}`).join("\n")}

Dark web mentions:
${context.darkWebMentions.map((d) => `- ${d.platform}: ${d.dataType} (risk: ${d.risk})`).join("\n")}

Always give specific, actionable advice referencing their actual data. Never give generic security advice. Be concise, direct, and urgent when the situation calls for it.`;
}

export function buildBreachAnalysisPrompt(
  breachName: string,
  breachDetails: string,
  context: UserSecurityContext
): string {
  return `Analyze this specific breach's impact for this user. Be specific — reference their actual data.

Breach: ${breachName}
Details: ${breachDetails}

User Context:
- Monitored emails: ${context.monitoredIdentities.emails.join(", ")}
- Current risk score: ${context.riskScore}/100
- Other breaches they're in: ${context.breaches.map((b) => b.name).join(", ")}

Provide a 3-4 sentence personalized impact analysis:
1. What this breach specifically means for THIS user
2. What attackers could realistically do with the exposed data
3. Urgency level (act now vs monitor)
4. Which of their other monitored accounts are at secondary risk

Be direct and specific. No generic advice.`;
}
