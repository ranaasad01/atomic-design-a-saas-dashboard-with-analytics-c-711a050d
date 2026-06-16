"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, Users, AlertTriangle, ArrowUpRight, ArrowDownRight, Calendar, Download, Filter, ChevronDown, Activity, BarChart2, RefreshCw } from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
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

// ── Mock Data ────────────────────────────────────────────────────────────────

const mrrArrData = [
  { month: "Jan", mrr: 38200, arr: 458400, newMRR: 5200, expansionMRR: 2100, churnedMRR: 1800 },
  { month: "Feb", mrr: 41500, arr: 498000, newMRR: 5800, expansionMRR: 2400, churnedMRR: 1900 },
  { month: "Mar", mrr: 44800, arr: 537600, newMRR: 6100, expansionMRR: 2600, churnedMRR: 1400 },
  { month: "Apr", mrr: 47200, arr: 566400, newMRR: 5500, expansionMRR: 2900, churnedMRR: 2100 },
  { month: "May", mrr: 51600, arr: 619200, newMRR: 7200, expansionMRR: 3100, churnedMRR: 1700 },
  { month: "Jun", mrr: 55900, arr: 670800, newMRR: 7800, expansionMRR: 3400, churnedMRR: 1300 },
  { month: "Jul", mrr: 59400, arr: 712800, newMRR: 6900, expansionMRR: 3600, churnedMRR: 2000 },
  { month: "Aug", mrr: 63100, arr: 757200, newMRR: 7400, expansionMRR: 3900, churnedMRR: 1800 },
  { month: "Sep", mrr: 67800, arr: 813600, newMRR: 8200, expansionMRR: 4100, churnedMRR: 1500 },
  { month: "Oct", mrr: 72400, arr: 868800, newMRR: 8900, expansionMRR: 4400, churnedMRR: 1700 },
  { month: "Nov", mrr: 76900, arr: 922800, newMRR: 9100, expansionMRR: 4700, churnedMRR: 2200 },
  { month: "Dec", mrr: 82300, arr: 987600, newMRR: 9800, expansionMRR: 5100, churnedMRR: 1500 },
];

const churnData = [
  { month: "Jan", churnRate: 4.7, revenueChurn: 3.2, logoChurn: 2.1 },
  { month: "Feb", churnRate: 4.5, revenueChurn: 3.0, logoChurn: 2.0 },
  { month: "Mar", churnRate: 4.2, revenueChurn: 2.8, logoChurn: 1.9 },
  { month: "Apr", churnRate: 4.4, revenueChurn: 3.1, logoChurn: 2.2 },
  { month: "May", churnRate: 4.0, revenueChurn: 2.7, logoChurn: 1.8 },
  { month: "Jun", churnRate: 3.7, revenueChurn: 2.5, logoChurn: 1.6 },
  { month: "Jul", churnRate: 3.9, revenueChurn: 2.6, logoChurn: 1.7 },
  { month: "Aug", churnRate: 3.5, revenueChurn: 2.3, logoChurn: 1.5 },
  { month: "Sep", churnRate: 3.2, revenueChurn: 2.1, logoChurn: 1.4 },
  { month: "Oct", churnRate: 3.0, revenueChurn: 1.9, logoChurn: 1.3 },
  { month: "Nov", churnRate: 3.3, revenueChurn: 2.2, logoChurn: 1.5 },
  { month: "Dec", churnRate: 2.8, revenueChurn: 1.8, logoChurn: 1.2 },
];

const mrrBreakdownPie = [
  { name: "New MRR", value: 9800, color: CHART_COLORS[0] },
  { name: "Expansion MRR", value: 5100, color: CHART_COLORS[1] },
  { name: "Reactivation MRR", value: 1200, color: CHART_COLORS[2] },
  { name: "Churned MRR", value: -1500, color: CHART_COLORS[5] },
];

