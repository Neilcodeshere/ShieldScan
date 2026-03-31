"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Play,
  Brain,
  Mail,
  Phone,
  User,
  Printer,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";
import SeverityBadge from "@/components/SeverityBadge";
import TypingIndicator from "@/components/TypingIndicator";
import ScanModal from "@/components/ScanModal";
import { useNotifications } from "@/components/NotificationContext";
import {
  getMockBreaches,
  getMockRiskTrend,
  recommendedActions,
  Breach,
} from "@/lib/mockData";
import { getRiskColor, getRiskLevel } from "@/lib/riskEngine";
import { getMonitoredIdentities } from "@/lib/aiContext";

const fadeIn = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const { alerts } = useNotifications();
  const [breaches, setBreaches] = useState<Breach[]>([]);
  const [riskTrend, setRiskTrend] = useState(getMockRiskTrend());
  const [identities, setIdentities] = useState({ emails: [] as string[], phones: [] as string[], usernames: [] as string[] });
  const [scanning, setScanning] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<Record<string, string>>({});
  const riskScore = 72;

  useEffect(() => {
    const ids = getMonitoredIdentities();
    setIdentities(ids);
    setBreaches(getMockBreaches(ids.emails[0]));
  }, []);

  const handleScanComplete = useCallback(() => {
    setScanning(false);
    setRiskTrend(getMockRiskTrend());
  }, []);

  const analyseBreachWithAI = async (breach: Breach) => {
    setAnalyzingId(breach.id);
    setAiResponse((prev) => ({ ...prev, [breach.id]: "" }));

    try {
      const res = await fetch("/api/ai/analyse-breach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          breachName: breach.name,
          breachDetails: breach.description,
        }),
      });

      if (!res.ok || !res.body) {
        setAiResponse((prev) => ({
          ...prev,
          [breach.id]: `Based on the ${breach.name} breach, your account ${breach.affectedAccount} has been exposed. The data types compromised (${breach.dataExposed.join(", ")}) could be used for targeted phishing attacks and credential stuffing. Given your risk score of ${riskScore}/100, immediate password changes are recommended for this and all accounts using similar credentials.`,
        }));
        setAnalyzingId(null);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        fullText += chunk;
        setAiResponse((prev) => ({ ...prev, [breach.id]: fullText }));
      }
    } catch {
      setAiResponse((prev) => ({
        ...prev,
        [breach.id]: `The ${breach.name} breach exposed ${breach.dataExposed.join(", ")} for ${breach.affectedAccount}. This is a ${breach.severity} severity incident. Change your passwords immediately and enable 2FA on all accounts.`,
      }));
    }
    setAnalyzingId(null);
  };

  const donutData = [
    { value: riskScore, color: getRiskColor(riskScore) },
    { value: 100 - riskScore, color: "#1a1d27" },
  ];

  const recentAlerts = alerts.slice(0, 5);

  return (
    <div className="space-y-6 pb-20 print:pb-0">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Overview</h1>
        </div>
        <button
          onClick={() => window.print()}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-[#e8e8e8] transition-colors print:hidden"
        >
          <Printer className="w-3.5 h-3.5" /> Export Report
        </button>
      </div>

      {/* Row 1: Risk Score + Trend */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Risk Score Donut */}
        <motion.div {...fadeIn} transition={{ delay: 0 }} className="card p-6">
          <h3 className="text-sm font-medium text-[#8b8fa8] mb-4 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" /> Cyber Risk Score
          </h3>
          <div className="flex items-center gap-6">
            <div className="relative w-40 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={68}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={40}
                  >
                    {donutData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold font-mono" style={{ color: getRiskColor(riskScore) }}>
                  {riskScore}
                </span>
                <span className="text-xs text-[#8b8fa8]">/ 100</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span
                  className="px-2 py-0.5 rounded text-xs font-semibold"
                  style={{
                    backgroundColor: `${getRiskColor(riskScore)}15`,
                    color: getRiskColor(riskScore),
                  }}
                >
                  {getRiskLevel(riskScore)}
                </span>
              </div>
              <p className="text-xs text-[#8b8fa8] leading-relaxed">
                Your risk is elevated due to 5 detected breaches and 2 active dark web mentions.
                Immediate action recommended.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Risk Trend */}
        <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="card p-6">
          <h3 className="text-sm font-medium text-[#8b8fa8] mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Risk Trend — Last 30 Days
          </h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={riskTrend}>
                <defs>
                  <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00d4aa" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#00d4aa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" hide />
                <YAxis domain={[0, 100]} hide />
                <Tooltip
                  contentStyle={{
                    background: "#1a1d27",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "#e8e8e8",
                  }}
                />
                <Area type="monotone" dataKey="score" stroke="#00d4aa" fill="url(#riskGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Row 2: Breaches + Identities */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Detected Breaches */}
        <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-[#8b8fa8] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Detected Breaches
            </h3>
            <a href="/dashboard/breaches" className="text-xs text-[#00d4aa] hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-3 h-3" />
            </a>
          </div>
          <div className="space-y-3">
            {breaches.slice(0, 3).map((breach) => (
              <div key={breach.id} className="bg-[#0f1117] rounded-lg border border-white/[0.07] overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-white">{breach.name}</span>
                        <SeverityBadge severity={breach.severity} />
                      </div>
                      <p className="text-xs text-[#8b8fa8] mb-2">{breach.date} • {breach.affectedAccount}</p>
                      <div className="flex flex-wrap gap-1">
                        {breach.dataExposed.slice(0, 3).map((d) => (
                          <span key={d} className="px-2 py-0.5 bg-white/5 rounded text-[10px] font-mono text-[#8b8fa8]">
                            {d}
                          </span>
                        ))}
                        {breach.dataExposed.length > 3 && (
                          <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] font-mono text-[#8b8fa8]">
                            +{breach.dataExposed.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => analyseBreachWithAI(breach)}
                      disabled={analyzingId === breach.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00d4aa]/10 border border-[#00d4aa]/20 rounded-lg text-xs text-[#00d4aa] hover:bg-[#00d4aa]/20 transition-colors disabled:opacity-50 flex-shrink-0"
                    >
                      <Brain className="w-3.5 h-3.5" />
                      Analyse Impact
                    </button>
                  </div>
                </div>

                {(analyzingId === breach.id || aiResponse[breach.id]) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="border-t border-white/[0.07] bg-[#00d4aa]/5 p-4"
                  >
                    {analyzingId === breach.id && !aiResponse[breach.id] ? (
                      <TypingIndicator />
                    ) : (
                      <div className="flex gap-2">
                        <Brain className="w-4 h-4 text-[#00d4aa] flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-[#e8e8e8] prose prose-invert prose-p:leading-relaxed prose-pre:bg-black/50 prose-a:text-[#00d4aa] max-w-none">
                          <ReactMarkdown>{aiResponse[breach.id]}</ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Monitored Identities */}
        <motion.div {...fadeIn} transition={{ delay: 0.3 }} className="card p-6">
          <h3 className="text-sm font-medium text-[#8b8fa8] mb-4">Monitored Identities</h3>
          <div className="space-y-3">
            {identities.emails.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-xs text-[#8b8fa8] mb-1.5">
                  <Mail className="w-3 h-3" /> Emails
                </div>
                <div className="space-y-1">
                  {identities.emails.map((e) => (
                    <div key={e} className="px-3 py-2 bg-[#0f1117] rounded-lg border border-white/[0.07] text-xs font-mono text-[#00d4aa]">
                      {e}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {identities.phones.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-xs text-[#8b8fa8] mb-1.5">
                  <Phone className="w-3 h-3" /> Phones
                </div>
                {identities.phones.map((p) => (
                  <div key={p} className="px-3 py-2 bg-[#0f1117] rounded-lg border border-white/[0.07] text-xs font-mono text-[#00d4aa]">
                    {p}
                  </div>
                ))}
              </div>
            )}
            {identities.usernames.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-xs text-[#8b8fa8] mb-1.5">
                  <User className="w-3 h-3" /> Usernames
                </div>
                {identities.usernames.map((u) => (
                  <div key={u} className="px-3 py-2 bg-[#0f1117] rounded-lg border border-white/[0.07] text-xs font-mono text-[#00d4aa]">
                    {u}
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Row 3: Recent Alerts + Recommended Actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <motion.div {...fadeIn} transition={{ delay: 0.4 }} className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-[#8b8fa8]">Recent Alerts</h3>
            <a href="/dashboard/alerts" className="text-xs text-[#00d4aa] hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-3 h-3" />
            </a>
          </div>
          <div className="space-y-2">
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start gap-3 p-3 rounded-lg bg-[#0f1117] border border-white/[0.07] ${
                  !alert.read ? "border-l-2 border-l-[#00d4aa]" : ""
                }`}
              >
                <SeverityBadge severity={alert.severity} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{alert.title}</p>
                  <p className="text-xs text-[#8b8fa8] mt-0.5">
                    {new Date(alert.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recommended Actions */}
        <motion.div {...fadeIn} transition={{ delay: 0.5 }} className="card p-6">
          <h3 className="text-sm font-medium text-[#8b8fa8] mb-4">Recommended Actions</h3>
          <div className="space-y-2">
            {recommendedActions.map((action) => (
              <div
                key={action.id}
                className={`flex items-center gap-3 p-3 rounded-lg bg-[#0f1117] border border-white/[0.07] ${
                  action.completed ? "opacity-50" : ""
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 ${
                    action.completed
                      ? "bg-[#00d4aa]/20 border-[#00d4aa]/30"
                      : "border-white/20"
                  }`}
                >
                  {action.completed && <CheckCircle2 className="w-3.5 h-3.5 text-[#00d4aa]" />}
                </div>
                <p className={`text-sm flex-1 ${action.completed ? "line-through text-[#8b8fa8]" : "text-[#e8e8e8]"}`}>
                  {action.action}
                </p>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                    action.priority === "critical"
                      ? "bg-red-500/15 text-red-400"
                      : action.priority === "high"
                      ? "bg-orange-500/15 text-orange-400"
                      : "bg-yellow-500/15 text-yellow-400"
                  }`}
                >
                  {action.priority}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Floating Run Scan Button */}
      <button
        onClick={() => setScanning(true)}
        className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 z-30 flex items-center gap-2 px-5 py-3 bg-[#00d4aa] text-black font-semibold rounded-xl shadow-lg hover:bg-[#00d4aa]/90 transition-all glow-teal"
      >
        <Play className="w-4 h-4" /> Run Scan
      </button>

      <ScanModal isOpen={scanning} onComplete={handleScanComplete} />
    </div>
  );
}
