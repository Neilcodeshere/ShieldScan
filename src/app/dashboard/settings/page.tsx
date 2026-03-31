"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, User, Bell, Lock, CreditCard, Plus, X, Save, Check } from "lucide-react";
import { getMonitoredIdentities } from "@/lib/aiContext";
import { toast } from "sonner";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("identity");
  const [emails, setEmails] = useState<string[]>([]);
  const [phones, setPhones] = useState<string[]>([]);
  const [usernames, setUsernames] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [pushAlerts, setPushAlerts] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const ids = getMonitoredIdentities();
    setEmails(ids.emails);
    setPhones(ids.phones);
    setUsernames(ids.usernames);
  }, []);

  const saveIdentities = () => {
    localStorage.setItem("monitored_identities", JSON.stringify({ emails, phones, usernames }));
    toast.success("Identities saved successfully", {
      description: "We've scheduled a new background scan for your updated identities.",
    });
  };

  const tabs = [
    { id: "identity", label: "Identity", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Lock },
    { id: "subscription", label: "Subscription", icon: CreditCard },
  ];

  const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? "bg-[#00d4aa]" : "bg-white/10"
      }`}
    >
      <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${enabled ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#00d4aa]" /> Settings
        </h1>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#1a1d27] rounded-xl p-1 border border-white/[0.07] overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id ? "bg-[#00d4aa]/10 text-[#00d4aa]" : "text-[#8b8fa8] hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Identity Tab */}
      {activeTab === "identity" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#e8e8e8] mb-2">Email Addresses</label>
            <div className="flex gap-2 mb-2">
              <input type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (emailInput.trim()) { setEmails([...emails, emailInput.trim()]); setEmailInput(""); }}}}
                className="flex-1 px-4 py-2.5 bg-[#0f1117] border border-white/10 rounded-lg text-sm text-white placeholder-[#8b8fa8] focus:outline-none focus:border-[#00d4aa]/50"
                placeholder="Add email..."
              />
              <button onClick={() => { if (emailInput.trim()) { setEmails([...emails, emailInput.trim()]); setEmailInput(""); }}}
                className="px-3 bg-[#00d4aa]/10 border border-[#00d4aa]/20 rounded-lg text-[#00d4aa] hover:bg-[#00d4aa]/20"><Plus className="w-4 h-4" /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {emails.map((e, i) => (
                <span key={e} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00d4aa]/10 border border-[#00d4aa]/20 rounded-full text-xs font-mono text-[#00d4aa]">
                  {e}
                  <button onClick={() => setEmails(emails.filter((_, j) => j !== i))}><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#e8e8e8] mb-2">Phone Numbers</label>
            <div className="flex gap-2 mb-2">
              <input type="tel" value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (phoneInput.trim()) { setPhones([...phones, phoneInput.trim()]); setPhoneInput(""); }}}}
                className="flex-1 px-4 py-2.5 bg-[#0f1117] border border-white/10 rounded-lg text-sm text-white placeholder-[#8b8fa8] focus:outline-none focus:border-[#00d4aa]/50"
                placeholder="Add phone..."
              />
              <button onClick={() => { if (phoneInput.trim()) { setPhones([...phones, phoneInput.trim()]); setPhoneInput(""); }}}
                className="px-3 bg-[#00d4aa]/10 border border-[#00d4aa]/20 rounded-lg text-[#00d4aa] hover:bg-[#00d4aa]/20"><Plus className="w-4 h-4" /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {phones.map((p, i) => (
                <span key={p} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00d4aa]/10 border border-[#00d4aa]/20 rounded-full text-xs font-mono text-[#00d4aa]">
                  {p}
                  <button onClick={() => setPhones(phones.filter((_, j) => j !== i))}><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#e8e8e8] mb-2">Usernames</label>
            <div className="flex gap-2 mb-2">
              <input type="text" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (usernameInput.trim()) { setUsernames([...usernames, usernameInput.trim()]); setUsernameInput(""); }}}}
                className="flex-1 px-4 py-2.5 bg-[#0f1117] border border-white/10 rounded-lg text-sm text-white placeholder-[#8b8fa8] focus:outline-none focus:border-[#00d4aa]/50"
                placeholder="Add username..."
              />
              <button onClick={() => { if (usernameInput.trim()) { setUsernames([...usernames, usernameInput.trim()]); setUsernameInput(""); }}}
                className="px-3 bg-[#00d4aa]/10 border border-[#00d4aa]/20 rounded-lg text-[#00d4aa] hover:bg-[#00d4aa]/20"><Plus className="w-4 h-4" /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {usernames.map((u, i) => (
                <span key={u} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00d4aa]/10 border border-[#00d4aa]/20 rounded-full text-xs font-mono text-[#00d4aa]">
                  {u}
                  <button onClick={() => setUsernames(usernames.filter((_, j) => j !== i))}><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          </div>

          <button onClick={saveIdentities}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#00d4aa] text-black font-semibold rounded-lg hover:bg-[#00d4aa]/90 transition-colors">
            <Save className="w-4 h-4" /> Save & Re-scan
          </button>
        </motion.div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6 space-y-4">
          {[
            { label: "Email Alerts", desc: "Receive breach alerts via email", state: emailAlerts, setter: setEmailAlerts },
            { label: "SMS Alerts", desc: "Get SMS for critical-severity breaches", state: smsAlerts, setter: setSmsAlerts },
            { label: "Push Notifications", desc: "Browser push notifications for new threats", state: pushAlerts, setter: setPushAlerts },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-4 bg-[#0f1117] rounded-lg border border-white/[0.07]">
              <div>
                <p className="text-sm font-medium text-[#e8e8e8]">{item.label}</p>
                <p className="text-xs text-[#8b8fa8] mt-0.5">{item.desc}</p>
              </div>
              <Toggle enabled={item.state} onChange={item.setter} />
            </div>
          ))}
        </motion.div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6 space-y-4">
          <h3 className="text-sm font-medium text-[#e8e8e8]">Change Password</h3>
          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current password"
            className="w-full px-4 py-2.5 bg-[#0f1117] border border-white/10 rounded-lg text-sm text-white placeholder-[#8b8fa8] focus:outline-none focus:border-[#00d4aa]/50" />
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password"
            className="w-full px-4 py-2.5 bg-[#0f1117] border border-white/10 rounded-lg text-sm text-white placeholder-[#8b8fa8] focus:outline-none focus:border-[#00d4aa]/50" />
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password"
            className="w-full px-4 py-2.5 bg-[#0f1117] border border-white/10 rounded-lg text-sm text-white placeholder-[#8b8fa8] focus:outline-none focus:border-[#00d4aa]/50" />
          <button className="px-5 py-2.5 bg-[#00d4aa] text-black font-semibold rounded-lg hover:bg-[#00d4aa]/90 transition-colors">
            Update Password
          </button>
        </motion.div>
      )}

      {/* Subscription Tab */}
      {activeTab === "subscription" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-6">
          <div className="card p-6 border-2 border-[#00d4aa]/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Free</h3>
              <span className="px-2 py-0.5 bg-[#00d4aa]/10 text-[#00d4aa] text-xs rounded font-medium">Current</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">$0<span className="text-sm text-[#8b8fa8] font-normal">/mo</span></div>
            <ul className="space-y-2 mt-4 text-sm text-[#8b8fa8]">
              {["5 monitored identities", "Basic breach detection", "Weekly reports", "Community support"].map((f) => (
                <li key={f} className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#00d4aa]" />{f}</li>
              ))}
            </ul>
          </div>

          <div className="card p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-l from-[#00d4aa] to-[#00d4aa]/60 text-black text-xs font-bold rounded-bl-lg">PRO</div>
            <h3 className="text-lg font-bold text-white mb-4">Pro</h3>
            <div className="text-3xl font-bold text-white mb-1">$9<span className="text-sm text-[#8b8fa8] font-normal">/mo</span></div>
            <ul className="space-y-2 mt-4 text-sm text-[#8b8fa8]">
              {["Unlimited identities", "Real-time dark web monitoring", "Joi security assistant", "SMS & email alerts", "Priority support", "API access"].map((f) => (
                <li key={f} className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#00d4aa]" />{f}</li>
              ))}
            </ul>
            <button className="w-full mt-6 py-2.5 bg-[#00d4aa] text-black font-semibold rounded-lg hover:bg-[#00d4aa]/90 transition-colors">
              Upgrade to Pro
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
