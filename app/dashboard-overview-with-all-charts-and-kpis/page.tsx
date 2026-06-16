"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, Users, DollarSign, Activity, ArrowUpRight, ArrowDownRight, Eye, ShoppingCart, Star, AlertCircle, CheckCircle, Clock, Filter, Download, RefreshCw } from 'lucide-react';
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";
import { BRAND_COLORS, CHART_COLORS } from "@/lib/data";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const kpiCards = [
  {
    id: "revenue",
    label: "Total Revenue",
    value: "$128,450",
    rawValue: 128450,
    change: 12.4,
    changeLabel: "vs last month",
    icon: DollarSign,
    color: "#6366F1",
    bg: "from-indigo-500/20 to-indigo-600/5",
    border: "border-indigo-500/20",
  },
  {
    id: "users",
    label: "Active Users",
    value: "24,318",
    rawValue: 24318,
    change: 8.1,
    changeLabel: "vs last month",
    icon: Users,
    color: "#8B5CF6",
    bg: "from-violet-500/20 to-violet-600/5",
    border: "border-violet-500/20",
  },
  {
    id: "mrr",
    label: "Monthly MRR",
    value: "$52,890",
    rawValue: 52890,
    change: 5.7,
    changeLabel: "vs last month",
    icon: TrendingUp,
    color: "#06B6D4",
    bg: "from-cyan-500/20 to-cyan-600/5",
    border: "border-cyan-500/20",
  },
  {
    id: "churn",
    label: "Churn Rate",
    value: "2.4%",
    rawValue: 2.4,
    change: -0.4,
    changeLabel: "vs last month",
    icon: Activity,
    color: "#10B981",
    bg: "from-emerald-500/20 to-emerald-600/5",
    border: "border-emerald-500/20",
  },
  {
    id: "sessions",
    label: "Avg. Sessions",
    value: "6.2 / day",
    rawValue: 6.2,
    change: 3.2,
    changeLabel: "vs last month",
    icon: Eye,
    color: "#F59E0B",
    bg: "from-amber-500/20 to-amber-600/5",
    border: "border-amber-500/20",
  },
  {
    id: "conversions",
    label: "Conversions",
    value: "3,841",
    rawValue: 3841,
    change: -1.8,
    changeLabel: "vs last month",
    icon: ShoppingCart,
    color: "#EF4444",
    bg: "from-red-500/20 to-red-600/5",
    border: "border-red-500/20",
  },
];

const revenueData = [
  { month: "Jan", revenue: 42000, mrr: 38000, expenses: 28000 },
  { month: "Feb", revenue: 48500, mrr: 41000, expenses: 30000 },
  { month: "Mar", revenue: 55200, mrr: 44500, expenses: 31500 },
  { month: "Apr", revenue: 51800, mrr: 43000, expenses: 29800 },
  { month: "May", revenue: 63400, mrr: 49000, expenses: 33200 },
  { month: "Jun", revenue: 72100, mrr: 52000, expenses: 35600 },
  { month: "Jul", revenue: 68900, mrr: 50500, expenses: 34100 },
  { month: "Aug", revenue: 79300, mrr: 55000, expenses: 37800 },
  { month: "Sep", revenue: 88600, mrr: 58500, expenses: 40200 },
  { month: "Oct", revenue: 95200, mrr: 61000, expenses: 42500 },
  { month: "Nov", revenue: 112400, mrr: 67000, expenses: 46800 },
  { month: "Dec", revenue: 128450, mrr: 72000, expenses: 51200 },
];

const userGrowthData = [
  { month: "Jan", newUsers: 1200, activeUsers: 8400, churned: 320 },
  { month: "Feb", newUsers: 1450, activeUsers: 9200, churned: 280 },
  { month: "Mar", newUsers: 1800, activeUsers: 10600, churned: 310 },
  { month: "Apr", newUsers: 1600, activeUsers: 11400, churned: 350 },
  { month: "May", newUsers: 2100, activeUsers: 13200, churned: 290 },
  { month: "Jun", newUsers: 2400, activeUsers: 15100, churned: 260 },
  { month: "Jul", newUsers: 2200, activeUsers: 16800, churned: 300 },
  { month: "Aug", newUsers: 2700, activeUsers: 18900, churned: 240 },
  { month: "Sep", newUsers: 3100, activeUsers: 21200, churned: 220 },
  { month: "Oct", newUsers: 2900, activeUsers: 22800, churned: 250 },
  { month: "Nov", newUsers: 3400, activeUsers: 24100, churned: 210 },
  { month: "Dec", newUsers: 3800, activeUsers: 24318, churned: 190 },
];

