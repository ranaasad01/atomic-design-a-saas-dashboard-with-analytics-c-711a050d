"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, Bell, Eye, EyeOff, Shield, Palette, Globe, Clock, Download, Trash2, Check, AlertTriangle, Smartphone, Monitor, Moon, Sun, ChevronRight, Save, Camera } from 'lucide-react';
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";
import { BRAND_COLORS } from "@/lib/data";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Session {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
  icon: "monitor" | "smartphone";
}

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  email: boolean;
  push: boolean;
  sms: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const SESSIONS: Session[] = [
  {
    id: "s1",
    device: "MacBook Pro — Chrome 124",
    location: "San Francisco, CA",
    lastActive: "Active now",
    current: true,
    icon: "monitor",
  },
  {
    id: "s2",
    device: "iPhone 15 Pro — Safari",
    location: "San Francisco, CA",
    lastActive: "2 hours ago",
    current: false,
    icon: "smartphone",
  },
  {
    id: "s3",
    device: "Windows PC — Firefox 125",
    location: "New York, NY",
    lastActive: "3 days ago",
    current: false,
    icon: "monitor",
  },
];

const INITIAL_NOTIFICATIONS: NotificationSetting[] = [
  {
    id: "n1",
    label: "Revenue Milestones",
    description: "Get notified when MRR or ARR hits a new milestone.",
    email: true,
    push: true,
    sms: false,
  },
  {
    id: "n2",
    label: "New User Signups",
    description: "Daily digest of new user registrations.",
    email: true,
    push: false,
    sms: false,
  },
  {
    id: "n3",
    label: "Churn Alerts",
    description: "Immediate alert when churn rate exceeds threshold.",
    email: true,
    push: true,
    sms: true,
  },
  {
    id: "n4",
    label: "Weekly Reports",
    description: "Automated weekly analytics summary.",
    email: true,
    push: false,
    sms: false,
  },
  {
    id: "n5",
    label: "Security Events",
    description: "Login from new device or location.",
    email: true,
    push: true,
    sms: true,
  },
];

const TIMEZONES = [
  "America/Los_Angeles",
  "America/New_York",
  "America/Chicago",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Australia/Sydney",
];

const LANGUAGES = ["English (US)", "English (UK)", "Español", "Français", "Deutsch", "日本語"];

