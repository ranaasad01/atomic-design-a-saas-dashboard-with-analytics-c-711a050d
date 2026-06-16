"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { User, Search, ChevronDown, ChevronUp, ArrowUpDown, Check, X, Star, Activity, ArrowUp, ArrowDown, Mail, Calendar, Filter } from 'lucide-react';
import { BRAND_COLORS, CHART_COLORS } from "@/lib/data";
import {
  fadeInUp,
  fadeIn,
  staggerContainer,
  scaleIn,
} from "@/lib/motion";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const kpiCards = [
  {
    id: "total",
    label: "Total Users",
    value: "24,381",
    raw: 24381,
    change: 12.4,
    changeLabel: "vs last month",
    icon: User,
    color: "#6366F1",
    bg: "from-indigo-500/20 to-indigo-600/5",
    border: "border-indigo-500/20",
  },
  {
    id: "new",
    label: "New This Month",
    value: "1,847",
    raw: 1847,
    change: 8.1,
    changeLabel: "vs last month",
    icon: Activity,
    color: "#06B6D4",
    bg: "from-cyan-500/20 to-cyan-600/5",
    border: "border-cyan-500/20",
  },
  {
    id: "churned",
    label: "Churned",
    value: "213",
    raw: 213,
    change: -3.2,
    changeLabel: "vs last month",
    icon: X,
    color: "#EF4444",
    bg: "from-red-500/20 to-red-600/5",
    border: "border-red-500/20",
  },
  {
    id: "dau",
    label: "Daily Active Users",
    value: "9,104",
    raw: 9104,
    change: 5.7,
    changeLabel: "vs yesterday",
    icon: Star,
    color: "#10B981",
    bg: "from-emerald-500/20 to-emerald-600/5",
    border: "border-emerald-500/20",
  },
];

const growthData = [
  { month: "Jan", users: 14200, newUsers: 980 },
  { month: "Feb", users: 15400, newUsers: 1200 },
  { month: "Mar", users: 16800, newUsers: 1400 },
  { month: "Apr", users: 17600, newUsers: 800 },
  { month: "May", users: 18900, newUsers: 1300 },
  { month: "Jun", users: 19800, newUsers: 900 },
  { month: "Jul", users: 20700, newUsers: 900 },
  { month: "Aug", users: 21500, newUsers: 800 },
  { month: "Sep", users: 22400, newUsers: 900 },
  { month: "Oct", users: 23100, newUsers: 700 },
  { month: "Nov", users: 23800, newUsers: 700 },
  { month: "Dec", users: 24381, newUsers: 581 },
];

type Plan = "Pro" | "Starter" | "Enterprise" | "Free";
type Status = "Active" | "Inactive" | "Pending";

interface UserRow {
  id: string;
  name: string;
  email: string;
  plan: Plan;
  status: Status;
  joinDate: string;
  avatar: string;
}

