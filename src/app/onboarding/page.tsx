"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, User, Plus, X, ArrowRight, ArrowLeft, Check, Shield } from "lucide-react";
import ScanModal from "@/components/ScanModal";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [emails, setEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [phones, setPhones] = useState<string[]>([]);
  const [phoneInput, setPhoneInput] = useState("");
  const [usernames, setUsernames] = useState<string[]>([]);
  const [usernameInput, setUsernameInput] = useState("");
  const [emailError, setEmailError] = useState("");
  const [scanning, setScanning] = useState(false);

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const addEmail = () => {
    const trimmed = emailInput.trim();
    if (!trimmed) return;
    if (!isValidEmail(trimmed)) {
      setEmailError("Enter a valid email address");
      return;
    }
    if (emails.includes(trimmed)) {
      setEmailError("Email already added");
      return;
    }
    setEmails([...emails, trimmed]);
    setEmailInput("");
    setEmailError("");
  };

  const addPhone = () => {
    const trimmed = phoneInput.trim();
    if (trimmed && !phones.includes(trimmed)) {
      setPhones([...phones, trimmed]);
      setPhoneInput("");
    }
  };

  const addUsername = () => {
    const trimmed = usernameInput.trim();
    if (trimmed && !usernames.includes(trimmed)) {
      setUsernames([...usernames, trimmed]);
      setUsernameInput("");
    }
  };

  const handleScanComplete = useCallback(() => {
    setScanning(false);
    router.push("/dashboard");
  }, [router]);

  const startMonitoring = () => {
    localStorage.setItem(
      "monitored_identities",
      JSON.stringify({ emails, phones, usernames })
    );
    localStorage.setItem("onboarding_complete", "true");
    setScanning(true);
  };

  const ChipList = ({ items, onRemove }: { items: string[]; onRemove: (i: number) => void }) => (
    <div className="flex flex-wrap gap-2 mt-2">
      {items.map((item, i) => (
        <motion.span
          key={item}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00d4aa]/10 border border-[#00d4aa]/20 rounded-full text-sm text-[#00d4aa] font-mono"
        >
          {item}
          <button onClick={() => onRemove(i)} className="hover:text-white transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.span>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#00d4aa]/5 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-lg"
      >
        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full bg-[#00d4aa] rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: step >= s ? "100%" : "0%" }}
                transition={{ duration: 0.3 }}
              />
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="card p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#00d4aa]/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#00d4aa]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Add your email addresses</h2>
                  <p className="text-sm text-[#8b8fa8]">We&apos;ll scan these for breaches and dark web exposure</p>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => { setEmailInput(e.target.value); setEmailError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addEmail())}
                  className="flex-1 px-4 py-2.5 bg-[#0f1117] border border-white/10 rounded-lg text-sm text-white placeholder-[#8b8fa8] focus:outline-none focus:border-[#00d4aa]/50 transition-colors"
                  placeholder="you@example.com"
                />
                <button
                  onClick={addEmail}
                  className="px-4 py-2.5 bg-[#00d4aa]/10 border border-[#00d4aa]/20 rounded-lg text-[#00d4aa] hover:bg-[#00d4aa]/20 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {emailError && <p className="text-xs text-[#ff4757] mt-1">{emailError}</p>}

              <ChipList items={emails} onRemove={(i) => setEmails(emails.filter((_, j) => j !== i))} />

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => {
                    if (emails.length === 0) {
                      setEmailError("Add at least one email to continue");
                      return;
                    }
                    setStep(2);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#00d4aa] text-black font-semibold rounded-lg hover:bg-[#00d4aa]/90 transition-colors"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="card p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#00d4aa]/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-[#00d4aa]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Phone numbers & usernames</h2>
                  <p className="text-sm text-[#8b8fa8]">Optional but helps us find more exposure</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#8b8fa8] mb-1.5">Phone numbers</label>
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPhone())}
                      className="flex-1 px-4 py-2.5 bg-[#0f1117] border border-white/10 rounded-lg text-sm text-white placeholder-[#8b8fa8] focus:outline-none focus:border-[#00d4aa]/50 transition-colors"
                      placeholder="+1 234 567 8900"
                    />
                    <button onClick={addPhone} className="px-4 py-2.5 bg-[#00d4aa]/10 border border-[#00d4aa]/20 rounded-lg text-[#00d4aa] hover:bg-[#00d4aa]/20 transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <ChipList items={phones} onRemove={(i) => setPhones(phones.filter((_, j) => j !== i))} />
                </div>

                <div>
                  <label className="block text-sm text-[#8b8fa8] mb-1.5">Usernames</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUsername())}
                      className="flex-1 px-4 py-2.5 bg-[#0f1117] border border-white/10 rounded-lg text-sm text-white placeholder-[#8b8fa8] focus:outline-none focus:border-[#00d4aa]/50 transition-colors"
                      placeholder="johndoe"
                    />
                    <button onClick={addUsername} className="px-4 py-2.5 bg-[#00d4aa]/10 border border-[#00d4aa]/20 rounded-lg text-[#00d4aa] hover:bg-[#00d4aa]/20 transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <ChipList items={usernames} onRemove={(i) => setUsernames(usernames.filter((_, j) => j !== i))} />
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 px-4 py-2.5 text-[#8b8fa8] hover:text-white transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={() => setStep(3)} className="flex items-center gap-2 px-5 py-2.5 bg-[#00d4aa] text-black font-semibold rounded-lg hover:bg-[#00d4aa]/90 transition-colors">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="card p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#00d4aa]/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#00d4aa]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Ready to scan</h2>
                  <p className="text-sm text-[#8b8fa8]">Review your monitored identities</p>
                </div>
              </div>

              <div className="space-y-4 bg-[#0f1117] rounded-xl p-4 border border-white/[0.07]">
                <div>
                  <div className="flex items-center gap-2 text-sm text-[#8b8fa8] mb-2">
                    <Mail className="w-3.5 h-3.5" /> Emails ({emails.length})
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {emails.map((e) => (
                      <span key={e} className="px-2.5 py-1 bg-[#00d4aa]/10 rounded-full text-xs font-mono text-[#00d4aa]">{e}</span>
                    ))}
                  </div>
                </div>

                {phones.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-[#8b8fa8] mb-2">
                      <Phone className="w-3.5 h-3.5" /> Phones ({phones.length})
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {phones.map((p) => (
                        <span key={p} className="px-2.5 py-1 bg-[#00d4aa]/10 rounded-full text-xs font-mono text-[#00d4aa]">{p}</span>
                      ))}
                    </div>
                  </div>
                )}

                {usernames.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-[#8b8fa8] mb-2">
                      <User className="w-3.5 h-3.5" /> Usernames ({usernames.length})
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {usernames.map((u) => (
                        <span key={u} className="px-2.5 py-1 bg-[#00d4aa]/10 rounded-full text-xs font-mono text-[#00d4aa]">{u}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-6">
                <button onClick={() => setStep(2)} className="flex items-center gap-2 px-4 py-2.5 text-[#8b8fa8] hover:text-white transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={startMonitoring}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#00d4aa] text-black font-semibold rounded-lg hover:bg-[#00d4aa]/90 transition-all glow-teal"
                >
                  <Check className="w-4 h-4" /> Start Monitoring
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <ScanModal isOpen={scanning} onComplete={handleScanComplete} />
    </div>
  );
}