const THEMES = [
  { id: "dark", label: "Dark", icon: Moon },
  { id: "light", label: "Light", icon: Sun },
  { id: "system", label: "System", icon: Monitor },
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

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`bg-[#16162A] border border-[#2D2D4E] rounded-2xl p-6 ${className}`}
    >
      {children}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
        checked ? "bg-indigo-500" : "bg-slate-700"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-4.5" : "translate-x-0.5"
        }`}
        style={{ transform: checked ? "translateX(18px)" : "translateX(2px)" }}
      />
    </button>
  );
}

function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-300">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? ""}
        className="w-full bg-[#0F0F1A] border border-[#2D2D4E] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
      />
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-300">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#0F0F1A] border border-[#2D2D4E] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all appearance-none cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-[#0F0F1A]">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function SaveButton({ onClick, saved }: { onClick: () => void; saved: boolean }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
        saved
          ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
          : "bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/25"
      }`}
    >
      {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
      {saved ? "Saved!" : "Save Changes"}
    </motion.button>
  );
}

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "preferences", label: "Preferences", icon: Palette },
  { id: "privacy", label: "Privacy & Data", icon: Shield },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SettingsAccountAndPreferencesPage() {
  const [activeTab, setActiveTab] = useState<string>("profile");

  // Profile state
  const [firstName, setFirstName] = useState("Jordan");
  const [lastName, setLastName] = useState("Rivera");
  const [email, setEmail] = useState("jordan.rivera@pulseanalytics.io");
  const [jobTitle, setJobTitle] = useState("Head of Growth");
  const [company, setCompany] = useState("Pulse Analytics");
  const [bio, setBio] = useState(
    "Passionate about data-driven growth and building products that scale."
  );
  const [profileSaved, setProfileSaved] = useState(false);

  // Security state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(true);
  const [sessions, setSessions] = useState<Session[]>(SESSIONS);
  const [securitySaved, setSecuritySaved] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState<NotificationSetting[]>(INITIAL_NOTIFICATIONS);
  const [notifSaved, setNotifSaved] = useState(false);

  // Preferences state
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("English (US)");
  const [timezone, setTimezone] = useState("America/Los_Angeles");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [compactMode, setCompactMode] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [prefSaved, setPrefSaved] = useState(false);

  // Privacy state
  const [analyticsConsent, setAnalyticsConsent] = useState(true);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [profileVisible, setProfileVisible] = useState(true);
  const [privacySaved, setPrivacySaved] = useState(false);

  // Helpers
  const handleSave = (
    setter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setter(true);
    setTimeout(() => setter(false), 2500);
  };

  const revokeSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const toggleNotif = (
    id: string,
    channel: "email" | "push" | "sms"
  ) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, [channel]: !n[channel] } : n
      )
    );
  };

  const passwordStrength = (() => {
    const p = newPassword;
    if (p.length === 0) return null;
    if (p.length < 6) return { label: "Weak", color: "bg-red-500", width: "w-1/4" };
    if (p.length < 10) return { label: "Fair", color: "bg-amber-500", width: "w-2/4" };
    if (p.length < 14) return { label: "Good", color: "bg-indigo-500", width: "w-3/4" };
    return { label: "Strong", color: "bg-emerald-500", width: "w-full" };
  })();

  return (
    <div className="min-h-screen bg-[#0A0A14] pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Account &amp; Preferences
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Manage your profile, security, notifications, and display preferences.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Tabs */}
          <motion.aside
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="lg:w-56 flex-shrink-0"
          >
            <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap w-full text-left ${
                      isActive
                        ? "bg-indigo-500/20 border border-indigo-500/30 text-indigo-300"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {tab.label}
                    {isActive && (
                      <ChevronRight className="w-3.5 h-3.5 ml-auto hidden lg:block" />
                    )}
                  </motion.button>
                );
              })}
            </nav>
          </motion.aside>

          {/* Main Content */}
          <motion.div
            key={activeTab}
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            className="flex-1 min-w-0"
          >
            {/* ── PROFILE TAB ── */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <Card>
                  <SectionHeader
                    title="Profile Information"
                    description="Update your personal details and public profile."
                  />
                  {/* Avatar */}
                  <div className="flex items-center gap-5 mb-8">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-indigo-500/30">
                        JR
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.93 }}
                        className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-lg bg-[#1E1E2E] border border-[#2D2D4E] flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {firstName} {lastName}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{jobTitle}</p>
                      <button className="text-xs text-indigo-400 hover:text-indigo-300 mt-1.5 transition-colors">
                        Upload new photo
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <InputField
                      label="First Name"
                      value={firstName}
                      onChange={setFirstName}
                      placeholder="First name"
                    />
                    <InputField
                      label="Last Name"
                      value={lastName}
                      onChange={setLastName}
                      placeholder="Last name"
                    />
                    <InputField
                      label="Email Address"
                      type="email"
                      value={email}
                      onChange={setEmail}
                      placeholder="you@example.com"
                      hint="Used for login and notifications."
                    />
                    <InputField
                      label="Job Title"
                      value={jobTitle}
                      onChange={setJobTitle}
                      placeholder="e.g. Head of Growth"
                    />
                    <InputField
                      label="Company"
                      value={company}
                      onChange={setCompany}
                      placeholder="Your company name"
                    />
                  </div>

                  <div className="mt-5">
                    <label className="text-sm font-medium text-slate-300 block mb-1.5">
                      Bio
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      placeholder="Tell your team a bit about yourself…"
                      className="w-full bg-[#0F0F1A] border border-[#2D2D4E] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all resize-none"
                    />
                  </div>

                  <div className="flex justify-end mt-6">
                    <SaveButton
                      onClick={() => handleSave(setProfileSaved)}
                      saved={profileSaved}
                    />
                  </div>
                </Card>

                {/* Danger Zone */}
                <Card className="border-red-500/20">
                  <h2 className="text-lg font-semibold text-white mb-1">Danger Zone</h2>
                  <p className="text-sm text-slate-400 mb-5">
                    Irreversible actions that affect your account permanently.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      Export My Data
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Account
                    </motion.button>
                  </div>
                </Card>
              </div>
            )}

            {/* ── SECURITY TAB ── */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <Card>
                  <SectionHeader
                    title="Change Password"
                    description="Use a strong, unique password to keep your account safe."
                  />
                  <div className="space-y-4 max-w-md">
                    {/* Current Password */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-slate-300">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrent ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                          className="w-full bg-[#0F0F1A] border border-[#2D2D4E] rounded-xl px-4 py-2.5 pr-10 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrent((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                        >
                          {showCurrent ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-slate-300">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNew ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="w-full bg-[#0F0F1A] border border-[#2D2D4E] rounded-xl px-4 py-2.5 pr-10 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                        >
                          {showNew ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {/* Strength bar */}
                      {passwordStrength && (
                        <div className="mt-1">
                          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color} ${passwordStrength.width}`}
                            />
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            Strength:{" "}
                            <span className="text-slate-300">{passwordStrength.label}</span>
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-slate-300">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full bg-[#0F0F1A] border border-[#2D2D4E] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                      />
                      {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                        <p className="text-xs text-red-400 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Passwords do not match.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <SaveButton
                      onClick={() => handleSave(setSecuritySaved)}
                      saved={securitySaved}
                    />
                  </div>
                </Card>

                {/* 2FA */}
                <Card>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-base font-semibold text-white">
                        Two-Factor Authentication
                      </h2>
                      <p className="text-sm text-slate-400 mt-1 max-w-sm">
                        Add an extra layer of security. You'll be prompted for a code
                        each time you sign in from a new device.
                      </p>
                      {twoFAEnabled && (
                        <span className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                          <Check className="w-3 h-3" /> Enabled via Authenticator App
                        </span>
                      )}
                    </div>
                    <Toggle
                      checked={twoFAEnabled}
                      onChange={setTwoFAEnabled}
                      label="Toggle 2FA"
                    />
                  </div>
                </Card>

                {/* Active Sessions */}
                <Card>
                  <SectionHeader
                    title="Active Sessions"
                    description="Devices currently signed in to your account."
                  />
                  <motion.ul
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="space-y-3"
                  >
                    {sessions.map((session) => {
                      const Icon = session.icon === "smartphone" ? Smartphone : Monitor;
                      return (
                        <motion.li
                          key={session.id}
                          variants={fadeInUp}
                          className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#0F0F1A] border border-[#2D2D4E]"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                              <Icon className="w-4 h-4 text-indigo-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">
                                {session.device}
                                {session.current && (
                                  <span className="ml-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full">
                                    Current
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {session.location} · {session.lastActive}
                              </p>
                            </div>
                          </div>
                          {!session.current && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => revokeSession(session.id)}
                              className="text-xs text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 px-3 py-1.5 rounded-lg transition-all"
                            >
                              Revoke
                            </motion.button>
                          )}
                        </motion.li>
                      );
                    })}
                  </motion.ul>
                </Card>
              </div>
            )}

            {/* ── NOTIFICATIONS TAB ── */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <Card>
                  <SectionHeader
                    title="Notification Preferences"
                    description="Choose how and when you want to be notified."
                  />

                  {/* Channel headers */}
                  <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-4 mb-3 px-1">
                    <span />
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider w-12 text-center">
                      Email
                    </span>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider w-12 text-center">
                      Push
                    </span>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider w-12 text-center">
                      SMS
                    </span>
                  </div>

                  <motion.ul
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="space-y-2"
                  >
                    {notifications.map((notif) => (
                      <motion.li
                        key={notif.id}
                        variants={fadeInUp}
                        className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-4 items-center p-4 rounded-xl bg-[#0F0F1A] border border-[#2D2D4E]"
                      >
                        <div>
                          <p className="text-sm font-medium text-white">{notif.label}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{notif.description}</p>
                        </div>
                        <div className="flex sm:justify-center items-center gap-2">
                          <span className="text-xs text-slate-500 sm:hidden">Email</span>
                          <Toggle
                            checked={notif.email}
                            onChange={() => toggleNotif(notif.id, "email")}
                            label={`${notif.label} email`}
                          />
                        </div>
                        <div className="flex sm:justify-center items-center gap-2">
                          <span className="text-xs text-slate-500 sm:hidden">Push</span>
                          <Toggle
                            checked={notif.push}
                            onChange={() => toggleNotif(notif.id, "push")}
                            label={`${notif.label} push`}
                          />
                        </div>
                        <div className="flex sm:justify-center items-center gap-2">
                          <span className="text-xs text-slate-500 sm:hidden">SMS</span>
                          <Toggle
                            checked={notif.sms}
                            onChange={() => toggleNotif(notif.id, "sms")}
                            label={`${notif.label} sms`}
                          />
                        </div>
                      </motion.li>
                    ))}
                  </motion.ul>

                  <div className="flex justify-end mt-6">
                    <SaveButton
                      onClick={() => handleSave(setNotifSaved)}
                      saved={notifSaved}
                    />
                  </div>
                </Card>
              </div>
            )}

            {/* ── PREFERENCES TAB ── */}
            {activeTab === "preferences" && (
              <div className="space-y-6">
                {/* Theme */}
                <Card>
                  <SectionHeader
                    title="Appearance"
                    description="Customize how Pulse Analytics looks on your device."
                  />
                  <div className="flex gap-3 flex-wrap">
                    {THEMES.map((t) => {
                      const Icon = t.icon;
                      const isActive = theme === t.id;
                      return (
                        <motion.button
                          key={t.id}
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => setTheme(t.id)}
                          className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border text-sm font-medium transition-all ${
                            isActive
                              ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300"
                              : "bg-[#0F0F1A] border-[#2D2D4E] text-slate-400 hover:text-white hover:border-slate-600"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {t.label}
                          {isActive && <Check className="w-3.5 h-3.5 ml-1" />}
                        </motion.button>
                      );
                    })}
                  </div>

                  <div className="mt-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-[#0F0F1A] border border-[#2D2D4E]">
                      <div>
                        <p className="text-sm font-medium text-white">Compact Mode</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Reduce spacing for a denser layout.
                        </p>
                      </div>
                      <Toggle
                        checked={compactMode}
                        onChange={setCompactMode}
                        label="Compact mode"
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-[#0F0F1A] border border-[#2D2D4E]">
                      <div>
                        <p className="text-sm font-medium text-white">Animations</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Enable smooth transitions and motion effects.
                        </p>
                      </div>
                      <Toggle
                        checked={animationsEnabled}
                        onChange={setAnimationsEnabled}
                        label="Animations"
                      />
                    </div>
                  </div>
                </Card>

                {/* Locale */}
                <Card>
                  <SectionHeader
                    title="Language &amp; Region"
                    description="Set your preferred language, timezone, and date format."
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <SelectField
                      label="Language"
                      value={language}
                      onChange={setLanguage}
                      options={LANGUAGES}
                    />
                    <SelectField
                      label="Timezone"
                      value={timezone}
                      onChange={setTimezone}
                      options={TIMEZONES}
                    />
                    <SelectField
                      label="Date Format"
                      value={dateFormat}
                      onChange={setDateFormat}
                      options={["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]}
                    />
                    <SelectField
                      label="Number Format"
                      value="1,000.00"
                      onChange={() => {}}
                      options={["1,000.00", "1.000,00", "1 000,00"]}
                    />
                  </div>

                  <div className="flex justify-end mt-6">
                    <SaveButton
                      onClick={() => handleSave(setPrefSaved)}
                      saved={prefSaved}
                    />
                  </div>
                </Card>
              </div>
            )}

            {/* ── PRIVACY TAB ── */}
            {activeTab === "privacy" && (
              <div className="space-y-6">
                <Card>
                  <SectionHeader
                    title="Privacy Controls"
                    description="Manage how your data is collected and used."
                  />
                  <div className="space-y-3">
                    {[
                      {
                        id: "analytics",
                        label: "Product Analytics",
                        description:
                          "Allow us to collect usage data to improve the product experience.",
                        value: analyticsConsent,
                        setter: setAnalyticsConsent,
                      },
                      {
                        id: "marketing",
                        label: "Marketing Communications",
                        description:
                          "Receive product updates, tips, and promotional emails.",
                        value: marketingConsent,
                        setter: setMarketingConsent,
                      },
                      {
                        id: "profile",
                        label: "Public Profile Visibility",
                        description:
                          "Allow teammates to see your profile and activity status.",
                        value: profileVisible,
                        setter: setProfileVisible,
                      },
                    ].map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#0F0F1A] border border-[#2D2D4E]"
                      >
                        <div>
                          <p className="text-sm font-medium text-white">{item.label}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                        </div>
                        <Toggle
                          checked={item.value}
                          onChange={item.setter}
                          label={item.label}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end mt-6">
                    <SaveButton
                      onClick={() => handleSave(setPrivacySaved)}
                      saved={privacySaved}
                    />
                  </div>
                </Card>

                {/* Data Export */}
                <Card>
                  <SectionHeader
                    title="Your Data"
                    description="Download or permanently delete all data associated with your account."
                  />
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-[#0F0F1A] border border-[#2D2D4E]">
                      <div>
                        <p className="text-sm font-medium text-white">Export Account Data</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Download a full archive of your account data in JSON format.
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 transition-all"
                      >
                        <Download className="w-4 h-4" />
                        Export
                      </motion.button>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-[#0F0F1A] border border-red-500/20">
                      <div>
                        <p className="text-sm font-medium text-white">Delete All Data</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Permanently erase all your data. This action cannot be undone.
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </motion.button>
                    </div>
                  </div>
                </Card>

                {/* GDPR notice */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Pulse Analytics is GDPR and CCPA compliant. We never sell your personal
                    data to third parties. For questions, contact{" "}
                    <span className="text-indigo-400">privacy@pulseanalytics.io</span>.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}