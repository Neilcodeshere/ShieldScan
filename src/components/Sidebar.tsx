"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldAlert,
  Globe,
  Fish,
  Bot,
  Bell,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/breaches", label: "Breaches", icon: ShieldAlert },
  { href: "/dashboard/darkweb", label: "Dark Web", icon: Globe },
  { href: "/dashboard/phishing", label: "Phishing", icon: Fish },
  { href: "/dashboard/assistant", label: "Joi", icon: Bot },
  { href: "/dashboard/alerts", label: "Alerts", icon: Bell },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#1a1d27] border-r border-white/[0.07] h-screen sticky top-0">
        <div className="p-6 border-b border-white/[0.07]">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00d4aa] to-[#00d4aa]/60 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-black" />
            </div>
            <span className="text-lg font-bold text-white">
              Shield<span className="text-[#00d4aa]">Scan</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#00d4aa]/10 text-[#00d4aa] border border-[#00d4aa]/20"
                    : "text-[#8b8fa8] hover:text-[#e8e8e8] hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/[0.07]">
          <div className="bg-[#0f1117] rounded-lg p-3 border border-white/[0.07]">
            <p className="text-xs text-[#8b8fa8]">Free Plan</p>
            <p className="text-xs text-[#00d4aa] mt-1 flex items-center gap-1">
              <Bot className="w-3 h-3" /> Upgrade to Joi Pro →
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1a1d27] border-t border-white/[0.07] px-2 py-1 flex justify-around">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-2 px-3 text-[10px] transition-colors ${
                isActive ? "text-[#00d4aa]" : "text-[#8b8fa8]"
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