const mockUsers: UserRow[] = [
  { id: "u1", name: "Sophia Hartwell", email: "sophia@hartwell.io", plan: "Enterprise", status: "Active", joinDate: "2024-01-12", avatar: "SH" },
  { id: "u2", name: "Marcus Chen", email: "m.chen@techflow.com", plan: "Pro", status: "Active", joinDate: "2024-02-03", avatar: "MC" },
  { id: "u3", name: "Priya Nair", email: "priya.nair@designco.in", plan: "Pro", status: "Active", joinDate: "2024-02-18", avatar: "PN" },
  { id: "u4", name: "James Okafor", email: "james@okafor.dev", plan: "Starter", status: "Active", joinDate: "2024-03-05", avatar: "JO" },
  { id: "u5", name: "Elena Vasquez", email: "elena.v@cloudnine.es", plan: "Enterprise", status: "Active", joinDate: "2024-03-14", avatar: "EV" },
  { id: "u6", name: "Liam Fitzgerald", email: "liam.f@irishtech.ie", plan: "Free", status: "Inactive", joinDate: "2024-03-22", avatar: "LF" },
  { id: "u7", name: "Aisha Kamara", email: "aisha@kamara.co", plan: "Pro", status: "Active", joinDate: "2024-04-01", avatar: "AK" },
  { id: "u8", name: "Noah Bergström", email: "noah.b@nordic.se", plan: "Starter", status: "Pending", joinDate: "2024-04-09", avatar: "NB" },
  { id: "u9", name: "Chloe Dupont", email: "chloe.d@agence.fr", plan: "Pro", status: "Active", joinDate: "2024-04-17", avatar: "CD" },
  { id: "u10", name: "Ravi Sharma", email: "ravi.s@infosys.in", plan: "Enterprise", status: "Active", joinDate: "2024-05-02", avatar: "RS" },
  { id: "u11", name: "Isabella Torres", email: "isa.torres@latam.mx", plan: "Starter", status: "Active", joinDate: "2024-05-11", avatar: "IT" },
  { id: "u12", name: "Oliver Müller", email: "oliver.m@berlin.de", plan: "Free", status: "Inactive", joinDate: "2024-05-20", avatar: "OM" },
  { id: "u13", name: "Fatima Al-Hassan", email: "fatima@alhassan.ae", plan: "Pro", status: "Active", joinDate: "2024-06-03", avatar: "FA" },
  { id: "u14", name: "Ethan Brooks", email: "ethan.b@startup.us", plan: "Starter", status: "Active", joinDate: "2024-06-15", avatar: "EB" },
  { id: "u15", name: "Yuki Tanaka", email: "yuki.t@pixel.jp", plan: "Pro", status: "Pending", joinDate: "2024-07-01", avatar: "YT" },
  { id: "u16", name: "Amara Diallo", email: "amara.d@dakar.sn", plan: "Free", status: "Active", joinDate: "2024-07-14", avatar: "AD" },
  { id: "u17", name: "Lucas Pereira", email: "lucas.p@saopaulo.br", plan: "Enterprise", status: "Active", joinDate: "2024-08-02", avatar: "LP" },
  { id: "u18", name: "Mia Johansson", email: "mia.j@sthlm.se", plan: "Pro", status: "Active", joinDate: "2024-08-19", avatar: "MJ" },
  { id: "u19", name: "Daniel Kim", email: "d.kim@seoultech.kr", plan: "Starter", status: "Inactive", joinDate: "2024-09-05", avatar: "DK" },
  { id: "u20", name: "Grace Osei", email: "grace.o@accra.gh", plan: "Pro", status: "Active", joinDate: "2024-09-22", avatar: "GO" },
];

// ─── Helper Components ────────────────────────────────────────────────────────

const planColors: Record<Plan, string> = {
  Enterprise: "bg-violet-500/15 text-violet-300 border border-violet-500/25",
  Pro: "bg-indigo-500/15 text-indigo-300 border border-indigo-500/25",
  Starter: "bg-cyan-500/15 text-cyan-300 border border-cyan-500/25",
  Free: "bg-slate-500/15 text-slate-400 border border-slate-500/25",
};

const statusColors: Record<Status, string> = {
  Active: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
  Inactive: "bg-red-500/15 text-red-400 border border-red-500/25",
  Pending: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
};

const avatarColors = [
  "from-indigo-500 to-violet-600",
  "from-cyan-500 to-blue-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-violet-500 to-purple-600",
];

function getAvatarColor(id: string): string {
  const index = id.charCodeAt(1) % avatarColors.length;
  return avatarColors[index] ?? avatarColors[0];
}

function formatDate(dateStr: string): string {
  const parts = dateStr.split("-");
  if (parts.length < 3) return dateStr;
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const monthIndex = parseInt(parts[1] ?? "1", 10) - 1;
  const month = months[monthIndex] ?? "Jan";
  const day = parseInt(parts[2] ?? "1", 10);
  const year = parts[0] ?? "2024";
  return `${month} ${day}, ${year}`;
}

