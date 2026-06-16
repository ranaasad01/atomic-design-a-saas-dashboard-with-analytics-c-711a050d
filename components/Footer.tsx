"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Code2 as Github, MessageCircle as Twitter, Briefcase as Linkedin, Heart } from 'lucide-react';
import { APP_NAME, APP_TAGLINE, navLinks } from "@/lib/data";
import { fadeInUp, staggerContainer } from "@/lib/motion";

const footerSections = [
  {
    title: "Product",
    links: [
      { label: "Overview", href: "/" },
      { label: "Analytics", href: "/analytics" },
      { label: "Users", href: "/users" },
      { label: "Revenue", href: "/revenue" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Settings", href: "/settings" },
      { label: "Profile", href: "/settings" },
      { label: "Billing", href: "/revenue" },
      { label: "Notifications", href: "/settings" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/" },
      { label: "Blog", href: "/" },
      { label: "Careers", href: "/" },
      { label: "Contact", href: "/" },
    ],
  },
];

const socialLinks = [
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0A0A14] border-t border-[#2D2D4E]/60 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10"
        >
          {/* Brand Column */}
          <motion.div variants={fadeInUp} className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group w-fit">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white group-hover:text-indigo-300 transition-colors">
                {APP_NAME}
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs mb-6">
              {APP_TAGLINE} Track revenue, users, and growth metrics in one unified dashboard.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.93 }}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-indigo-500/20 hover:border-indigo-500/30 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Link Columns */}
          {footerSections.map((section) => (
            <motion.div key={section.title} variants={fadeInUp}>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-indigo-300 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-5 border-t border-[#2D2D4E]/60 flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-slate-600 flex items-center gap-1.5">
            Built with{" "}
            <Heart className="w-3 h-3 text-indigo-500 fill-indigo-500" />
            {" "}for data-driven teams
          </p>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}