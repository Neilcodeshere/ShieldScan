"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ShieldAlert,
  Search,
  Globe,
  BarChart3,
  Brain,
  Bot,
  Bell,
  ArrowRight,
  Star,
  ChevronRight,
  Lock,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Breach Detection",
    description: "Scan major breach databases to find if your credentials have been compromised in known data leaks.",
  },
  {
    icon: Globe,
    title: "Dark Web Monitoring",
    description: "Continuous surveillance of dark web marketplaces, paste sites, and underground forums for your data.",
  },
  {
    icon: BarChart3,
    title: "Risk Scoring",
    description: "Get a dynamic cyber risk score based on breach exposure, dark web mentions, and password hygiene.",
  },
  {
    icon: Brain,
    title: "AI Impact Analysis",
    description: "AI analyzes each breach to explain exactly what it means for you and what attackers could do.",
  },
  {
    icon: Bot,
    title: "Joi Security Assistant",
    description: "Chat with Joi, your AI security advisor who knows your exact security situation and gives specific, actionable guidance.",
  },
  {
    icon: Bell,
    title: "Real-Time Alerts",
    description: "Instant email and SMS notifications when new threats targeting your identities are detected.",
  },
];


const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function LandingPage() {
  const [quickScanState, setQuickScanState] = useState<"idle" | "scanning" | "done" | "error">("idle");
  const [quickScanInput, setQuickScanInput] = useState("");
  const [breachCount, setBreachCount] = useState<number | null>(null);

  const handleQuickScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickScanInput.trim()) return;
    
    setQuickScanState("scanning");
    
    try {
      const res = await fetch("/api/scan/breach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: quickScanInput.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        setBreachCount(data.breaches?.length || 0);
        setQuickScanState("done");
      } else {
        setQuickScanState("error");
      }
    } catch {
      setQuickScanState("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1117]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#0f1117]/80 backdrop-blur-xl border-b border-white/[0.07]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00d4aa] to-[#00d4aa]/60 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-black" />
            </div>
            <span className="text-lg font-bold text-white">
              Shield<span className="text-[#00d4aa]">Scan</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm text-[#8b8fa8] hover:text-white transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm bg-[#00d4aa] text-black font-semibold rounded-lg hover:bg-[#00d4aa]/90 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#00d4aa]/5 blur-[120px]" />
          <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-[#00d4aa]/3 blur-[80px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d4aa]/10 border border-[#00d4aa]/20 mb-6">
              <Lock className="w-3.5 h-3.5 text-[#00d4aa]" />
              <span className="text-xs font-medium text-[#00d4aa]">
                Powered by AI — Protecting 50,000+ identities
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight tracking-tight">
              Your personal{" "}
              <span className="gradient-text">cyber guardian</span>
            </h1>

            <p className="mt-6 text-lg text-[#8b8fa8] max-w-xl mx-auto leading-relaxed">
              Monitor your digital identity for data breaches, dark web exposure, and phishing threats.
              Get AI-powered analysis and actionable remediation plans.
            </p>

            {/* Quick Scan Input */}
            <div className="mt-10 max-w-lg mx-auto">
              {quickScanState === "idle" && (
                <form onSubmit={handleQuickScan} className="relative flex items-center shadow-2xl shadow-[#00d4aa]/10 rounded-xl">
                  <div className="absolute left-4 text-[#8b8fa8]">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={quickScanInput}
                    onChange={(e) => setQuickScanInput(e.target.value)}
                    placeholder="Enter email to check exposure..."
                    className="w-full pl-12 pr-36 py-4 bg-[#1a1d27] border border-white/10 rounded-xl text-white placeholder-[#8b8fa8] focus:outline-none focus:border-[#00d4aa]/50 transition-colors"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 px-6 py-2 bg-[#00d4aa] text-black font-semibold rounded-lg hover:bg-[#00d4aa]/90 transition-all"
                  >
                    Check Now
                  </button>
                </form>
              )}

              {quickScanState === "scanning" && (
                <div className="p-6 bg-[#1a1d27] border border-white/10 rounded-xl flex flex-col items-center justify-center gap-4">
                  <div className="w-8 h-8 border-4 border-[#00d4aa]/20 border-t-[#00d4aa] rounded-full animate-spin" />
                  <p className="text-[#e8e8e8] animate-pulse">Scanning 14.5 billion compromised records...</p>
                </div>
              )}

              {quickScanState === "error" && (
                <div className="p-6 bg-[#1a1d27] border border-[#ff4757]/20 rounded-xl text-center">
                  <p className="text-[#ff4757] mb-4">Connection to breach databases failed or timed out.</p>
                  <button onClick={() => setQuickScanState("idle")} className="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition">Try Again</button>
                </div>
              )}

              {quickScanState === "done" && breachCount !== null && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`p-6 border rounded-xl text-center ${breachCount > 0 ? "bg-[#ff4757]/10 border-[#ff4757]/20" : "bg-[#00d4aa]/10 border-[#00d4aa]/20"}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${breachCount > 0 ? "bg-[#ff4757]/20 text-[#ff4757]" : "bg-[#00d4aa]/20 text-[#00d4aa]"}`}>
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  
                  {breachCount > 0 ? (
                    <>
                      <h3 className="text-xl font-bold text-white mb-2">Warning: Data Exposure Detected</h3>
                      <p className="text-[#e8e8e8] mb-6">
                        We found <span className="text-white font-bold">{quickScanInput}</span> in <b className="text-[#ff4757]">{breachCount}</b> data breaches and dark web pastedrops.
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl font-bold text-white mb-2">Good News: No Breaches Found</h3>
                      <p className="text-[#e8e8e8] mb-6">
                        Your email <span className="text-white font-bold">{quickScanInput}</span> appears safe for now. Sign up to monitor it 24/7.
                      </p>
                    </>
                  )}
                  
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#00d4aa] text-black font-semibold rounded-xl hover:bg-[#00d4aa]/90 transition-all glow-teal w-full justify-center"
                  >
                    {breachCount > 0 ? "Unlock Full Report to Secure Identity" : "Enable 24/7 Monitoring"} <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              )}
            </div>

            <div className="mt-6 flex justify-center">
              <Link href="#features" className="text-xs text-[#8b8fa8] hover:text-white flex items-center gap-1 transition-colors">
                Or explore features <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>

          {/* Animated scan graphic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 max-w-3xl mx-auto"
          >
            <div className="relative card p-8 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-[#00d4aa]/5 to-transparent" />
              <div className="relative grid grid-cols-3 gap-4">
                {[
                  { label: "Breaches Found", value: "5", color: "#ff4757" },
                  { label: "Risk Score", value: "72", color: "#ffa502" },
                  { label: "Identities Monitored", value: "3", color: "#00d4aa" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.15 }}
                    className="text-center p-4 rounded-xl bg-white/[0.03] border border-white/[0.07]"
                  >
                    <div className="text-3xl font-bold font-mono" style={{ color: stat.color }}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-[#8b8fa8] mt-1">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Scan line animation */}
              <motion.div
                className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00d4aa] to-transparent"
                animate={{ top: ["0%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-[#0f1117]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d4aa]/10 border border-[#00d4aa]/20 mb-4">
                <Zap className="w-3.5 h-3.5 text-[#00d4aa]" />
                <span className="text-xs font-medium text-[#00d4aa]">Features</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Complete security coverage
              </h2>
              <p className="mt-4 text-[#8b8fa8] max-w-xl mx-auto">
                Six layers of protection monitoring your digital identity around the clock.
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="card card-hover p-6 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#00d4aa]/10 group-hover:bg-[#00d4aa]/20 flex items-center justify-center transition-colors mb-4">
                    <Icon className="w-5 h-5 text-[#00d4aa]" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-[#8b8fa8] leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

  
      {/* CTA */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Start protecting your identity today
            </h2>
            <p className="text-[#8b8fa8] mb-8 max-w-md mx-auto">
              Free to start. No credit card required. Get your first scan in under 60 seconds.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#00d4aa] text-black font-semibold rounded-xl hover:bg-[#00d4aa]/90 transition-all glow-teal text-lg"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.07] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-[#00d4aa] to-[#00d4aa]/60 flex items-center justify-center">
                <ShieldAlert className="w-3 h-3 text-black" />
              </div>
              <span className="text-sm font-bold text-white">
                Shield<span className="text-[#00d4aa]">Scan</span>
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-[#8b8fa8]">
              <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms</Link>
              <Link href="#" className="hover:text-white transition-colors">Contact</Link>
            </div>
            <p className="text-xs text-[#8b8fa8]">© 2024 ShieldScan. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
