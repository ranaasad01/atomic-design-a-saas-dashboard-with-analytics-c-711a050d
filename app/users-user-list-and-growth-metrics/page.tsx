"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, UserPlus, TrendingUp, TrendingDown, Search, Filter, MoreHorizontal, ArrowUpDown, ChevronUp, ChevronDown, Activity, Globe, Smartphone, Monitor, Mail, Calendar, Star, Shield, AlertCircle, Check } from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";
import { BRAND_COLORS, CHART_COLORS } from "@/lib/data";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const kpiCards = [
  {
    id: "total",
    label: "Total Users",
    value: "24,831",
    change: 12.4,
    icon: Users,
    color: "indigo",
    gradient: "from-indigo-500/20 to-indigo-600/5",
    border: "border-indigo-500/30",
    iconBg: "bg-indigo-500/20",
    iconColor: "text-indigo-400",
  },
  {
    id: "new",
    label: "New This Month",
    value: "1,429",
    change: 8.7,
    icon: UserPlus,
    color: "violet",
    gradient: "from-violet-500/20 to-violet-600/5",
    border: "border-violet-500/30",
    iconBg: "bg-violet-500/20",
    iconColor: "text-violet-400",
  },
  {
    id: "active",
    label: "Active Users (30d)",
    value: "18,204",
    change: 5.2,
    icon: Activity,
    color: "cyan",
    gradient: "from-cyan-500/20 to-cyan-600/5",
    border: "border-cyan-500/30",
    iconBg: "bg-cyan-500/20",
    iconColor: "text-cyan-400",
  },
  {
    id: "churn",
    label: "Churned Users",
    value: "312",
    change: -3.1,
    icon: TrendingDown,
    color: "rose",
    gradient: "from-rose-500/20 to-rose-600/5",
    border: "border-rose-500/30",
    iconBg: "bg-rose-500/20",
    iconColor: "text-rose-400",
  },
];

const growthData = [
  { month: "Jan", total: 18200, new: 820, churned: 210 },
  { month: "Feb", total: 18950, new: 940, churned: 190 },
  { month: "Mar", total: 19800, new: 1050, churned: 200 },
  { month: "Apr", total: 20700, new: 1120, churned: 220 },
  { month: "May", total: 21600, new: 1180, churned: 280 },
  { month: "Jun", total: 22400, new: 1240, churned: 440 },
  { month: "Jul", total: 23100, new: 1050, churned: 350 },
  { month: "Aug", total: 23800, new: 980, churned: 280 },
  { month: "Sep", total: 24200, new: 760, churned: 360 },
  { month: "Oct", total: 24831, new: 1429, churned: 312 },
];

const deviceData = [
  { name: "Desktop", value: 52, color: CHART_COLORS[0] },
  { name: "Mobile", value: 34, color: CHART_COLORS[1] },
  { name: "Tablet", value: 14, color: CHART_COLORS[2] },
];

const regionData = [
  { region: "North America", users: 9200, pct: 37 },
  { region: "Europe", users: 6800, pct: 27 },
  { region: "Asia Pacific", users: 5400, pct: 22 },
  { region: "Latin America", users: 2100, pct: 8 },
  { region: "Rest of World", users: 1331, pct: 6 },
];

const cohortData = [
  { month: "Jan", w1: 100, w2: 72, w3: 58, w4: 49 },
  { month: "Feb", w1: 100, w2: 75, w3: 61, w4: 52 },
  { month: "Mar", w1: 100, w2: 69, w3: 55, w4: 46 },
  { month: "Apr", w1: 100, w2: 78, w3: 64, w4: 55 },
  { month: "May", w1: 100, w2: 74, w3: 60, w4: 51 },
  { month: "Jun", w1: 100, w2: 80, w3: 67, w4: 58 },
];

type UserStatus = "active" | "inactive" | "trial" | "suspended";
type UserPlan = "Free" | "Pro" | "Enterprise";

interface UserRow {
  id: string;
  name: string;
  email: string;
  plan: UserPlan;
  status: UserStatus;
  joined: string;
  lastSeen: string;
  sessions: number;
  country: string;
  avatar: string;
}

