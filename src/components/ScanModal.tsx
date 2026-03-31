"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Database, Globe, Brain, BarChart3, CheckCircle2 } from "lucide-react";

const scanSteps = [
  { label: "Checking breach databases...", icon: Database },
  { label: "Scanning dark web...", icon: Globe },
  { label: "Analyzing phishing threats...", icon: Shield },
  { label: "Running AI analysis...", icon: Brain },
  { label: "Calculating risk score...", icon: BarChart3 },
];

interface ScanModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export default function ScanModal({ isOpen, onComplete }: ScanModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < scanSteps.length) {
          return prev + 1;
        }
        return prev;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    if (currentStep === scanSteps.length) {
      const timer = setTimeout(onComplete, 800);
      return () => clearTimeout(timer);
    }
  }, [currentStep, onComplete]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#1a1d27] border border-white/10 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#00d4aa]/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#00d4aa]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Initial Security Scan</h3>
              <p className="text-sm text-[#8b8fa8]">Analyzing your digital footprint...</p>
            </div>
          </div>

          <div className="space-y-3">
            {scanSteps.map((step, i) => {
              const Icon = step.icon;
              const isComplete = i < currentStep;
              const isCurrent = i === currentStep;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    isCurrent
                      ? "bg-[#00d4aa]/10 border border-[#00d4aa]/20"
                      : isComplete
                      ? "bg-[#00d4aa]/5"
                      : "opacity-40"
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle2 className="w-5 h-5 text-[#00d4aa] flex-shrink-0" />
                  ) : isCurrent ? (
                    <div className="w-5 h-5 flex-shrink-0">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-5 h-5 border-2 border-[#00d4aa] border-t-transparent rounded-full"
                      />
                    </div>
                  ) : (
                    <Icon className="w-5 h-5 text-[#8b8fa8] flex-shrink-0" />
                  )}
                  <span
                    className={`text-sm ${
                      isCurrent ? "text-[#00d4aa] font-medium" : isComplete ? "text-[#e8e8e8]" : "text-[#8b8fa8]"
                    }`}
                  >
                    {step.label}
                  </span>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-6">
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#00d4aa] to-[#00d4aa]/60 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${(currentStep / scanSteps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-xs text-[#8b8fa8] mt-2 text-center">
              {currentStep} of {scanSteps.length} checks complete
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