const mrrBreakdownPieDisplay = [
  { name: "New MRR", value: 9800, color: CHART_COLORS[0] },
  { name: "Expansion MRR", value: 5100, color: CHART_COLORS[1] },
  { name: "Reactivation MRR", value: 1200, color: CHART_COLORS[2] },
  { name: "Churned MRR", value: 1500, color: CHART_COLORS[5] },
];

const planBreakdown = [
  { plan: "Enterprise", customers: 48, mrr: 38400, arr: 460800, avgRevenue: 800, churn: 1.2, color: CHART_COLORS[0] },
  { plan: "Business", customers: 142, mrr: 28400, arr: 340800, avgRevenue: 200, churn: 2.8, color: CHART_COLORS[1] },
  { plan: "Starter", customers: 389, mrr: 11700, arr: 140400, avgRevenue: 30, churn: 5.4, color: CHART_COLORS[2] },
  { plan: "Free Trial", customers: 214, mrr: 3800, arr: 45600, avgRevenue: 18, churn: 12.1, color: CHART_COLORS[4] },
];

const churnedAccounts = [
  { id: "CHR-001", company: "Nexus Corp", plan: "Business", mrr: 400, reason: "Price", date: "Dec 28", risk: "high" },
  { id: "CHR-002", company: "Orbit Labs", plan: "Starter", mrr: 30, reason: "No longer needed", date: "Dec 26", risk: "low" },
  { id: "CHR-003", company: "Vantage AI", plan: "Enterprise", mrr: 1200, reason: "Competitor", date: "Dec 22", risk: "high" },
  { id: "CHR-004", company: "Bloom Studio", plan: "Business", mrr: 200, reason: "Budget cuts", date: "Dec 19", risk: "medium" },
  { id: "CHR-005", company: "Crest Digital", plan: "Starter", mrr: 30, reason: "Unused", date: "Dec 15", risk: "low" },
  { id: "CHR-006", company: "Pinnacle SaaS", plan: "Business", mrr: 200, reason: "Missing features", date: "Dec 12", risk: "medium" },
];

const atRiskAccounts = [
  { id: "RSK-001", company: "Apex Ventures", plan: "Enterprise", mrr: 1600, healthScore: 28, lastLogin: "14d ago", signal: "Low usage" },
  { id: "RSK-002", company: "Meridian Tech", plan: "Business", mrr: 400, healthScore: 41, lastLogin: "9d ago", signal: "Support tickets" },
  { id: "RSK-003", company: "Solaris Group", plan: "Business", mrr: 200, healthScore: 35, lastLogin: "21d ago", signal: "No logins" },
  { id: "RSK-004", company: "Cascade IO", plan: "Enterprise", mrr: 800, healthScore: 52, lastLogin: "6d ago", signal: "Downgrade intent" },
  { id: "RSK-005", company: "Vertex Cloud", plan: "Starter", mrr: 60, healthScore: 44, lastLogin: "11d ago", signal: "Low usage" },
];

const kpis = [
  {
    id: "mrr",
    label: "Monthly Recurring Revenue",
    value: "$82,300",
    raw: 82300,
    change: 7.0,
    sub: "vs last month",
    icon: DollarSign,
    color: "indigo",
    gradient: "from-indigo-500/20 to-indigo-600/5",
    border: "border-indigo-500/30",
    iconBg: "bg-indigo-500/20",
    iconColor: "text-indigo-400",
  },
  {
    id: "arr",
    label: "Annual Recurring Revenue",
    value: "$987,600",
    raw: 987600,
    change: 7.0,
    sub: "annualized MRR",
    icon: TrendingUp,
    color: "violet",
    gradient: "from-violet-500/20 to-violet-600/5",
    border: "border-violet-500/30",
    iconBg: "bg-violet-500/20",
    iconColor: "text-violet-400",
  },
  {
    id: "net_new_mrr",
    label: "Net New MRR",
    value: "+$14,600",
    raw: 14600,
    change: 12.3,
    sub: "new + expansion − churn",
    icon: ArrowUpRight,
    color: "cyan",
    gradient: "from-cyan-500/20 to-cyan-600/5",
    border: "border-cyan-500/30",
    iconBg: "bg-cyan-500/20",
    iconColor: "text-cyan-400",
  },
  {
    id: "churn_rate",
    label: "Monthly Churn Rate",
    value: "2.8%",
    raw: 2.8,
    change: -0.5,
    sub: "vs 3.3% last month",
    icon: AlertTriangle,
    color: "emerald",
    gradient: "from-emerald-500/20 to-emerald-600/5",
    border: "border-emerald-500/30",
    iconBg: "bg-emerald-500/20",
    iconColor: "text-emerald-400",
    invertChange: true,
  },
];