const usersData: UserRow[] = [
  { id: "u1", name: "Sophia Hartwell", email: "sophia@hartwell.io", plan: "Enterprise", status: "active", joined: "Jan 12, 2024", lastSeen: "2 min ago", sessions: 284, country: "US", avatar: "SH" },
  { id: "u2", name: "Marcus Chen", email: "m.chen@techflow.com", plan: "Pro", status: "active", joined: "Feb 3, 2024", lastSeen: "1h ago", sessions: 142, country: "SG", avatar: "MC" },
  { id: "u3", name: "Priya Nair", email: "priya.nair@designco.in", plan: "Pro", status: "active", joined: "Mar 18, 2024", lastSeen: "3h ago", sessions: 97, country: "IN", avatar: "PN" },
  { id: "u4", name: "Luca Ferretti", email: "luca@ferretti.eu", plan: "Free", status: "trial", joined: "Sep 29, 2024", lastSeen: "Yesterday", sessions: 12, country: "IT", avatar: "LF" },
  { id: "u5", name: "Amara Osei", email: "amara.osei@ventures.gh", plan: "Enterprise", status: "active", joined: "Nov 5, 2023", lastSeen: "5 min ago", sessions: 431, country: "GH", avatar: "AO" },
  { id: "u6", name: "Yuki Tanaka", email: "yuki.t@nexuslab.jp", plan: "Pro", status: "inactive", joined: "Apr 22, 2024", lastSeen: "14 days ago", sessions: 56, country: "JP", avatar: "YT" },
  { id: "u7", name: "Elena Vasquez", email: "elena@vasquez.mx", plan: "Free", status: "active", joined: "Jul 8, 2024", lastSeen: "30 min ago", sessions: 38, country: "MX", avatar: "EV" },
  { id: "u8", name: "Raj Patel", email: "raj.patel@cloudbase.io", plan: "Enterprise", status: "active", joined: "Dec 1, 2023", lastSeen: "Just now", sessions: 612, country: "US", avatar: "RP" },
  { id: "u9", name: "Fatima Al-Rashid", email: "fatima@alrashid.ae", plan: "Pro", status: "suspended", joined: "Jun 14, 2024", lastSeen: "21 days ago", sessions: 29, country: "AE", avatar: "FA" },
  { id: "u10", name: "Noah Bergström", email: "noah.b@nordic.se", plan: "Free", status: "trial", joined: "Oct 10, 2024", lastSeen: "2 days ago", sessions: 8, country: "SE", avatar: "NB" },
  { id: "u11", name: "Chloe Dupont", email: "chloe.d@agence.fr", plan: "Pro", status: "active", joined: "May 27, 2024", lastSeen: "4h ago", sessions: 74, country: "FR", avatar: "CD" },
  { id: "u12", name: "James Okafor", email: "james@okafor.ng", plan: "Free", status: "inactive", joined: "Aug 3, 2024", lastSeen: "10 days ago", sessions: 21, country: "NG", avatar: "JO" },
];

const statusConfig: Record<UserStatus, { label: string; color: string; bg: string; dot: string }> = {
  active: { label: "Active", color: "text-emerald-400", bg: "bg-emerald-500/15", dot: "bg-emerald-400" },
  inactive: { label: "Inactive", color: "text-slate-400", bg: "bg-slate-500/15", dot: "bg-slate-400" },
  trial: { label: "Trial", color: "text-amber-400", bg: "bg-amber-500/15", dot: "bg-amber-400" },
  suspended: { label: "Suspended", color: "text-rose-400", bg: "bg-rose-500/15", dot: "bg-rose-400" },
};

