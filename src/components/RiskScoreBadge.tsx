"use client";

import { getRiskColor, getRiskLevel } from "@/lib/riskEngine";

interface RiskScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export default function RiskScoreBadge({ score, size = "md" }: RiskScoreBadgeProps) {
  const color = getRiskColor(score);
  const level = getRiskLevel(score);

  const sizes = {
    sm: { container: "px-2 py-0.5 text-xs gap-1", dot: "w-1.5 h-1.5" },
    md: { container: "px-3 py-1 text-sm gap-1.5", dot: "w-2 h-2" },
    lg: { container: "px-4 py-1.5 text-base gap-2", dot: "w-2.5 h-2.5" },
  };

  return (
    <div
      className={`inline-flex items-center rounded-full font-mono font-semibold ${sizes[size].container}`}
      style={{ backgroundColor: `${color}15`, color, border: `1px solid ${color}30` }}
    >
      <span
        className={`rounded-full ${sizes[size].dot} animate-pulse`}
        style={{ backgroundColor: color }}
      />
      <span>{score}</span>
      <span className="opacity-70">/ 100</span>
      <span className="ml-1 opacity-80">{level}</span>
    </div>
  );
}
