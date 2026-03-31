"use client";

import { Bell, User } from "lucide-react";
import Link from "next/link";
import { useNotifications } from "./NotificationContext";
import RiskScoreBadge from "./RiskScoreBadge";

export default function TopBar() {
  const { unreadCount } = useNotifications();

  return (
    <header className="sticky top-0 z-30 bg-[#1a1d27]/80 backdrop-blur-xl border-b border-white/[0.07]">
      <div className="flex items-center justify-between px-6 h-16">
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00d4aa] to-[#00d4aa]/60 flex items-center justify-center">
            <span className="text-black font-bold text-xs">SS</span>
          </div>
          <span className="text-sm font-bold text-white">
            Shield<span className="text-[#00d4aa]">Scan</span>
          </span>
        </div>

        {/* Desktop spacer */}
        <div className="hidden lg:block lg:flex-1 ml-6" />

        <div className="flex items-center gap-4">
          <RiskScoreBadge score={72} size="sm" />

          <Link
            href="/dashboard/alerts"
            className="relative p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <Bell className="w-5 h-5 text-[#8b8fa8]" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#ff4757] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>

          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00d4aa]/30 to-[#00d4aa]/10 border border-[#00d4aa]/20 flex items-center justify-center cursor-pointer hover:border-[#00d4aa]/40 transition-colors">
            <User className="w-4 h-4 text-[#00d4aa]" />
          </div>
        </div>
      </div>
    </header>
  );
}