type SortKey = "name" | "email" | "plan" | "status" | "joinDate";
type SortDir = "asc" | "desc";

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-[#1E1E2E] border border-[#2D2D4E] rounded-xl p-3 shadow-xl shadow-black/40">
      <p className="text-xs text-slate-400 mb-2 font-medium">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-slate-300 capitalize">{entry.name}:</span>
          <span className="text-white font-semibold">{(entry.value ?? 0).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<Plan | "All">("All");
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All");
  const [sortKey, setSortKey] = useState<SortKey>("joinDate");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(0);
  const pageSize = 8;

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(0);
  };

  const filtered = useMemo(() => {
    let rows = [...mockUsers];
    const q = search.toLowerCase();
    if (q) {
      rows = rows.filter(
        (u) =>
          (u.name ?? "").toLowerCase().includes(q) ||
          (u.email ?? "").toLowerCase().includes(q)
      );
    }
    if (planFilter !== "All") rows = rows.filter((u) => u.plan === planFilter);
    if (statusFilter !== "All") rows = rows.filter((u) => u.status === statusFilter);
    rows.sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [search, planFilter, statusFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const pageRows = filtered.slice(page * pageSize, page * pageSize + pageSize);

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="w-3.5 h-3.5 text-slate-600" />;
    return sortDir === "asc"
      ? <ChevronUp className="w-3.5 h-3.5 text-indigo-400" />
      : <ChevronDown className="w-3.5 h-3.5 text-indigo-400" />;
  };

  return (
    <main className="min-h-screen bg-[#0A0A14] pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Page Header ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mb-10"
        >
          <motion.div variants={fadeInUp} className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide uppercase">
              <User className="w-3 h-3" />
              User Management
            </span>
          </motion.div>
          <motion.h1
            variants={fadeInUp}
            className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2"
          >
            Users &amp; Growth
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-slate-400 text-base max-w-xl">
            Monitor user acquisition, engagement, and retention across all plans and cohorts.
          </motion.p>
        </motion.div>

        {/* ── KPI Cards ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {kpiCards.map((card) => {
            const Icon = card.icon;
            const isPositive = card.change >= 0;
            return (
              <motion.div
                key={card.id}
                variants={scaleIn}
                whileHover={{ y: -4, scale: 1.02 }}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.bg} border ${card.border} p-5 cursor-default`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${card.color}22` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: card.color }} />
                  </div>
                  <span
                    className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                      isPositive
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-red-500/15 text-red-400"
                    }`}
                  >
                    {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {Math.abs(card.change)}%
                  </span>
                </div>
                <p className="text-2xl font-bold text-white mb-1">{card.value}</p>
                <p className="text-xs text-slate-400">{card.label}</p>
                <p className="text-xs text-slate-600 mt-0.5">{card.changeLabel}</p>
                {/* Decorative glow */}
                <div
                  className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-10 blur-2xl"
                  style={{ backgroundColor: card.color }}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Area Chart ── */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="rounded-2xl bg-[#16162A] border border-[#2D2D4E] p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Cumulative User Growth</h2>
              <p className="text-sm text-slate-500 mt-0.5">Total registered users over the past 12 months</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 rounded-full bg-indigo-400 inline-block" />
                Total Users
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 rounded-full bg-cyan-400 inline-block" />
                New Users
              </span>
            </div>
          </div>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradNew" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D2D4E" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#64748B", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#64748B", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="users"
                  name="Total Users"
                  stroke="#6366F1"
                  strokeWidth={2.5}
                  fill="url(#gradUsers)"
                  dot={false}
                  activeDot={{ r: 5, fill: "#6366F1", stroke: "#fff", strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="newUsers"
                  name="New Users"
                  stroke="#06B6D4"
                  strokeWidth={2}
                  fill="url(#gradNew)"
                  dot={false}
                  activeDot={{ r: 5, fill: "#06B6D4", stroke: "#fff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* ── User Table ── */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="rounded-2xl bg-[#16162A] border border-[#2D2D4E] overflow-hidden"
        >
          {/* Table Header / Filters */}
          <div className="p-5 border-b border-[#2D2D4E] flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">All Users</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {filtered.length} user{filtered.length !== 1 ? "s" : ""} found
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search users…"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                  className="pl-9 pr-3 py-2 text-sm bg-[#0F0F1A] border border-[#2D2D4E] rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 w-48 transition-all"
                />
              </div>
              {/* Plan Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <select
                  value={planFilter}
                  onChange={(e) => { setPlanFilter(e.target.value as Plan | "All"); setPage(0); }}
                  className="pl-8 pr-8 py-2 text-sm bg-[#0F0F1A] border border-[#2D2D4E] rounded-lg text-slate-300 focus:outline-none focus:border-indigo-500/50 appearance-none cursor-pointer"
                >
                  <option value="All">All Plans</option>
                  <option value="Enterprise">Enterprise</option>
                  <option value="Pro">Pro</option>
                  <option value="Starter">Starter</option>
                  <option value="Free">Free</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
              </div>
              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value as Status | "All"); setPage(0); }}
                  className="pl-3 pr-8 py-2 text-sm bg-[#0F0F1A] border border-[#2D2D4E] rounded-lg text-slate-300 focus:outline-none focus:border-indigo-500/50 appearance-none cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2D2D4E]">
                  {(
                    [
                      { key: "name", label: "User" },
                      { key: "email", label: "Email" },
                      { key: "plan", label: "Plan" },
                      { key: "status", label: "Status" },
                      { key: "joinDate", label: "Joined" },
                    ] as { key: SortKey; label: string }[]
                  ).map((col) => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-300 transition-colors select-none"
                    >
                      <span className="flex items-center gap-1.5">
                        {col.label}
                        <SortIcon col={col.key} />
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="wait">
                  {pageRows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-16 text-center text-slate-500">
                        No users match your filters.
                      </td>
                    </tr>
                  ) : (
                    pageRows.map((user, i) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, delay: i * 0.03 }}
                        whileHover={{ backgroundColor: "rgba(99,102,241,0.04)" }}
                        className="border-b border-[#2D2D4E]/50 last:border-0 transition-colors"
                      >
                        {/* Name + Avatar */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarColor(user.id)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                            >
                              {user.avatar}
                            </div>
                            <span className="text-white font-medium">{user.name}</span>
                          </div>
                        </td>
                        {/* Email */}
                        <td className="px-5 py-4">
                          <span className="flex items-center gap-1.5 text-slate-400">
                            <Mail className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                            {user.email}
                          </span>
                        </td>
                        {/* Plan */}
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${planColors[user.plan]}`}>
                            {user.plan}
                          </span>
                        </td>
                        {/* Status */}
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[user.status]}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              user.status === "Active" ? "bg-emerald-400" :
                              user.status === "Inactive" ? "bg-red-400" : "bg-amber-400"
                            }`} />
                            {user.status}
                          </span>
                        </td>
                        {/* Join Date */}
                        <td className="px-5 py-4">
                          <span className="flex items-center gap-1.5 text-slate-400">
                            <Calendar className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                            {formatDate(user.joinDate)}
                          </span>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-5 py-4 border-t border-[#2D2D4E] flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-3 py-1.5 text-xs rounded-lg border border-[#2D2D4E] text-slate-400 hover:text-white hover:border-indigo-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </motion.button>
                {Array.from({ length: totalPages }, (_, i) => i).map((i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => setPage(i)}
                    className={`w-8 h-8 text-xs rounded-lg border transition-all ${
                      page === i
                        ? "bg-indigo-500 border-indigo-500 text-white font-semibold"
                        : "border-[#2D2D4E] text-slate-400 hover:text-white hover:border-indigo-500/40"
                    }`}
                  >
                    {i + 1}
                  </motion.button>
                ))}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page === totalPages - 1}
                  className="px-3 py-1.5 text-xs rounded-lg border border-[#2D2D4E] text-slate-400 hover:text-white hover:border-indigo-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}