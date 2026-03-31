"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, ShieldAlert, Globe, Fish, Settings, Check, Filter } from "lucide-react";
import SeverityBadge from "@/components/SeverityBadge";
import { useNotifications } from "@/components/NotificationContext";

const typeIcons: Record<string, typeof Bell> = {
  breach: ShieldAlert,
  darkweb: Globe,
  phishing: Fish,
  system: Settings,
};

const typeColors: Record<string, string> = {
  breach: "#ff4757",
  darkweb: "#ffa502",
  phishing: "#ffa502",
  system: "#00d4aa",
};

export default function AlertsPage() {
  const { alerts, markAsRead, markAllAsRead, unreadCount } = useNotifications();
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filtered = alerts.filter((a) => typeFilter === "all" || a.type === typeFilter);

  const formatTime = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#00d4aa]" /> Alerts
          </h1>
          <p className="text-sm text-[#8b8fa8] mt-1">
            {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#00d4aa]/10 border border-[#00d4aa]/20 rounded-lg text-xs text-[#00d4aa] hover:bg-[#00d4aa]/20 transition-colors"
          >
            <Check className="w-3.5 h-3.5" /> Mark all read
          </button>
        )}
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex gap-2 flex-wrap">
        {["all", "breach", "darkweb", "phishing", "system"].map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors capitalize ${
              typeFilter === t ? "bg-[#00d4aa]/10 text-[#00d4aa] border border-[#00d4aa]/20" : "bg-[#1a1d27] text-[#8b8fa8] border border-white/[0.07] hover:text-white"
            }`}
          >
            {t === "darkweb" ? "Dark Web" : t}
          </button>
        ))}
      </motion.div>

      {/* Alert Feed */}
      <div className="space-y-2">
        {filtered.map((alert, i) => {
          const Icon = typeIcons[alert.type] || Bell;
          const color = typeColors[alert.type] || "#8b8fa8";

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`card card-hover p-4 flex items-start gap-4 ${
                !alert.read ? "border-l-2 border-l-[#00d4aa]" : ""
              }`}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${color}15` }}
              >
                <Icon className="w-4 h-4" style={{ color }} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-sm font-semibold ${!alert.read ? "text-white" : "text-[#8b8fa8]"}`}>
                    {alert.title}
                  </span>
                  <SeverityBadge severity={alert.severity} />
                </div>
                <p className="text-xs text-[#8b8fa8] leading-relaxed mb-1.5">{alert.description}</p>
                <div className="flex items-center gap-3 text-[10px] text-[#8b8fa8]">
                  <span className="font-mono">{alert.affectedIdentity}</span>
                  <span>•</span>
                  <span>{formatTime(alert.timestamp)}</span>
                </div>
              </div>

              {!alert.read && (
                <button
                  onClick={() => markAsRead(alert.id)}
                  className="flex-shrink-0 p-2 hover:bg-white/5 rounded-lg transition-colors"
                  title="Mark as read"
                >
                  <Check className="w-4 h-4 text-[#8b8fa8] hover:text-[#00d4aa]" />
                </button>
              )}
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <div className="card p-12 text-center">
            <Bell className="w-10 h-10 text-[#00d4aa] mx-auto mb-3 opacity-50" />
            <p className="text-sm text-[#8b8fa8]">No alerts match your filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
