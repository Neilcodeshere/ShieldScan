export interface Breach {
  id: string;
  name: string;
  date: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  dataExposed: string[];
  affectedAccount: string;
  status: "new" | "reviewed";
  source: string;
}

export interface DarkWebMention {
  id: string;
  platform: string;
  dateFound: string;
  dataType: string;
  risk: "critical" | "high" | "medium" | "low";
  description: string;
  status: "active" | "resolved";
}

export interface Alert {
  id: string;
  type: "breach" | "darkweb" | "phishing" | "system";
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  affectedIdentity: string;
  timestamp: string;
  read: boolean;
}

export interface PhishingResult {
  url: string;
  riskPercentage: number;
  domainReputation: number;
  flags: string[];
  verdict: "safe" | "suspicious" | "dangerous";
  engines: { total: number; flagged: number };
  details: string;
}

export interface RiskTrendPoint {
  date: string;
  score: number;
}

export function getMockBreaches(userEmail?: string): Breach[] {
  const email = userEmail || "user@example.com";
  return [
    {
      id: "br-001",
      name: "LinkedIn",
      date: "2021-06-22",
      description: `Email address ${email} was found in the 2021 LinkedIn data breach affecting 700M users. Exposed data includes email addresses, phone numbers, and professional details.`,
      severity: "high",
      dataExposed: ["Email", "Phone", "Name", "Job Title", "LinkedIn Profile"],
      affectedAccount: email,
      status: "new",
      source: "BreachDirectory",
    },
    {
      id: "br-002",
      name: "Canva",
      date: "2019-05-24",
      description: `Account ${email} was part of the Canva breach exposing 137M users. Usernames, email addresses, and bcrypt-hashed passwords were leaked.`,
      severity: "medium",
      dataExposed: ["Email", "Username", "Password Hash", "Name"],
      affectedAccount: email,
      status: "reviewed",
      source: "BreachDirectory",
    },
    {
      id: "br-003",
      name: "Adobe",
      date: "2013-10-04",
      description: `${email} was included in the Adobe breach of 153M records. Encrypted passwords and password hints were exposed.`,
      severity: "high",
      dataExposed: ["Email", "Password (Encrypted)", "Password Hint", "Username"],
      affectedAccount: email,
      status: "reviewed",
      source: "BreachDirectory",
    },
    {
      id: "br-004",
      name: "RockYou2021",
      date: "2021-06-07",
      description: `Credentials associated with ${email} appeared in the RockYou2021 compilation — the largest password collection ever, containing 8.4 billion entries.`,
      severity: "critical",
      dataExposed: ["Email", "Password (Plaintext)"],
      affectedAccount: email,
      status: "new",
      source: "BreachDirectory",
    },
    {
      id: "br-005",
      name: "Twitter",
      date: "2022-01-06",
      description: `${email} was found in the Twitter data scrape affecting 5.4M accounts. Phone numbers linked to accounts were exposed via an API vulnerability.`,
      severity: "medium",
      dataExposed: ["Email", "Phone", "Username", "Name"],
      affectedAccount: email,
      status: "new",
      source: "BreachDirectory",
    },
  ];
}

export function getMockDarkWebMentions(): DarkWebMention[] {
  return [
    {
      id: "dw-001",
      platform: "Underground Forum",
      dateFound: "2024-11-15",
      dataType: "Email + Password Combo",
      risk: "critical",
      description: "Your credentials were found in a combo list being sold on a dark web marketplace.",
      status: "active",
    },
    {
      id: "dw-002",
      platform: "Paste Site",
      dateFound: "2024-09-03",
      dataType: "Email Address",
      risk: "medium",
      description: "Your email address appeared in a paste containing leaked account data.",
      status: "active",
    },
    {
      id: "dw-003",
      platform: "Telegram Channel",
      dateFound: "2024-07-21",
      dataType: "Phone Number",
      risk: "high",
      description: "Your phone number was listed in a Telegram group distributing breached data.",
      status: "resolved",
    },
  ];
}

