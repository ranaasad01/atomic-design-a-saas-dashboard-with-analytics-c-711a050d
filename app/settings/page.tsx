"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Bell, Eye, CreditCard, Check, Camera, Shield, Moon, Sun, Monitor, Download, AlertCircle, Star, ChevronDown, Sparkles } from 'lucide-react';
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";
import { BRAND_COLORS } from "@/lib/data";

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = "account" | "notifications" | "appearance" | "billing";

interface ProfileForm {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  role: string;
  bio: string;
  timezone: string;
}

interface NotifSettings {
  emailDigest: boolean;
  revenueAlerts: boolean;
  userMilestones: boolean;
  churnWarnings: boolean;
  weeklyReport: boolean;
  productUpdates: boolean;
  securityAlerts: boolean;
  teamActivity: boolean;
}

interface Invoice {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: "Paid" | "Pending" | "Failed";
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INVOICES: Invoice[] = [
  { id: "INV-2024-012", date: "Dec 1, 2024", description: "Pulse Analytics Pro — Monthly", amount: "$149.00", status: "Paid" },
  { id: "INV-2024-011", date: "Nov 1, 2024", description: "Pulse Analytics Pro — Monthly", amount: "$149.00", status: "Paid" },
  { id: "INV-2024-010", date: "Oct 1, 2024", description: "Pulse Analytics Pro — Monthly", amount: "$149.00", status: "Paid" },
  { id: "INV-2024-009", date: "Sep 1, 2024", description: "Pulse Analytics Pro — Monthly", amount: "$149.00", status: "Paid" },
  { id: "INV-2024-008", date: "Aug 1, 2024", description: "Pulse Analytics Starter — Monthly", amount: "$49.00", status: "Paid" },
  { id: "INV-2024-007", date: "Jul 1, 2024", description: "Pulse Analytics Starter — Monthly", amount: "$49.00", status: "Failed" },
];

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "account", label: "Account", icon: <User className="w-4 h-4" /> },
  { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
  { id: "appearance", label: "Appearance", icon: <Eye className="w-4 h-4" /> },
  { id: "billing", label: "Billing", icon: <CreditCard className="w-4 h-4" /> },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="text-sm text-slate-400 mt-1">{description}</p>
    </div>
  );
}

function FormField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-300">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

function StyledInput({
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    />
  );
}

function StyledTextarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/60 transition-all resize-none"
    />
  );
}

function StyledSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/60 transition-all pr-10"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#1A1A2E]">
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
    </div>
  );
}

function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <motion.button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      whileTap={{ scale: 0.93 }}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-[#16162A] ${
        enabled ? "bg-indigo-500" : "bg-[#2D2D4E]"
      }`}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`inline-block h-4 w-4 rounded-full bg-white shadow-md ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </motion.button>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[#16162A] border border-[#2D2D4E] rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  );
}

