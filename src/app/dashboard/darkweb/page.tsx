"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Globe, Info, ShieldCheck, AlertTriangle, Eye, MessageSquare, FileText } from "lucide-react";
import SeverityBadge from "@/components/SeverityBadge";
import { getMockDarkWebMentions, DarkWebMention } from "@/lib/mockData";

const platformIcons: Record<string, typeof Globe> = {
  "Underground Forum": MessageSquare,
  "Paste Site": FileText,
  "Telegram Channel": MessageSquare,
};

export default function DarkWebPage() {
  const [mentions, setMentions] = useState<DarkWebMention[]>([]);

  useEffect(() => {
    setMentions(getMockDarkWebMentions());
  }, []);

  const activeMentions = mentions.filter((m) => m.status === "active");
  const resolvedMentions = mentions.filter((m) => m.status === "resolved");

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Globe className="w-6 h-6 text-[#00d4aa]" /> Dark Web Monitoring
        </h1>
        <p className="text-sm text-[#8b8fa8] mt-1">Monitoring underground forums, paste sites, and marketplaces for your data</p>
      </motion.div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="card p-4 flex items-start gap-3 border-l-2 border-l-[#00d4aa]"
      >
        <Info className="w-5 h-5 text-[#00d4aa] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-[#e8e8e8] font-medium">Dark Web Intelligence</p>
          <p className="text-xs text-[#8b8fa8] mt-1 leading-relaxed">
            ShieldScan integrates with SpyCloud and DarkOwl APIs to continuously monitor underground marketplaces,
            paste sites, Telegram channels, and forums for your exposed credentials and personal data.
            Scans run every 24 hours.
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="grid grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold font-mono text-[#ff4757]">{mentions.length}</div>
          <div className="text-xs text-[#8b8fa8] mt-1">Total Mentions</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold font-mono text-[#ffa502]">{activeMentions.length}</div>
          <div className="text-xs text-[#8b8fa8] mt-1">Active Threats</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold font-mono text-[#00d4aa]">{resolvedMentions.length}</div>
          <div className="text-xs text-[#8b8fa8] mt-1">Resolved</div>
        </div>
      </motion.div>

      {/* Active Mentions */}
      {activeMentions.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-[#8b8fa8] mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#ff4757]" /> Active Threats
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {activeMentions.map((mention, i) => {
              const Icon = platformIcons[mention.platform] || Globe;
              return (
                <motion.div
                  key={mention.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="card card-hover p-5 border-l-2 border-l-[#ff4757]"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#ff4757]/10 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-[#ff4757]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{mention.platform}</p>
                        <p className="text-xs text-[#8b8fa8]">{mention.dateFound}</p>
                      </div>
                    </div>
                    <SeverityBadge severity={mention.risk} />
                  </div>

                  <div className="mb-3">
                    <span className="px-2 py-1 bg-white/5 rounded text-xs font-mono text-[#ffa502]">
                      {mention.dataType}
                    </span>
                  </div>

                  <p className="text-sm text-[#8b8fa8] leading-relaxed">{mention.description}</p>

                  <div className="mt-3 pt-3 border-t border-white/[0.07] flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5 text-[#8b8fa8]" />
                    <span className="text-xs text-[#8b8fa8]">Monitoring active</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Resolved Mentions */}
      {resolvedMentions.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-[#8b8fa8] mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00d4aa]" /> Resolved
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {resolvedMentions.map((mention, i) => {
              const Icon = platformIcons[mention.platform] || Globe;
              return (
                <motion.div
                  key={mention.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="card p-5 opacity-60"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#00d4aa]/10 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-[#00d4aa]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{mention.platform}</p>
                        <p className="text-xs text-[#8b8fa8]">{mention.dateFound}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#00d4aa]/10 text-[#00d4aa] uppercase">Resolved</span>
                  </div>
                  <p className="text-sm text-[#8b8fa8] leading-relaxed">{mention.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {mentions.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-12 text-center">
          <ShieldCheck className="w-12 h-12 text-[#00d4aa] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No dark web mentions found</h3>
          <p className="text-sm text-[#8b8fa8] max-w-md mx-auto">
            Great news! We haven&apos;t found your data on any monitored dark web sources. We&apos;ll continue scanning and alert you if anything changes.
          </p>
        </motion.div>
      )}
    </div>
  );
}