const trafficSourceData = [
  { name: "Organic Search", value: 38, color: "#6366F1" },
  { name: "Direct", value: 24, color: "#8B5CF6" },
  { name: "Referral", value: 18, color: "#06B6D4" },
  { name: "Social Media", value: 12, color: "#10B981" },
  { name: "Email", value: 8, color: "#F59E0B" },
];

const conversionFunnelData = [
  { stage: "Visitors", count: 84200, pct: 100 },
  { stage: "Sign-ups", count: 12630, pct: 15 },
  { stage: "Activated", count: 7578, pct: 9 },
  { stage: "Paying", count: 3841, pct: 4.6 },
  { stage: "Retained", count: 3074, pct: 3.7 },
];

const recentTransactions = [
  { id: "TXN-8821", customer: "Acme Corp", plan: "Enterprise", amount: 2400, status: "paid", date: "Dec 28" },
  { id: "TXN-8820", customer: "Bright Labs", plan: "Pro", amount: 490, status: "paid", date: "Dec 27" },
  { id: "TXN-8819", customer: "Nova Studio", plan: "Starter", amount: 99, status: "pending", date: "Dec 27" },
  { id: "TXN-8818", customer: "Zenith AI", plan: "Enterprise", amount: 2400, status: "paid", date: "Dec 26" },
  { id: "TXN-8817", customer: "Pixel Works", plan: "Pro", amount: 490, status: "failed", date: "Dec 26" },
  { id: "TXN-8816", customer: "Orbit Tech", plan: "Pro", amount: 490, status: "paid", date: "Dec 25" },
  { id: "TXN-8815", customer: "Cascade Inc", plan: "Starter", amount: 99, status: "paid", date: "Dec 25" },
];

const topPages = [
  { page: "/dashboard", views: 48200, bounce: "24%", duration: "4m 12s" },
  { page: "/analytics", views: 31500, bounce: "31%", duration: "3m 48s" },
  { page: "/revenue", views: 22800, bounce: "28%", duration: "5m 02s" },
  { page: "/users", views: 18400, bounce: "35%", duration: "2m 55s" },
  { page: "/settings", views: 9600, bounce: "42%", duration: "1m 38s" },
];

const activityFeed = [
  { id: 1, type: "success", text: "Revenue milestone: $128k reached", time: "2m ago", icon: Star },
  { id: 2, type: "info", text: "New cohort report generated for Q4", time: "18m ago", icon: Activity },
  { id: 3, type: "success", text: "Churn rate dropped to 2.4% this week", time: "1h ago", icon: TrendingDown },
  { id: 4, type: "warning", text: "TXN-8817 payment failed — retry scheduled", time: "2h ago", icon: AlertCircle },
  { id: 5, type: "success", text: "3,800 new users onboarded in December", time: "4h ago", icon: Users },
  { id: 6, type: "info", text: "System health check passed — all green", time: "6h ago", icon: CheckCircle },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    paid: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
    pending: "bg-amber-500/15 text-amber-400 border-amber-500/25",
    failed: "bg-red-500/15 text-red-400 border-red-500/25",
  };
  return map[status] ?? "bg-slate-500/15 text-slate-400 border-slate-500/25";
};