function SaveButton({ onClick, saved }: { onClick: () => void; saved: boolean }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
        saved
          ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
          : "bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/25"
      }`}
    >
      {saved ? (
        <>
          <Check className="w-4 h-4" />
          Saved!
        </>
      ) : (
        "Save Changes"
      )}
    </motion.button>
  );
}

// ─── Tab Panels ───────────────────────────────────────────────────────────────

function AccountTab() {
  const [form, setForm] = useState<ProfileForm>({
    firstName: "Alex",
    lastName: "Morgan",
    email: "alex.morgan@company.io",
    company: "Acme Corp",
    role: "Growth Lead",
    bio: "Passionate about data-driven growth and building products people love.",
    timezone: "America/New_York",
  });
  const [saved, setSaved] = useState(false);

  const set = (key: keyof ProfileForm) => (val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const timezones = [
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "America/Chicago", label: "Central Time (CT)" },
    { value: "America/Denver", label: "Mountain Time (MT)" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
    { value: "Europe/London", label: "London (GMT)" },
    { value: "Europe/Paris", label: "Paris (CET)" },
    { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Avatar */}
      <motion.div variants={fadeInUp}>
        <Card>
          <SectionHeader
            title="Profile Photo"
            description="Your avatar is shown across the dashboard and in team views."
          />
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-500/30">
                {(form.firstName?.[0] ?? "A")}{(form.lastName?.[0] ?? "M")}
              </div>
              <motion.div
                whileHover={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                className="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center cursor-pointer transition-opacity"
              >
                <Camera className="w-5 h-5 text-white" />
              </motion.div>
            </div>
            <div>
              <p className="text-sm font-medium text-white mb-1">
                {form.firstName} {form.lastName}
              </p>
              <p className="text-xs text-slate-400 mb-3">{form.role} · {form.company}</p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all"
              >
                Upload new photo
              </motion.button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Personal Info */}
      <motion.div variants={fadeInUp}>
        <Card>
          <SectionHeader
            title="Personal Information"
            description="Update your name, email, and professional details."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="First Name">
              <StyledInput value={form.firstName} onChange={set("firstName")} placeholder="First name" />
            </FormField>
            <FormField label="Last Name">
              <StyledInput value={form.lastName} onChange={set("lastName")} placeholder="Last name" />
            </FormField>
            <FormField label="Email Address" hint="Used for login and notifications.">
              <StyledInput value={form.email} onChange={set("email")} type="email" placeholder="you@company.com" />
            </FormField>
            <FormField label="Company">
              <StyledInput value={form.company} onChange={set("company")} placeholder="Your company" />
            </FormField>
            <FormField label="Role / Title">
              <StyledInput value={form.role} onChange={set("role")} placeholder="e.g. Growth Lead" />
            </FormField>
            <FormField label="Timezone">
              <StyledSelect value={form.timezone} onChange={set("timezone")} options={timezones} />
            </FormField>
            <div className="sm:col-span-2">
              <FormField label="Bio" hint="A short description shown on your profile.">
                <StyledTextarea value={form.bio} onChange={set("bio")} placeholder="Tell your team a bit about yourself…" rows={3} />
              </FormField>
            </div>
          </div>
          <div className="flex justify-end mt-5">
            <SaveButton onClick={handleSave} saved={saved} />
          </div>
        </Card>
      </motion.div>

      {/* Security */}
      <motion.div variants={fadeInUp}>
        <Card>
          <SectionHeader
            title="Security"
            description="Manage your password and two-factor authentication."
          />
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#1A1A2E] border border-[#2D2D4E]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Password</p>
                  <p className="text-xs text-slate-400">Last changed 3 months ago</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all"
              >
                Change
              </motion.button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#1A1A2E] border border-[#2D2D4E]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                  <Check className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Two-Factor Authentication</p>
                  <p className="text-xs text-emerald-400">Enabled via authenticator app</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all"
              >
                Manage
              </motion.button>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}

function NotificationsTab() {
  const [notifs, setNotifs] = useState<NotifSettings>({
    emailDigest: true,
    revenueAlerts: true,
    userMilestones: true,
    churnWarnings: true,
    weeklyReport: false,
    productUpdates: true,
    securityAlerts: true,
    teamActivity: false,
  });
  const [saved, setSaved] = useState(false);

  const toggle = (key: keyof NotifSettings) =>
    setNotifs((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const groups: {
    title: string;
    description: string;
    items: { key: keyof NotifSettings; label: string; desc: string }[];
  }[] = [
    {
      title: "Revenue & Growth",
      description: "Alerts tied to your key business metrics.",
      items: [
        { key: "revenueAlerts", label: "Revenue Alerts", desc: "Notify when MRR crosses a milestone or drops unexpectedly." },
        { key: "userMilestones", label: "User Milestones", desc: "Celebrate when you hit 100, 500, 1k, or 10k users." },
        { key: "churnWarnings", label: "Churn Warnings", desc: "Early warning when churn rate rises above your threshold." },
      ],
    },
    {
      title: "Reports & Digests",
      description: "Scheduled summaries delivered to your inbox.",
      items: [
        { key: "emailDigest", label: "Daily Email Digest", desc: "A morning summary of yesterday's key metrics." },
        { key: "weeklyReport", label: "Weekly Report", desc: "Comprehensive weekly performance report every Monday." },
      ],
    },
    {
      title: "Platform & Team",
      description: "Updates about the product and your workspace.",
      items: [
        { key: "productUpdates", label: "Product Updates", desc: "New features, improvements, and release notes." },
        { key: "securityAlerts", label: "Security Alerts", desc: "Login from new device, password changes, and more." },
        { key: "teamActivity", label: "Team Activity", desc: "When teammates join, leave, or change permissions." },
      ],
    },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {groups.map((group) => (
        <motion.div key={group.title} variants={fadeInUp}>
          <Card>
            <SectionHeader title={group.title} description={group.description} />
            <div className="space-y-1">
              {group.items.map((item, idx) => (
                <motion.div
                  key={item.key}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                  className={`flex items-center justify-between py-3.5 px-1 rounded-xl transition-colors ${
                    idx < group.items.length - 1 ? "border-b border-[#2D2D4E]/60" : ""
                  }`}
                >
                  <div className="flex-1 pr-6">
                    <p className="text-sm font-medium text-white">{item.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                  <Toggle enabled={notifs[item.key]} onChange={() => toggle(item.key)} />
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      ))}
      <motion.div variants={fadeInUp} className="flex justify-end">
        <SaveButton onClick={handleSave} saved={saved} />
      </motion.div>
    </motion.div>
  );
}

function AppearanceTab() {
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");
  const [accentColor, setAccentColor] = useState<string>("#6366F1");
  const [density, setDensity] = useState<"compact" | "default" | "comfortable">("default");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const themes: { id: "dark" | "light" | "system"; label: string; icon: React.ReactNode; preview: string }[] = [
    {
      id: "dark",
      label: "Dark",
      icon: <Moon className="w-4 h-4" />,
      preview: "bg-gradient-to-br from-[#0F0F1A] to-[#1A1A2E]",
    },
    {
      id: "light",
      label: "Light",
      icon: <Sun className="w-4 h-4" />,
      preview: "bg-gradient-to-br from-slate-100 to-slate-200",
    },
    {
      id: "system",
      label: "System",
      icon: <Monitor className="w-4 h-4" />,
      preview: "bg-gradient-to-br from-[#0F0F1A] via-slate-400 to-slate-100",
    },
  ];

  const accents = [
    { color: "#6366F1", label: "Indigo" },
    { color: "#8B5CF6", label: "Violet" },
    { color: "#06B6D4", label: "Cyan" },
    { color: "#10B981", label: "Emerald" },
    { color: "#F59E0B", label: "Amber" },
    { color: "#EF4444", label: "Rose" },
  ];

  const densities: { id: "compact" | "default" | "comfortable"; label: string; desc: string }[] = [
    { id: "compact", label: "Compact", desc: "More data, less whitespace" },
    { id: "default", label: "Default", desc: "Balanced layout" },
    { id: "comfortable", label: "Comfortable", desc: "Generous spacing" },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Theme */}
      <motion.div variants={fadeInUp}>
        <Card>
          <SectionHeader title="Color Theme" description="Choose how Pulse Analytics looks for you." />
          <div className="grid grid-cols-3 gap-3">
            {themes.map((t) => (
              <motion.button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  theme === t.id
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-[#2D2D4E] bg-[#1A1A2E] hover:border-[#3D3D5E]"
                }`}
              >
                <div className={`w-full h-16 rounded-lg ${t.preview} border border-white/10`} />
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-300">
                  {t.icon}
                  {t.label}
                </div>
                {theme === t.id && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Accent Color */}
      <motion.div variants={fadeInUp}>
        <Card>
          <SectionHeader title="Accent Color" description="Personalize the highlight color used across the UI." />
          <div className="flex flex-wrap gap-3">
            {accents.map((a) => (
              <motion.button
                key={a.color}
                type="button"
                onClick={() => setAccentColor(a.color)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.93 }}
                title={a.label}
                className={`relative w-10 h-10 rounded-xl border-2 transition-all ${
                  accentColor === a.color ? "border-white scale-110" : "border-transparent"
                }`}
                style={{ backgroundColor: a.color }}
              >
                {accentColor === a.color && (
                  <Check className="w-4 h-4 text-white absolute inset-0 m-auto" />
                )}
              </motion.button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-3">
            Selected: <span className="text-slate-300">{accents.find((a) => a.color === accentColor)?.label ?? "Indigo"}</span>
          </p>
        </Card>
      </motion.div>

      {/* Density */}
      <motion.div variants={fadeInUp}>
        <Card>
          <SectionHeader title="Display Density" description="Control how much information is shown at once." />
          <div className="space-y-2">
            {densities.map((d) => (
              <motion.button
                key={d.id}
                type="button"
                onClick={() => setDensity(d.id)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
                  density === d.id
                    ? "border-indigo-500/60 bg-indigo-500/10"
                    : "border-[#2D2D4E] bg-[#1A1A2E] hover:border-[#3D3D5E]"
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-white">{d.label}</p>
                  <p className="text-xs text-slate-400">{d.desc}</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    density === d.id ? "border-indigo-500 bg-indigo-500" : "border-[#3D3D5E]"
                  }`}
                >
                  {density === d.id && <Check className="w-3 h-3 text-white" />}
                </div>
              </motion.button>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div variants={fadeInUp} className="flex justify-end">
        <SaveButton onClick={handleSave} saved={saved} />
      </motion.div>
    </motion.div>
  );
}

function BillingTab() {
  const [showCancel, setShowCancel] = useState(false);

  const statusColors: Record<Invoice["status"], string> = {
    Paid: "text-emerald-400 bg-emerald-500/15 border-emerald-500/25",
    Pending: "text-amber-400 bg-amber-500/15 border-amber-500/25",
    Failed: "text-red-400 bg-red-500/15 border-red-500/25",
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Current Plan */}
      <motion.div variants={fadeInUp}>
        <Card>
          <SectionHeader title="Current Plan" description="You're on the Pro plan. Manage your subscription below." />
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600/20 via-violet-600/15 to-cyan-600/10 border border-indigo-500/30 p-6">
            {/* Decorative glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">Pro Plan</span>
                  </div>
                  <p className="text-3xl font-bold text-white">
                    $149<span className="text-base font-normal text-slate-400">/mo</span>
                  </p>
                  <p className="text-sm text-slate-400 mt-1">Billed monthly · Renews Jan 1, 2025</p>
                </div>
                <div className="flex flex-col gap-2">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold transition-colors shadow-lg shadow-indigo-500/25"
                  >
                    Upgrade to Enterprise
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowCancel((v) => !v)}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white text-sm font-medium transition-all"
                  >
                    Cancel Subscription
                  </motion.button>
                </div>
              </div>

              {/* Features */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  "Unlimited dashboards",
                  "Up to 50k events/mo",
                  "Custom reports",
                  "Team collaboration",
                  "API access",
                  "Priority support",
                ].map((feat) => (
                  <div key={feat} className="flex items-center gap-1.5 text-xs text-slate-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    {feat}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cancel warning */}
          <AnimatePresence>
            {showCancel && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/25 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-300">Are you sure you want to cancel?</p>
                    <p className="text-xs text-slate-400 mt-1">
                      You'll lose access to Pro features on Jan 1, 2025. Your data will be retained for 30 days.
                    </p>
                    <div className="flex gap-2 mt-3">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-400 text-white text-xs font-semibold transition-colors"
                      >
                        Confirm Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setShowCancel(false)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-xs font-medium transition-all"
                      >
                        Keep Plan
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* Payment Method */}
      <motion.div variants={fadeInUp}>
        <Card>
          <SectionHeader title="Payment Method" description="Your default card used for billing." />
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#1A1A2E] border border-[#2D2D4E]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-7 rounded-md bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Visa ending in 4242</p>
                <p className="text-xs text-slate-400">Expires 08 / 2027</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all"
            >
              Update
            </motion.button>
          </div>
        </Card>
      </motion.div>

      {/* Invoice History */}
      <motion.div variants={fadeInUp}>
        <Card>
          <SectionHeader title="Invoice History" description="Download past invoices for your records." />
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm min-w-[520px]">
              <thead>
                <tr className="border-b border-[#2D2D4E]">
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 px-2">Invoice</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 px-2">Date</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 px-2">Description</th>
                  <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 px-2">Amount</th>
                  <th className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 px-2">Status</th>
                  <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 px-2">PDF</th>
                </tr>
              </thead>
              <tbody>
                {(INVOICES ?? []).map((inv, idx) => (
                  <motion.tr
                    key={inv.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-[#2D2D4E]/50 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-3.5 px-2 font-mono text-xs text-slate-400">{inv.id}</td>
                    <td className="py-3.5 px-2 text-slate-300">{inv.date}</td>
                    <td className="py-3.5 px-2 text-slate-300">{inv.description}</td>
                    <td className="py-3.5 px-2 text-right font-semibold text-white">{inv.amount}</td>
                    <td className="py-3.5 px-2 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[inv.status]}`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.93 }}
                        className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-400 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        PDF
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      {/* Usage */}
      <motion.div variants={fadeInUp}>
        <Card>
          <SectionHeader title="Usage This Month" description="Track your event and API usage against plan limits." />
          <div className="space-y-4">
            {[
              { label: "Events Tracked", used: 38420, limit: 50000, color: "bg-indigo-500" },
              { label: "API Calls", used: 12800, limit: 20000, color: "bg-violet-500" },
              { label: "Team Seats", used: 4, limit: 10, color: "bg-cyan-500" },
            ].map((item) => {
              const pct = Math.min(100, Math.round(((item.used ?? 0) / (item.limit ?? 1)) * 100));
              return (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">{item.label}</span>
                    <span className="text-slate-400">
                      {(item.used ?? 0).toLocaleString()} / {(item.limit ?? 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 bg-[#2D2D4E] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                      className={`h-full rounded-full ${item.color}`}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{pct}% used</p>
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("account");

  const tabContent: Record<Tab, React.ReactNode> = {
    account: <AccountTab />,
    notifications: <NotificationsTab />,
    appearance: <AppearanceTab />,
    billing: <BillingTab />,
  };

  return (
    <div className="min-h-screen bg-[#0A0A14] pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
          <p className="text-slate-400 mt-1.5">
            Manage your account, notifications, appearance, and billing preferences.
          </p>
        </motion.div>

        {/* Tab Bar */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-1 p-1 bg-[#16162A] border border-[#2D2D4E] rounded-2xl mb-8 overflow-x-auto"
        >
          {TABS.map((tab) => (
            <motion.button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex-1 justify-center ${
                activeTab === tab.id
                  ? "text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="tab-bg"
                  className="absolute inset-0 bg-indigo-500/20 border border-indigo-500/30 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.45 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {tab.icon}
                {tab.label}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {tabContent[activeTab]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}