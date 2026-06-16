"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Bell, User, Sparkles, ChevronDown } from 'lucide-react';
import { navLinks, APP_NAME } from "@/lib/data";
import { fadeIn, staggerContainer, fadeInUp } from "@/lib/motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setNotifOpen(false);
  }, [pathname]);

  const notifications = [
    { id: 1, text: "Revenue milestone reached: $50k MRR", time: "2m ago", dot: "bg-indigo-500" },
    { id: 2, text: "New user cohort report is ready", time: "18m ago", dot: "bg-violet-500" },
    { id: 3, text: "Churn rate dropped 0.4% this week", time: "1h ago", dot: "bg-emerald-500" },
  ];

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0F0F1A]/90 backdrop-blur-xl border-b border-[#2D2D4E]/60 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ scale: 1.08, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30"
            >
              <Sparkles className="w-4 h-4 text-white" />
            </motion.div>
            <span className="font-bold text-lg tracking-tight text-white group-hover:text-indigo-300 transition-colors">
              {APP_NAME}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <motion.span
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 block ${
                      isActive
                        ? "text-white bg-indigo-500/20 border border-indigo-500/30"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-lg bg-indigo-500/10 border border-indigo-500/20"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                  </motion.span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-2">
            {/* Notifications */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => setNotifOpen((v) => !v)}
                className="relative w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-[#0F0F1A]" />
              </motion.button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 top-12 w-80 bg-[#16162A] border border-[#2D2D4E] rounded-xl shadow-2xl shadow-black/40 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-[#2D2D4E] flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">Notifications</span>
                      <span className="text-xs text-indigo-400 font-medium">3 new</span>
                    </div>
                    <div className="divide-y divide-[#2D2D4E]">
                      {notifications.map((n) => (
                        <div key={n.id} className="px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer">
                          <div className="flex items-start gap-3">
                            <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${n.dot}`} />
                            <div>
                              <p className="text-sm text-slate-200 leading-snug">{n.text}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{n.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2.5 border-t border-[#2D2D4E]">
                      <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                        View all notifications →
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Avatar */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-medium text-slate-300">Alex Kim</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen((v) => !v)}
            className="md:hidden w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="md:hidden overflow-hidden bg-[#0F0F1A]/95 backdrop-blur-xl border-b border-[#2D2D4E]"
          >
            <motion.nav
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="px-4 py-4 space-y-1"
            >
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div key={link.href} variants={fadeInUp}>
                    <Link
                      href={link.href}
                      className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? "bg-indigo-500/20 text-white border border-indigo-500/30"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
              <motion.div variants={fadeInUp} className="pt-3 border-t border-[#2D2D4E] flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Alex Kim</p>
                  <p className="text-xs text-slate-500">alex@company.io</p>
                </div>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}