// ── Custom Tooltip ────────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl p-3 shadow-xl shadow-black/40 min-w-[160px]">
      <p className="text-xs text-slate-400 mb-2 font-medium">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-4 text-xs mb-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-400">{entry.name}</span>
          </span>
          <span className="font-semibold text-white">
            {typeof entry.value === "number" && entry.name.toLowerCase().includes("rate")
              ? `${(entry.value ?? 0).toFixed(1)}%`
              : `$${(entry.value ?? 0).toLocaleString()}`}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function RevenueMRRARRChurnPage() {
  const [timeRange, setTimeRange] = useState("12m");
  const [activeTab, setActiveTab] = useState<"mrr" | "churn" | "breakdown">("mrr");

  const timeRanges = ["3m", "6m", "12m", "YTD"];

  const slicedData = (arr: typeof mrrArrData) => {
    if (timeRange === "3m") return arr.slice(-3);
    if (timeRange === "6m") return arr.slice(-6);
    return arr;
  };

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-24">

        {/* ── Page Header ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
                  Revenue Intelligence
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                MRR, ARR & Churn Breakdown
              </h1>
              <p className="text-slate-400 mt-1.5 text-sm">
                Full-funnel revenue health — track recurring revenue, expansion, and churn signals in one view.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white text-xs font-medium transition-all"
              >
                <Calendar className="w-3.5 h-3.5" />
                Dec 2024
                <ChevronDown className="w-3 h-3" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white text-xs font-medium transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Export
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all shadow-lg shadow-indigo-500/20"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* ── KPI Cards ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8"
        >
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            const isPositive = kpi.invertChange ? kpi.change < 0 : kpi.change > 0;
            const changeAbs = Math.abs(kpi.change);
            return (
              <motion.div
                key={kpi.id}
                variants={scaleIn}
                whileHover={{ y: -3, scale: 1.01 }}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${kpi.gradient} border ${kpi.border} p-5 cursor-default`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl ${kpi.iconBg} flex items-center justify-center`}>
                    <Icon className={`w-4.5 h-4.5 ${kpi.iconColor}`} size={18} />
                  </div>
                  <span
                    className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
                      isPositive
                        ? "text-emerald-400 bg-emerald-500/10"
                        : "text-red-400 bg-red-500/10"
                    }`}
                  >
                    {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {changeAbs}%
                  </span>
                </div>
                <p className="text-2xl font-bold text-white mb-0.5">{kpi.value}</p>
                <p className="text-xs text-slate-400 font-medium">{kpi.label}</p>
                <p className="text-xs text-slate-600 mt-0.5">{kpi.sub}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Chart Tabs + Time Range ── */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4"
        >
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1 w-fit">
            {(["mrr", "churn", "breakdown"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  activeTab === tab
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab === "mrr" ? "MRR / ARR" : tab === "churn" ? "Churn Rates" : "MRR Breakdown"}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1 w-fit">
            {timeRanges.map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  timeRange === r
                    ? "bg-white/10 text-white"
                    : "text-slate-500 hover:text-white"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Main Chart ── */}
        <motion.div
          key={activeTab}
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="bg-[#12121F] border border-[#2D2D4E]/60 rounded-2xl p-6 mb-6"
        >
          {activeTab === "mrr" && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-semibold text-white">MRR & ARR Growth</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Monthly and annualized recurring revenue over time</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-indigo-500 rounded-full inline-block" />MRR</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-violet-500 rounded-full inline-block" />ARR</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={slicedData(mrrArrData)} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="arrGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D2D4E" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="mrr" name="MRR" stroke="#6366F1" strokeWidth={2.5} fill="url(#mrrGrad)" dot={false} activeDot={{ r: 5, fill: "#6366F1" }} />
                  <Area type="monotone" dataKey="arr" name="ARR" stroke="#8B5CF6" strokeWidth={2} fill="url(#arrGrad)" dot={false} activeDot={{ r: 5, fill: "#8B5CF6" }} />
                </AreaChart>
              </ResponsiveContainer>
            </>
          )}

          {activeTab === "churn" && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-semibold text-white">Churn Rate Trends</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Customer, revenue, and logo churn over time</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-red-500 rounded-full inline-block" />Customer Churn</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-amber-500 rounded-full inline-block" />Revenue Churn</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-cyan-500 rounded-full inline-block" />Logo Churn</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={slicedData(churnData)} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D2D4E" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="churnRate" name="Customer Churn Rate" stroke="#EF4444" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="revenueChurn" name="Revenue Churn Rate" stroke="#F59E0B" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="logoChurn" name="Logo Churn Rate" stroke="#06B6D4" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </>
          )}

          {activeTab === "breakdown" && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-semibold text-white">MRR Movement Breakdown</h2>
                  <p className="text-xs text-slate-500 mt-0.5">New, expansion, reactivation, and churned MRR stacked</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={slicedData(mrrArrData)} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D2D4E" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="newMRR" name="New MRR" stackId="a" fill="#6366F1" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="expansionMRR" name="Expansion MRR" stackId="a" fill="#8B5CF6" />
                  <Bar dataKey="churnedMRR" name="Churned MRR" stackId="b" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </>
          )}
        </motion.div>

        {/* ── Two-column: Pie + Plan Breakdown ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
          {/* Pie Chart */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="lg:col-span-2 bg-[#12121F] border border-[#2D2D4E]/60 rounded-2xl p-6"
          >
            <h2 className="text-base font-semibold text-white mb-1">Dec MRR Composition</h2>
            <p className="text-xs text-slate-500 mb-4">Where this month's MRR came from</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={mrrBreakdownPieDisplay}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {mrrBreakdownPieDisplay.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`$${(value ?? 0).toLocaleString()}`, ""]} contentStyle={{ background: "#1A1A2E", border: "1px solid #2D2D4E", borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {mrrBreakdownPie.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-400">{item.name}</span>
                  </span>
                  <span className={`font-semibold ${item.value < 0 ? "text-red-400" : "text-white"}`}>
                    {item.value < 0 ? "-" : "+"}${Math.abs(item.value ?? 0).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Plan Breakdown Table */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="lg:col-span-3 bg-[#12121F] border border-[#2D2D4E]/60 rounded-2xl p-6"
          >
            <h2 className="text-base font-semibold text-white mb-1">Revenue by Plan</h2>
            <p className="text-xs text-slate-500 mb-4">MRR, ARR, and churn rate per pricing tier</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#2D2D4E]">
                    <th className="text-left text-slate-500 font-medium pb-2.5 pr-4">Plan</th>
                    <th className="text-right text-slate-500 font-medium pb-2.5 pr-4">Customers</th>
                    <th className="text-right text-slate-500 font-medium pb-2.5 pr-4">MRR</th>
                    <th className="text-right text-slate-500 font-medium pb-2.5 pr-4">ARR</th>
                    <th className="text-right text-slate-500 font-medium pb-2.5">Churn</th>
                  </tr>
                </thead>
                <tbody>
                  {planBreakdown.map((row, i) => (
                    <motion.tr
                      key={row.plan}
                      initial={{ opacity: 0, x: 12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07 }}
                      className="border-b border-[#2D2D4E]/40 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-3 pr-4">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: row.color }} />
                          <span className="text-white font-medium">{row.plan}</span>
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-right text-slate-300">{(row.customers ?? 0).toLocaleString()}</td>
                      <td className="py-3 pr-4 text-right text-white font-semibold">${(row.mrr ?? 0).toLocaleString()}</td>
                      <td className="py-3 pr-4 text-right text-slate-300">${(row.arr ?? 0).toLocaleString()}</td>
                      <td className="py-3 text-right">
                        <span className={`font-semibold ${row.churn > 5 ? "text-red-400" : row.churn > 3 ? "text-amber-400" : "text-emerald-400"}`}>
                          {(row.churn ?? 0).toFixed(1)}%
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* ── Churned Accounts + At-Risk ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Churned Accounts */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="bg-[#12121F] border border-[#2D2D4E]/60 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-white">Recent Churned Accounts</h2>
                <p className="text-xs text-slate-500 mt-0.5">Customers lost in December 2024</p>
              </div>
              <span className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full font-semibold">
                −$1,860 MRR
              </span>
            </div>
            <div className="space-y-2">
              {churnedAccounts.map((acct, i) => (
                <motion.div
                  key={acct.id}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ x: 3 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all cursor-default"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                      <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{acct.company}</p>
                      <p className="text-xs text-slate-500">{acct.plan} · {acct.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                    <span className="text-xs font-semibold text-red-400">−${(acct.mrr ?? 0).toLocaleString()}</span>
                    <span className="text-xs text-slate-600">{acct.date}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${
                      acct.risk === "high" ? "bg-red-500/10 text-red-400" :
                      acct.risk === "medium" ? "bg-amber-500/10 text-amber-400" :
                      "bg-slate-500/10 text-slate-400"
                    }`}>
                      {acct.risk}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* At-Risk Accounts */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="bg-[#12121F] border border-[#2D2D4E]/60 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-white">At-Risk Accounts</h2>
                <p className="text-xs text-slate-500 mt-0.5">Accounts with low health scores requiring attention</p>
              </div>
              <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full font-semibold">
                $3,060 at risk
              </span>
            </div>
            <div className="space-y-2">
              {atRiskAccounts.map((acct, i) => (
                <motion.div
                  key={acct.id}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ x: 3 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-amber-500/10 hover:border-opacity-100 transition-all cursor-default"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{acct.company}</p>
                      <p className="text-xs text-slate-500">{acct.plan} · {acct.signal}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                    <div className="text-right">
                      <p className="text-xs font-semibold text-white">${(acct.mrr ?? 0).toLocaleString()}<span className="text-slate-500 font-normal">/mo</span></p>
                      <p className="text-xs text-slate-600">{acct.lastLogin}</p>
                    </div>
                    <div className="w-10 text-center">
                      <span className={`text-xs font-bold ${
                        acct.healthScore < 35 ? "text-red-400" :
                        acct.healthScore < 50 ? "text-amber-400" :
                        "text-yellow-300"
                      }`}>
                        {acct.healthScore}
                      </span>
                      <p className="text-xs text-slate-600 leading-none">health</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full mt-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold hover:bg-amber-500/20 transition-all"
            >
              View All At-Risk Accounts →
            </motion.button>
          </motion.div>
        </div>

        {/* ── Bottom Summary Banner ── */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="rounded-2xl bg-gradient-to-r from-indigo-600/20 via-violet-600/10 to-cyan-600/10 border border-indigo-500/20 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
              <Activity className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Revenue Health Score: <span className="text-indigo-400">84 / 100</span></p>
              <p className="text-xs text-slate-400 mt-0.5">
                MRR grew 7% MoM. Churn dropped to 2.8% — lowest in 12 months. Net Revenue Retention is <span className="text-emerald-400 font-semibold">112%</span>.
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex-shrink-0 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 transition-all"
          >
            View Full Report
          </motion.button>
        </motion.div>

      </div>
    </div>
  );
}