const activityColor = (type: string) => {
  const map: Record<string, string> = {
    success: "bg-emerald-500/20 text-emerald-400",
    info: "bg-indigo-500/20 text-indigo-400",
    warning: "bg-amber-500/20 text-amber-400",
    danger: "bg-red-500/20 text-red-400",
  };
  return map[type] ?? "bg-slate-500/20 text-slate-400";
};

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-[#1E1E2E] border border-[#2D2D4E] rounded-xl p-3 shadow-xl shadow-black/40 text-sm">
      <p className="text-slate-400 mb-2 font-medium">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-slate-300 capitalize">{entry.name}:</span>
          <span className="text-white font-semibold">
            {typeof entry.value === "number" && entry.name.toLowerCase().includes("revenue") || entry.name.toLowerCase().includes("mrr") || entry.name.toLowerCase().includes("expense")
              ? `$${(entry.value ?? 0).toLocaleString()}`
              : (entry.value ?? 0).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const RANGE_OPTIONS = ["7D", "30D", "90D", "12M"] as const;
type RangeOption = typeof RANGE_OPTIONS[number];

export default function DashboardOverviewPage() {
  const [activeRange, setActiveRange] = useState<RangeOption>("12M");
  const [activeChart, setActiveChart] = useState<"revenue" | "users">("revenue");

  return (
    <main className="min-h-screen bg-[#0A0A14] text-white pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10"
        >
          <motion.div variants={fadeInUp}>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Dashboard{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                Overview
              </span>
            </h1>
            <p className="text-slate-400 mt-1 text-sm">
              All your key metrics and analytics in one place — updated in real time.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex items-center gap-2 flex-wrap">
            {/* Range Selector */}
            <div className="flex items-center gap-1 bg-[#16162A] border border-[#2D2D4E] rounded-xl p-1">
              {RANGE_OPTIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setActiveRange(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    activeRange === r
                      ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#16162A] border border-[#2D2D4E] text-slate-400 hover:text-white text-xs font-medium transition-colors"
            >
              <Filter className="w-3.5 h-3.5" /> Filter
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 hover:text-white text-xs font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Export
            </motion.button>
          </motion.div>
        </motion.div>

        {/* ── KPI Cards ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8"
        >
          {kpiCards.map((card) => {
            const Icon = card.icon;
            const isPositive = card.change >= 0;
            const isChurn = card.id === "churn";
            const good = isChurn ? !isPositive : isPositive;
            return (
              <motion.div
                key={card.id}
                variants={scaleIn}
                whileHover={{ y: -4, scale: 1.02 }}
                className={`relative bg-gradient-to-br ${card.bg} border ${card.border} rounded-2xl p-4 overflow-hidden cursor-default`}
              >
                <div
                  className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-10"
                  style={{ background: card.color }}
                />
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: `${card.color}22` }}
                >
                  <Icon className="w-4 h-4" style={{ color: card.color }} />
                </div>
                <p className="text-xs text-slate-400 font-medium mb-1 leading-tight">{card.label}</p>
                <p className="text-xl font-bold text-white tracking-tight">{card.value}</p>
                <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${good ? "text-emerald-400" : "text-red-400"}`}>
                  {good ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {Math.abs(card.change)}%
                  <span className="text-slate-500 font-normal ml-0.5">{card.changeLabel}</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Main Chart + Traffic Sources ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          {/* Area / Bar Chart */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="xl:col-span-2 bg-[#16162A] border border-[#2D2D4E] rounded-2xl p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div>
                <h2 className="text-base font-semibold text-white">Performance Overview</h2>
                <p className="text-xs text-slate-500 mt-0.5">Revenue, MRR & expenses across {activeRange}</p>
              </div>
              <div className="flex items-center gap-1 bg-[#0F0F1A] border border-[#2D2D4E] rounded-xl p-1">
                {(["revenue", "users"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveChart(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-200 ${
                      activeChart === tab
                        ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {tab === "revenue" ? "Revenue" : "Users"}
                  </button>
                ))}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={280}>
              {activeChart === "revenue" ? (
                <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradMrr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradExp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D2D4E" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, color: "#94A3B8", paddingTop: 12 }} />
                  <Area type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={2} fill="url(#gradRevenue)" dot={false} activeDot={{ r: 5, fill: "#6366F1" }} />
                  <Area type="monotone" dataKey="mrr" stroke="#06B6D4" strokeWidth={2} fill="url(#gradMrr)" dot={false} activeDot={{ r: 5, fill: "#06B6D4" }} />
                  <Area type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={1.5} fill="url(#gradExp)" dot={false} activeDot={{ r: 4, fill: "#EF4444" }} strokeDasharray="4 3" />
                </AreaChart>
              ) : (
                <BarChart data={userGrowthData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D2D4E" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, color: "#94A3B8", paddingTop: 12 }} />
                  <Bar dataKey="newUsers" fill="#6366F1" radius={[4, 4, 0, 0]} maxBarSize={20} />
                  <Bar dataKey="activeUsers" fill="#8B5CF6" radius={[4, 4, 0, 0]} maxBarSize={20} />
                  <Bar dataKey="churned" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={20} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </motion.div>

          {/* Traffic Sources Pie */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="bg-[#16162A] border border-[#2D2D4E] rounded-2xl p-6 flex flex-col"
          >
            <h2 className="text-base font-semibold text-white mb-1">Traffic Sources</h2>
            <p className="text-xs text-slate-500 mb-4">Where your visitors come from</p>

            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={trafficSourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {trafficSourceData.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#1E1E2E", border: "1px solid #2D2D4E", borderRadius: 12, fontSize: 12 }}
                  itemStyle={{ color: "#CBD5E1" }}
                  formatter={(value: number) => [`${value}%`, "Share"]}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="mt-4 space-y-2.5 flex-1">
              {trafficSourceData.map((src) => (
                <div key={src.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: src.color }} />
                    <span className="text-xs text-slate-400">{src.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-[#2D2D4E] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${src.value}%`, background: src.color }} />
                    </div>
                    <span className="text-xs font-semibold text-white w-8 text-right">{src.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Conversion Funnel + Line Chart ── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          {/* Conversion Funnel */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="bg-[#16162A] border border-[#2D2D4E] rounded-2xl p-6"
          >
            <h2 className="text-base font-semibold text-white mb-1">Conversion Funnel</h2>
            <p className="text-xs text-slate-500 mb-6">Visitor-to-paying-customer pipeline</p>
            <div className="space-y-3">
              {conversionFunnelData.map((stage, i) => (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-slate-300">{stage.stage}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500">{stage.pct}%</span>
                      <span className="text-xs font-semibold text-white">{(stage.count ?? 0).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-[#2D2D4E] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${stage.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${CHART_COLORS[i % CHART_COLORS.length]}, ${CHART_COLORS[(i + 1) % CHART_COLORS.length]})`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-[#2D2D4E] flex items-center justify-between">
              <span className="text-xs text-slate-500">Overall conversion rate</span>
              <span className="text-sm font-bold text-indigo-400">4.6%</span>
            </div>
          </motion.div>

          {/* MRR Line Chart */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="bg-[#16162A] border border-[#2D2D4E] rounded-2xl p-6"
          >
            <h2 className="text-base font-semibold text-white mb-1">MRR Growth</h2>
            <p className="text-xs text-slate-500 mb-4">Monthly recurring revenue trajectory</p>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={revenueData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D2D4E" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: "#94A3B8", paddingTop: 12 }} />
                <Line type="monotone" dataKey="mrr" stroke="#6366F1" strokeWidth={2.5} dot={{ fill: "#6366F1", r: 3 }} activeDot={{ r: 6, fill: "#6366F1" }} />
                <Line type="monotone" dataKey="revenue" stroke="#06B6D4" strokeWidth={2} dot={false} activeDot={{ r: 5, fill: "#06B6D4" }} strokeDasharray="5 3" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* ── Transactions Table + Activity Feed ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          {/* Transactions */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="xl:col-span-2 bg-[#16162A] border border-[#2D2D4E] rounded-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#2D2D4E]">
              <div>
                <h2 className="text-base font-semibold text-white">Recent Transactions</h2>
                <p className="text-xs text-slate-500 mt-0.5">Latest billing activity across all plans</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                View all →
              </motion.button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2D2D4E]">
                    {["Transaction", "Customer", "Plan", "Amount", "Status", "Date"].map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((tx, i) => (
                    <motion.tr
                      key={tx.id}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, duration: 0.35 }}
                      className="border-b border-[#2D2D4E]/50 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-3.5 text-xs font-mono text-indigo-400">{tx.id}</td>
                      <td className="px-6 py-3.5 text-sm text-white font-medium">{tx.customer}</td>
                      <td className="px-6 py-3.5">
                        <span className="text-xs px-2 py-0.5 rounded-md bg-[#2D2D4E] text-slate-300">{tx.plan}</span>
                      </td>
                      <td className="px-6 py-3.5 text-sm font-semibold text-white">${(tx.amount ?? 0).toLocaleString()}</td>
                      <td className="px-6 py-3.5">
                        <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold capitalize ${statusBadge(tx.status)}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-xs text-slate-500">{tx.date}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Activity Feed */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="bg-[#16162A] border border-[#2D2D4E] rounded-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#2D2D4E]">
              <h2 className="text-base font-semibold text-white">Activity Feed</h2>
              <motion.button
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.4 }}
                className="text-slate-500 hover:text-indigo-400 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </motion.button>
            </div>
            <div className="p-4 space-y-3">
              {activityFeed.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.35 }}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors"
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${activityColor(item.type)}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-300 leading-snug">{item.text}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3 text-slate-600" />
                        <span className="text-xs text-slate-600">{item.time}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* ── Top Pages Table ── */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="bg-[#16162A] border border-[#2D2D4E] rounded-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#2D2D4E]">
            <div>
              <h2 className="text-base font-semibold text-white">Top Pages</h2>
              <p className="text-xs text-slate-500 mt-0.5">Most visited pages by session volume</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2D2D4E]">
                  {["Page", "Page Views", "Bounce Rate", "Avg. Duration", "Trend"].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topPages.map((page, i) => (
                  <motion.tr
                    key={page.page}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    className="border-b border-[#2D2D4E]/50 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-3.5 font-mono text-xs text-indigo-300">{page.page}</td>
                    <td className="px-6 py-3.5 text-sm font-semibold text-white">{(page.views ?? 0).toLocaleString()}</td>
                    <td className="px-6 py-3.5 text-sm text-slate-400">{page.bounce}</td>
                    <td className="px-6 py-3.5 text-sm text-slate-400">{page.duration}</td>
                    <td className="px-6 py-3.5">
                      <div className="w-24 h-1.5 bg-[#2D2D4E] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                          style={{ width: `${Math.round((page.views / 48200) * 100)}%` }}
                        />
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* ── Footer Note ── */}
        <motion.p
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center text-xs text-slate-600 mt-10"
        >
          Data refreshed every 5 minutes · Pulse Analytics v2.4.1 · All times in UTC
        </motion.p>
      </div>
    </main>
  );
}