import { Breach, DarkWebMention } from "./mockData";

interface RiskFactors {
  breaches: Breach[];
  darkWebMentions: DarkWebMention[];
  hasWeakPasswordSignal: boolean;
  phishingExposure: boolean;
}

interface RiskBreakdown {
  score: number;
  level: "low" | "medium" | "high" | "critical";
  color: string;
  factors: { label: string; points: number }[];
}

const WEIGHTS = {
  breach: 30,
  darkWebMention: 50,
  weakPassword: 40,
  phishingExposure: 20,
};

export function calculateRiskScore(factors: RiskFactors): RiskBreakdown {
  const breakdown: { label: string; points: number }[] = [];
  let raw = 0;

  if (factors.breaches.length > 0) {
    const pts = Math.min(WEIGHTS.breach * factors.breaches.length, 60);
    raw += pts;
    breakdown.push({ label: `${factors.breaches.length} breach(es) detected`, points: pts });
  }

  if (factors.darkWebMentions.length > 0) {
    const active = factors.darkWebMentions.filter((m) => m.status === "active");
    if (active.length > 0) {
      const pts = Math.min(WEIGHTS.darkWebMention * active.length, 50);
      raw += pts;
      breakdown.push({ label: `${active.length} dark web mention(s)`, points: pts });
    }
  }

  if (factors.hasWeakPasswordSignal) {
    raw += WEIGHTS.weakPassword;
    breakdown.push({ label: "Weak/reused password detected", points: WEIGHTS.weakPassword });
  }

  if (factors.phishingExposure) {
    raw += WEIGHTS.phishingExposure;
    breakdown.push({ label: "Phishing exposure detected", points: WEIGHTS.phishingExposure });
  }

  const score = Math.min(raw, 100);

  let level: RiskBreakdown["level"];
  let color: string;
  if (score <= 30) {
    level = "low";
    color = "#00d4aa";
  } else if (score <= 69) {
    level = "medium";
    color = "#ffa502";
  } else {
    level = score >= 85 ? "critical" : "high";
    color = "#ff4757";
  }

  return { score, level, color, factors: breakdown };
}

export function getDefaultRiskScore(): RiskBreakdown {
  return {
    score: 72,
    level: "high",
    color: "#ff4757",
    factors: [
      { label: "5 breach(es) detected", points: 60 },
      { label: "2 dark web mention(s)", points: 50 },
    ],
  };
}

export function getRiskColor(score: number): string {
  if (score <= 30) return "#00d4aa";
  if (score <= 69) return "#ffa502";
  return "#ff4757";
}

export function getRiskLevel(score: number): string {
  if (score <= 30) return "Low";
  if (score <= 69) return "Medium";
  if (score < 85) return "High";
  return "Critical";
}