export function getMockAlerts(userEmail?: string): Alert[] {
  const email = userEmail || "user@example.com";
  return [
    {
      id: "al-001",
      type: "breach",
      severity: "critical",
      title: "Critical Breach Detected — RockYou2021",
      description: `Your plaintext password for ${email} was found in the RockYou2021 compilation. Change all passwords immediately.`,
      affectedIdentity: email,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false,
    },
    {
      id: "al-002",
      type: "darkweb",
      severity: "high",
      title: "Dark Web Mention Found",
      description: "Your credentials are being traded on an underground forum. Immediate action required.",
      affectedIdentity: email,
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      read: false,
    },
    {
      id: "al-003",
      type: "breach",
      severity: "high",
      title: "New Breach — LinkedIn 2021",
      description: `${email} found in LinkedIn breach. Professional data and phone numbers exposed.`,
      affectedIdentity: email,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      read: false,
    },
    {
      id: "al-004",
      type: "phishing",
      severity: "medium",
      title: "Phishing Domain Detected",
      description: "A domain impersonating your bank was detected in a phishing campaign.",
      affectedIdentity: email,
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: "al-005",
      type: "system",
      severity: "low",
      title: "Weekly Security Report Ready",
      description: "Your weekly security summary is available. Risk score has decreased by 5 points.",
      affectedIdentity: "System",
      timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: "al-006",
      type: "breach",
      severity: "medium",
      title: "Breach Alert — Canva 2019",
      description: `Password hash for ${email} was exposed in the Canva breach.`,
      affectedIdentity: email,
      timestamp: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: "al-007",
      type: "darkweb",
      severity: "high",
      title: "Phone Number Exposed",
      description: "Your phone number appeared in a Telegram channel distributing leaked data.",
      affectedIdentity: "Phone",
      timestamp: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
  ];
}

export function getMockPhishingResults(): PhishingResult[] {
  return [
    {
      url: "https://secure-bankofamerica-login.com",
      riskPercentage: 92,
      domainReputation: 5,
      flags: ["Domain mimics legitimate bank", "Recently registered (3 days ago)", "No SSL certificate history", "Known phishing pattern"],
      verdict: "dangerous",
      engines: { total: 87, flagged: 79 },
      details: "This domain closely mimics Bank of America's login page and was registered 3 days ago. Multiple security engines have flagged it as a phishing site.",
    },
    {
      url: "https://drive.google.com/shared-doc",
      riskPercentage: 15,
      domainReputation: 95,
      flags: ["Legitimate Google domain"],
      verdict: "safe",
      engines: { total: 87, flagged: 0 },
      details: "This is a legitimate Google Drive link. The domain has a strong reputation and no security engines flagged it.",
    },
    {
      url: "https://paypa1-verify.net/account",
      riskPercentage: 88,
      domainReputation: 8,
      flags: ["Homoglyph attack (l→1)", "Requests sensitive data", "Blacklisted by 65 engines", "Suspicious redirect chain"],
      verdict: "dangerous",
      engines: { total: 87, flagged: 65 },
      details: "This domain uses a homoglyph attack replacing 'l' with '1' to impersonate PayPal. It has been blacklisted by multiple security vendors.",
    },
  ];
}

export function getMockRiskTrend(): RiskTrendPoint[] {
  const points: RiskTrendPoint[] = [];
  const now = new Date();
  let score = 45;
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    score = Math.max(0, Math.min(100, score + Math.floor(Math.random() * 21) - 10));
    if (i < 5) score = Math.min(100, score + 5);
    points.push({
      date: date.toISOString().split("T")[0],
      score,
    });
  }
  return points;
}

export const recommendedActions = [
  { id: "ra-1", action: "Change all passwords found in RockYou2021 breach", priority: "critical" as const, completed: false },
  { id: "ra-2", action: "Enable 2FA on LinkedIn account", priority: "high" as const, completed: false },
  { id: "ra-3", action: "Update Adobe account credentials", priority: "high" as const, completed: false },
  { id: "ra-4", action: "Review Canva account for unauthorized access", priority: "medium" as const, completed: true },
  { id: "ra-5", action: "Set up login alerts on all email accounts", priority: "medium" as const, completed: false },
  { id: "ra-6", action: "Consider using a password manager", priority: "medium" as const, completed: false },
];