const planConfig: Record<UserPlan, { color: string; bg: string; border: string }> = {
  Free: { color: "text-slate-300", bg: "bg-slate-500/10", border: "border-slate-500/20" },
  Pro: { color: "text-indigo-300", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
  Enterprise: { color: "text-violet-300", bg: "bg-violet-500/10", border: "border-violet-500/20" },
};

const avatarColors = [
  "from-indigo-500 to-violet-600",
  "from-cyan-500 to-blue-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-violet-500 to-purple-600",
];

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-[#1E1E2E] border border-[#2D2D4E] rounded-xl p-3 shadow-xl shadow-black/40 text-xs">
      <p className="text-slate-400 mb-2 font-medium">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-slate-300 capitalize">{entry.name}:</span>
          <span className="text-white font-semibold">{(entry.value ?? 0).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Page Component ───────────────────────────────────────────────────────────

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | UserStatus>("all");
  const [planFilter, setPlanFilter] = useState<"all" | UserPlan>("all");
  const [sortField, setSortField] = useState<keyof UserRow>("sessions");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [activeTab, setActiveTab] = useState<"growth" | "cohort">("growth");

  const handleSort = (field: keyof UserRow) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const filtered = (usersData ?? [])
    .filter((u) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        (u.name ?? "").toLowerCase().includes(q) ||
        (u.email ?? "").toLowerCase().includes(q) ||
        (u.country ?? "").toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || u.status === statusFilter;
      const matchPlan = planFilter === "all" || u.plan === planFilter;
      return matchSearch && matchStatus && matchPlan;
    })
    .sort((a, b) => {
      const av = a[sortField] ?? "";
      const bv = b[sortField] ?? "";
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <main className="min-h-screen bg-[#0A0A14] text-white pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* ── Header ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-6"
        >
          <motion.div variants={fadeInUp}>
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1">User Management</p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Users &amp; Growth Metrics
            </h1>
            <p className="mt-2 text-slate-400 text-sm max-w-xl">
              Monitor user acquisition, engagement, and retention across all plans and regions.
            </p>
          </motion.div>
          <motion.div variants={fadeInUp} className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-all"
            >
              <Filter className="w-4 h-4" />
              Export CSV
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              Invite User
            </motion.button>
          </motion.div>
        </motion.div>

        {/* ── KPI Cards ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {kpiCards.map((card) => {
            const Icon = card.icon;
            const isPositive = card.change >= 0;
            return (
              <motion.div
                key={card.id}
                variants={scaleIn}
                whileHover={{ y: -4, scale: 1.02 }}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} border ${card.border} p-5 backdrop-blur-sm`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${card.iconColor}`} />
                  </div>
                  <span
                    className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                      isPositive
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-rose-500/15 text-rose-400"
                    }`}
                  >
                    {isPositive ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    {Math.abs(card.change)}%
                  </span>
                </div>
                <p className="text-2xl font-bold text-white mb-0.5">{card.value}</p>
                <p className="text-xs text-slate-400">{card.label}</p>
                <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-white/3 blur-xl" />
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Growth Chart + Device Breakdown ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Growth Chart */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="lg:col-span-2 rounded-2xl bg-[#16162A] border border-[#2D2D4E] p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-semibold text-white">User Growth</h2>
                <p className="text-xs text-slate-500 mt-0.5">Total, new, and churned users over time</p>
              </div>
              <div className="flex gap-1 bg-[#0F0F1A] rounded-xl p-1 border border-[#2D2D4E]">
                {(["growth", "cohort"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                      activeTab === tab
                        ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {tab === "growth" ? "Growth" : "Cohort"}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === "growth" ? (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={growthData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS[0]} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradNew" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS[2]} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={CHART_COLORS[2]} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D2D4E" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="total" stroke={CHART_COLORS[0]} strokeWidth={2} fill="url(#gradTotal)" name="total" />
                  <Area type="monotone" dataKey="new" stroke={CHART_COLORS[2]} strokeWidth={2} fill="url(#gradNew)" name="new" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={cohortData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D2D4E" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="w1" name="Week 1" fill={CHART_COLORS[0]} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="w2" name="Week 2" fill={CHART_COLORS[1]} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="w3" name="Week 3" fill={CHART_COLORS[2]} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="w4" name="Week 4" fill={CHART_COLORS[3]} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Device Breakdown */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="rounded-2xl bg-[#16162A] border border-[#2D2D4E] p-6 flex flex-col"
          >
            <div className="mb-4">
              <h2 className="text-base font-semibold text-white">Device Split</h2>
              <p className="text-xs text-slate-500 mt-0.5">Sessions by device type</p>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={78}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {deviceData.map((entry, i) => (
                      <Cell key={entry.name} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || payload.length === 0) return null;
                      const d = payload[0];
                      return (
                        <div className="bg-[#1E1E2E] border border-[#2D2D4E] rounded-xl p-2.5 text-xs shadow-xl">
                          <p className="text-white font-semibold">{d?.name}</p>
                          <p className="text-slate-400">{d?.value}%</p>
                        </div>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2.5 mt-2">
              {deviceData.map((d) => {
                const Icon = d.name === "Desktop" ? Monitor : d.name === "Mobile" ? Smartphone : Globe;
                return (
                  <div key={d.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                      <Icon className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-xs text-slate-400">{d.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-white">{d.value}%</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* ── Regional Distribution ── */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="rounded-2xl bg-[#16162A] border border-[#2D2D4E] p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-white">Regional Distribution</h2>
              <p className="text-xs text-slate-500 mt-0.5">Users by geographic region</p>
            </div>
            <Globe className="w-5 h-5 text-slate-500" />
          </div>
          <div className="space-y-4">
            {regionData.map((r, i) => (
              <div key={r.region} className="flex items-center gap-4">
                <span className="text-xs text-slate-400 w-36 shrink-0">{r.region}</span>
                <div className="flex-1 h-2 bg-[#2D2D4E] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${r.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
                  />
                </div>
                <span className="text-xs font-semibold text-white w-12 text-right">{r.users.toLocaleString()}</span>
                <span className="text-xs text-slate-500 w-8 text-right">{r.pct}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── User Table ── */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="rounded-2xl bg-[#16162A] border border-[#2D2D4E] overflow-hidden"
        >
          {/* Table Header */}
          <div className="p-6 border-b border-[#2D2D4E]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-white">User List</h2>
                <p className="text-xs text-slate-500 mt-0.5">{filtered.length} of {usersData.length} users</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search users…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 pr-3 py-2 bg-[#0F0F1A] border border-[#2D2D4E] rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 w-44 transition-colors"
                  />
                </div>
                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as "all" | UserStatus)}
                  className="px-3 py-2 bg-[#0F0F1A] border border-[#2D2D4E] rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500/50 transition-colors"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="trial">Trial</option>
                  <option value="suspended">Suspended</option>
                </select>
                {/* Plan Filter */}
                <select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value as "all" | UserPlan)}
                  className="px-3 py-2 bg-[#0F0F1A] border border-[#2D2D4E] rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500/50 transition-colors"
                >
                  <option value="all">All Plans</option>
                  <option value="Free">Free</option>
                  <option value="Pro">Pro</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2D2D4E]">
                  {[
                    { label: "User", field: "name" as keyof UserRow },
                    { label: "Plan", field: "plan" as keyof UserRow },
                    { label: "Status", field: "status" as keyof UserRow },
                    { label: "Joined", field: "joined" as keyof UserRow },
                    { label: "Last Seen", field: "lastSeen" as keyof UserRow },
                    { label: "Sessions", field: "sessions" as keyof UserRow },
                    { label: "", field: null },
                  ].map((col) => (
                    <th
                      key={col.label}
                      className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      {col.field ? (
                        <button
                          onClick={() => col.field && handleSort(col.field)}
                          className="flex items-center gap-1 hover:text-slate-300 transition-colors"
                        >
                          {col.label}
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      ) : (
                        col.label
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((user, idx) => {
                  const status = statusConfig[user.status];
                  const plan = planConfig[user.plan];
                  const avatarGrad = avatarColors[idx % avatarColors.length];
                  return (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04, duration: 0.3 }}
                      className="border-b border-[#2D2D4E]/50 hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* User */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarGrad} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                            {user.avatar}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      {/* Plan */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${plan.color} ${plan.bg} ${plan.border}`}>
                          {user.plan === "Enterprise" && <Shield className="w-3 h-3" />}
                          {user.plan === "Pro" && <Star className="w-3 h-3" />}
                          {user.plan}
                        </span>
                      </td>
                      {/* Status */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color} ${status.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                      </td>
                      {/* Joined */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Calendar className="w-3.5 h-3.5 text-slate-600" />
                          {user.joined}
                        </div>
                      </td>
                      {/* Last Seen */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-xs text-slate-400">{user.lastSeen}</span>
                      </td>
                      {/* Sessions */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">{user.sessions.toLocaleString()}</span>
                          <div className="w-16 h-1.5 bg-[#2D2D4E] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                              style={{ width: `${Math.min(100, (user.sessions / 650) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      {/* Actions */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.93 }}
                            className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-500/20 hover:border-indigo-500/30 transition-all"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.93 }}
                            className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                          >
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-16 text-center">
                      <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                      <p className="text-sm text-slate-500">No users match your filters.</p>
                      <button
                        onClick={() => { setSearch(""); setStatusFilter("all"); setPlanFilter("all"); }}
                        className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        Clear filters
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-6 py-4 border-t border-[#2D2D4E] flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Showing <span className="text-white font-medium">{filtered.length}</span> users
            </p>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${
                    p === 1
                      ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                      : "text-slate-500 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Plan Distribution Summary ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {(
            [
              { plan: "Free" as UserPlan, count: usersData.filter((u) => u.plan === "Free").length, total: usersData.length, color: "slate", bar: "bg-slate-400" },
              { plan: "Pro" as UserPlan, count: usersData.filter((u) => u.plan === "Pro").length, total: usersData.length, color: "indigo", bar: "bg-indigo-500" },
              { plan: "Enterprise" as UserPlan, count: usersData.filter((u) => u.plan === "Enterprise").length, total: usersData.length, color: "violet", bar: "bg-violet-500" },
            ] as const
          ).map((item) => {
            const pct = Math.round((item.count / item.total) * 100);
            return (
              <motion.div
                key={item.plan}
                variants={scaleIn}
                whileHover={{ y: -3 }}
                className="rounded-2xl bg-[#16162A] border border-[#2D2D4E] p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-white">{item.plan} Plan</span>
                  <span className="text-xs text-slate-500">{pct}% of users</span>
                </div>
                <p className="text-2xl font-bold text-white mb-3">{item.count}</p>
                <div className="w-full h-1.5 bg-[#2D2D4E] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-full rounded-full ${item.bar}`}
                  />
                </div>
                <div className="flex items-center gap-1.5 mt-3">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs text-slate-500">
                    {item.plan === "Free" ? "No payment required" : item.plan === "Pro" ? "$29/mo per seat" : "Custom pricing"}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </main>
  );
}