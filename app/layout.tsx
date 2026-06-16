import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pulse Analytics — SaaS Dashboard",
  description:
    "Monitor your business performance with real-time analytics, KPI tracking, and actionable insights.",
  keywords: ["analytics", "dashboard", "SaaS", "metrics", "KPI"],
  authors: [{ name: "Pulse Analytics" }],
  openGraph: {
    title: "Pulse Analytics — SaaS Dashboard",
    description: "Monitor your business performance with real-time analytics.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#0F0F1A] text-slate-100 antialiased font-sans min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}