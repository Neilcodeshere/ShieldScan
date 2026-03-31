"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Filter, ChevronDown, ChevronUp, Brain, Calendar, Search } from "lucide-react";
import ReactMarkdown from "react-markdown";
import SeverityBadge from "@/components/SeverityBadge";
import TypingIndicator from "@/components/TypingIndicator";
import { getMockBreaches, Breach } from "@/lib/mockData";
import { getMonitoredIdentities } from "@/lib/aiContext";

export default function BreachesPage() {
  const [breaches, setBreaches] = useState<Breach[]>([]);
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [aiResponses, setAiResponses] = useState<Record<string, string>>({});
  const [sortField, setSortField] = useState<"name" | "date" | "severity">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const ids = getMonitoredIdentities();
    setBreaches(getMockBreaches(ids.emails[0]));
  }, []);

  const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };

  const filtered = breaches
    .filter((b) => severityFilter === "all" || b.severity === severityFilter)
    .filter((b) => b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.affectedAccount.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      let cmp = 0;
      if (sortField === "name") cmp = a.name.localeCompare(b.name);
      else if (sortField === "date") cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
      else cmp = severityOrder[a.severity] - severityOrder[b.severity];
      return sortDir === "desc" ? -cmp : cmp;
    });

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  const SortIcon = ({ field }: { field: typeof sortField }) =>
    sortField === field ? (sortDir === "desc" ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />) : null;

  const analyseWithAI = async (breach: Breach) => {
    setAnalyzingId(breach.id);
    setAiResponses((prev) => ({ ...prev, [breach.id]: "" }));

    try {
      const res = await fetch("/api/ai/analyse-breach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ breachName: breach.name, breachDetails: breach.description }),
      });

      if (!res.ok || !res.body) {
        setAiResponses((prev) => ({
          ...prev,
          [breach.id]: `The ${breach.name} breach exposed ${breach.dataExposed.join(", ")} for ${breach.affectedAccount}. This is a ${breach.severity} severity incident. Given the exposed data types, attackers could attempt credential stuffing across your other accounts. Immediately change passwords and enable 2FA on all connected services.`,
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
        fullText += decoder.decode(value);
        setAiResponses((prev) => ({ ...prev, [breach.id]: fullText }));
      }
    } catch {
      setAiResponses((prev) => ({
        ...prev,
        [breach.id]: `Analysis: The ${breach.name} breach is ${breach.severity} severity. Your account ${breach.affectedAccount} has exposed data including ${breach.dataExposed.join(", ")}. Take immediate action to secure your accounts.`,
      }));
    }
    setAnalyzingId(null);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-[#00d4aa]" /> Data Breaches
        </h1>
        <p className="text-sm text-[#8b8fa8] mt-1">All breaches associated with your monitored identities</p>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b8fa8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search breaches..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#1a1d27] border border-white/[0.07] rounded-lg text-sm text-white placeholder-[#8b8fa8] focus:outline-none focus:border-[#00d4aa]/50 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {["all", "critical", "high", "medium", "low"].map((s) => (
            <button
              key={s}
              onClick={() => setSeverityFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors capitalize ${
                severityFilter === s ? "bg-[#00d4aa]/10 text-[#00d4aa] border border-[#00d4aa]/20" : "bg-[#1a1d27] text-[#8b8fa8] border border-white/[0.07] hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="card overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-white/[0.02] border-b border-white/[0.07] text-xs text-[#8b8fa8] font-medium uppercase">
          <button onClick={() => toggleSort("name")} className="col-span-2 flex items-center gap-1 hover:text-white transition-colors">
            Breach <SortIcon field="name" />
          </button>
          <button onClick={() => toggleSort("date")} className="col-span-2 flex items-center gap-1 hover:text-white transition-colors">
            Date <SortIcon field="date" />
          </button>
          <div className="col-span-2">Account</div>
          <div className="col-span-3">Data Exposed</div>
          <button onClick={() => toggleSort("severity")} className="col-span-1 flex items-center gap-1 hover:text-white transition-colors">
            Severity <SortIcon field="severity" />
          </button>
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Action</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-white/[0.07]">
          {filtered.map((breach, i) => (
            <div key={breach.id}>
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-4 py-4 hover:bg-white/[0.02] transition-colors cursor-pointer"
                onClick={() => setExpandedId(expandedId === breach.id ? null : breach.id)}
              >
                <div className="md:col-span-2 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#ff4757] flex-shrink-0 md:block hidden" />
                  <span className="text-sm font-semibold text-white">{breach.name}</span>
                  <span className="md:hidden"><SeverityBadge severity={breach.severity} /></span>
                </div>
                <div className="md:col-span-2 flex items-center gap-1.5 text-xs text-[#8b8fa8]">
                  <Calendar className="w-3 h-3 md:block hidden" /> {breach.date}
                </div>
                <div className="md:col-span-2 text-xs font-mono text-[#00d4aa] truncate">{breach.affectedAccount}</div>
                <div className="md:col-span-3 flex flex-wrap gap-1">
                  {breach.dataExposed.map((d) => (
                    <span key={d} className="px-1.5 py-0.5 bg-white/5 rounded text-[10px] font-mono text-[#8b8fa8]">{d}</span>
                  ))}
                </div>
                <div className="md:col-span-1 hidden md:block"><SeverityBadge severity={breach.severity} /></div>
                <div className="md:col-span-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${breach.status === "new" ? "bg-[#00d4aa]/10 text-[#00d4aa]" : "bg-white/5 text-[#8b8fa8]"}`}>
                    {breach.status}
                  </span>
                </div>
                <div className="md:col-span-1">
                  {expandedId === breach.id ? <ChevronUp className="w-4 h-4 text-[#8b8fa8]" /> : <ChevronDown className="w-4 h-4 text-[#8b8fa8]" />}
                </div>
              </motion.div>

              <AnimatePresence>
                {expandedId === breach.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-3">
                      <div className="bg-[#0f1117] rounded-lg p-4 border border-white/[0.07]">
                        <p className="text-sm text-[#e8e8e8] leading-relaxed mb-3">{breach.description}</p>
                        <p className="text-xs text-[#8b8fa8]">
                          <strong className="text-[#e8e8e8]">Recommended action:</strong> Change your password for {breach.affectedAccount} and enable 2FA immediately.
                        </p>
                      </div>

                      <button
                        onClick={(e) => { e.stopPropagation(); analyseWithAI(breach); }}
                        disabled={analyzingId === breach.id}
                        className="flex items-center gap-2 px-4 py-2 bg-[#00d4aa]/10 border border-[#00d4aa]/20 rounded-lg text-sm text-[#00d4aa] hover:bg-[#00d4aa]/20 transition-colors disabled:opacity-50"
                      >
                        <Brain className="w-4 h-4" /> Analyse with AI
                      </button>

                      {(analyzingId === breach.id || aiResponses[breach.id]) && (
                        <div className="bg-[#00d4aa]/5 border border-[#00d4aa]/10 rounded-lg p-4">
                          {analyzingId === breach.id && !aiResponses[breach.id] ? (
                            <TypingIndicator />
                          ) : (
                            <div className="flex gap-2">
                              <Brain className="w-4 h-4 text-[#00d4aa] flex-shrink-0 mt-0.5" />
                              <div className="text-sm text-[#e8e8e8] prose prose-invert prose-p:leading-relaxed prose-pre:bg-black/50 prose-a:text-[#00d4aa] max-w-none">
                                <ReactMarkdown>{aiResponses[breach.id]}</ReactMarkdown>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="p-12 text-center text-sm text-[#8b8fa8]">No breaches match your filter criteria.</div>
        )}
      </motion.div>
    </div>
  );
}
