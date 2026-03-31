import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShieldScan — Personal Data Leak Early Warning System",
  description: "Monitor your digital identity for data breaches, dark web exposure, and phishing threats. AI-powered cybersecurity dashboard.",
  keywords: ["cybersecurity", "data breach", "dark web monitoring", "phishing detection", "security dashboard"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body className="min-h-full bg-[#0f1117] text-[#e8e8e8] antialiased">
        {children}
        <Toaster theme="dark" position="bottom-right" toastOptions={{ className: 'font-mono text-sm' }} />
      </body>
    </html>
  );
}
