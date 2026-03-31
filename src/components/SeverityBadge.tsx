"use client";

const severityConfig = {
  critical: { bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/30" },
  high: { bg: "bg-orange-500/15", text: "text-orange-400", border: "border-orange-500/30" },
  medium: { bg: "bg-yellow-500/15", text: "text-yellow-400", border: "border-yellow-500/30" },
  low: { bg: "bg-green-500/15", text: "text-green-400", border: "border-green-500/30" },
};

interface SeverityBadgeProps {
  severity: "critical" | "high" | "medium" | "low";
}

export default function SeverityBadge({ severity }: SeverityBadgeProps) {
  const config = severityConfig[severity];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-semibold uppercase border ${config.bg} ${config.text} ${config.border}`}
    >
      {severity}
    </span>
  );
}
