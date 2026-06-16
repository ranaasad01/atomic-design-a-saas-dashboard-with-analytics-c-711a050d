"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
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
import { TrendingUp, TrendingDown, DollarSign, Users, ArrowUpRight, ArrowDownRight, Star, Activity, ChevronUp, ChevronDown } from 'lucide-react';
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";
import { BRAND_COLORS, CHART_COLORS } from "@/lib/data";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mrrTrendData = [
  { month: "Jan", mrr: 28400, arr: 340800 },
  { month: "Feb", mrr: 31200, arr: 374400 },
  { month: "Mar", mrr: 33800, arr: 405600 },
  { month: "Apr", mrr: 36100, arr: 433200 },
  { month: "May", mrr: 39500, arr: 474000 },
  { month: "Jun", mrr: 42300, arr: 507600 },
  { month: "Jul", mrr: 45800, arr: 549600 },
  { month: "Aug", mrr: 48200, arr: 578400 },
  { month: "Sep", mrr: 51600, arr: 619200 },
  { month: "Oct", mrr: 54900, arr: 658800 },
  { month: "Nov", mrr: 58300, arr: 699600 },
  { month: "Dec", mrr: 62100, arr: 745200 },
];

const revenueByPlanData = [
  { plan: "Basic", revenue: 12400, accounts: 310, avgRevenue: 40 },
  { plan: "Pro", revenue: 28600, accounts: 143, avgRevenue: 200 },
  { plan: "Enterprise", revenue: 21100, accounts: 21, avgRevenue: 1005 },
];

const churnData = [
  { name: "Retained Revenue", value: 58300, color: CHART_COLORS[0] },
  { name: "Churned Revenue", value: 3800, color: CHART_COLORS[5] },
  { name: "Expansion Revenue", value: 6200, color: CHART_COLORS[2] },
];

const topAccounts = [
  {
    id: "acc-001",
    customer: "Acme Corporation",
    plan: "Enterprise",
    mrr: 4200,
    arr: 50400,
    status: "Active",
    growth: 12.4,
    since: "Jan 2022",
  },
  {
    id: "acc-002",
    customer: "Globex Industries",
    plan: "Enterprise",
    mrr: 3800,
    arr: 45600,
    status: "Active",
    growth: 8.1,
    since: "Mar 2022",
  },
  {
    id: "acc-003",
    customer: "Initech Solutions",
    plan: "Enterprise",
    mrr: 3200,
    arr: 38400,
    status: "Active",
    growth: -2.3,
    since: "Jun 2022",
  },
  {
    id: "acc-004",
    customer: "Umbrella Tech",
    plan: "Pro",
    mrr: 1800,
    arr: 21600,
    status: "Active",
    growth: 22.7,
    since: "Sep 2022",
  },
  {
    id: "acc-005",
    customer: "Stark Dynamics",
    plan: "Enterprise",
    mrr: 2900,
    arr: 34800,
    status: "At Risk",
    growth: -5.8,
    since: "Feb 2022",
  },
  {
    id: "acc-006",
    customer: "Wayne Enterprises",
    plan: "Pro",
    mrr: 1400,
    arr: 16800,
    status: "Active",
    growth: 14.2,
    since: "Nov 2022",
  },
  {
    id: "acc-007",
    customer: "Pied Piper Inc",
    plan: "Pro",
    mrr: 1200,
    arr: 14400,
    status: "Active",
    growth: 31.5,
    since: "Jan 2023",
  },
  {
    id: "acc-008",
    customer: "Hooli Cloud",
    plan: "Enterprise",
    mrr: 2600,
    arr: 31200,
    status: "Active",
    growth: 6.9,
    since: "Apr 2022",
  },
];

const kpiCards = [
  {
    id: "mrr",
    label: "Monthly Recurring Revenue",
    value: 62100,
    prefix: "$",
    change: 6.5,
    changeLabel: "vs last month",
    icon: DollarSign,
    color: "from-indigo-500 to-violet-600",
    glow: "shadow-indigo-500/20",
  },
  {
    id: "arr",
    label: "Annual Recurring Revenue",
    value: 745200,
    prefix: "$",
    change: 18.3,
    changeLabel: "vs last year",
    icon: TrendingUp,
    color: "from-violet-500 to-purple-600",
    glow: "shadow-violet-500/20",
  },
  {
    id: "accounts",
    label: "Paying Accounts",
    value: 474,
    prefix: "",
    change: 4.2,
    changeLabel: "vs last month",
    icon: Users,
    color: "from-cyan-500 to-blue-600",
    glow: "shadow-cyan-500/20",
  },
  {
    id: "churn",
    label: "Revenue Churn Rate",
    value: 6.1,
    prefix: "",
    suffix: "%",
    change: -0.4,
    changeLabel: "vs last month",
    icon: Activity,
    color: "from-emerald-500 to-teal-600",
    glow: "shadow-emerald-500/20",
  },
];

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-[#1E1E2E]/95 backdrop-blur-xl border border-[#2D2D4E] rounded-xl p-3 shadow-2xl">
      {label && <p className="text-xs text-slate-400 mb-2 font-medium">{label}</p>}
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-slate-300 capitalize">{entry.name}:</span>
          <span className="text-white font-semibold">
            {typeof entry.value === "number" && entry.value > 1000
              ? `$${(entry.value / 1000).toFixed(1)}k`
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Donut Center Label ───────────────────────────────────────────────────────

const DonutLabel = ({
  cx,
  cy,
  total,
}: {
  cx?: number;
  cy?: number;
  total: number;
}) => {
  const x = cx ?? 0;
  const y = cy ?? 0;
  return (
    <g>
      <text x={x} y={y - 10} textAnchor="middle" fill="#94A3B8" fontSize={12}>
        Total
      </text>
      <text x={x} y={y + 14} textAnchor="middle" fill="#FFFFFF" fontSize={20} fontWeight={700}>
        ${(total / 1000).toFixed(1)}k
      </text>
    </g>
  );
};

// ─── Plan Badge ───────────────────────────────────────────────────────────────

const PlanBadge = ({ plan }: { plan: string }) => {
  const styles: Record<string, string> = {
    Basic: "bg-slate-500/20 text-slate-300 border-slate-500/30",
    Pro: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    Enterprise: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${
        styles[plan] ?? "bg-slate-500/20 text-slate-300 border-slate-500/30"
      }`}
    >
      {plan}
    </span>
  );
};

// ─── Status Badge ─────────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Active: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    "At Risk": "bg-amber-500/20 text-amber-300 border-amber-500/30",
    Churned: "bg-red-500/20 text-red-300 border-red-500/30",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${
        styles[status] ?? "bg-slate-500/20 text-slate-300 border-slate-500/30"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === "Active"
            ? "bg-emerald-400"
            : status === "At Risk"
            ? "bg-amber-400"
            : "bg-red-400"
        }`}
      />
      {status}
    </span>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function RevenuePage() {
  const [sortField, setSortField] = useState<"mrr" | "arr" | "growth">("mrr");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [planFilter, setPlanFilter] = useState<string>("All");

  const handleSort = (field: "mrr" | "arr" | "growth") => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const filteredAccounts = (topAccounts ?? [])
    .filter((a) => planFilter === "All" || a.plan === planFilter)
    .sort((a, b) => {
      const aVal = a[sortField] ?? 0;
      const bVal = b[sortField] ?? 0;
      return sortDir === "desc" ? bVal - aVal : aVal - bVal;
    });

  const totalChurn = churnData.reduce((s, d) => s + (d.value ?? 0), 0);

  return (
    <main className="min-h-screen bg-[#0A0A14] text-white pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Page Header ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mb-10"
        >
          <motion.div variants={fadeInUp} className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
              <Star className="w-3 h-3" />
              Revenue Intelligence
            </span>
          </motion.div>
          <motion.h1
            variants={fadeInUp}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2"
          >
            Revenue Overview
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-slate-400 text-base max-w-2xl">
            Track MRR, ARR, plan-level performance, and your highest-value accounts in one unified
            view.
          </motion.p>
        </motion.div>

        {/* ── KPI Cards ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8"
        >
          {kpiCards.map((card) => {
            const Icon = card.icon;
            const isNegativeGood = card.id === "churn";
            const positive = isNegativeGood ? card.change < 0 : card.change > 0;
            const displayValue =
              card.id === "churn"
                ? `${(card.value ?? 0).toFixed(1)}${card.suffix ?? ""}`
                : card.value >= 1000
                ? `${card.prefix ?? ""}${((card.value ?? 0) / 1000).toFixed(1)}k`
                : `${card.prefix ?? ""}${(card.value ?? 0).toLocaleString()}`;

            return (
              <motion.div
                key={card.id}
                variants={scaleIn}
                whileHover={{ y: -4, scale: 1.02 }}
                className={`relative overflow-hidden rounded-2xl bg-[#16162A]/80 border border-[#2D2D4E]/60 p-5 shadow-xl ${card.glow}`}
              >
                {/* Glow blob */}
                <div
                  className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${card.color} opacity-10 blur-2xl`}
                />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${
                        positive
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-red-500/15 text-red-400"
                      }`}
                    >
                      {positive ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      {Math.abs(card.change)}%
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-white mb-1">{displayValue}</p>
                  <p className="text-xs text-slate-400 font-medium">{card.label}</p>
                  <p className="text-xs text-slate-600 mt-0.5">{card.changeLabel}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── MRR Trend Line Chart ── */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="rounded-2xl bg-[#16162A]/80 border border-[#2D2D4E]/60 p-6 mb-6 shadow-xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white">MRR &amp; ARR Trend</h2>
              <p className="text-sm text-slate-400 mt-0.5">12-month recurring revenue trajectory</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 rounded bg-indigo-400 inline-block" />
                MRR
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 rounded bg-violet-400 inline-block" />
                ARR
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={mrrTrendData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
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
                tick={{ fill: "#64748B", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                width={52}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="mrr"
                stroke="#6366F1"
                strokeWidth={2.5}
                dot={{ fill: "#6366F1", r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#6366F1", stroke: "#fff", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="arr"
                stroke="#8B5CF6"
                strokeWidth={2}
                strokeDasharray="6 3"
                dot={false}
                activeDot={{ r: 5, fill: "#8B5CF6", stroke: "#fff", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* ── Bar + Donut Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">

          {/* Bar Chart — Revenue by Plan */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="lg:col-span-3 rounded-2xl bg-[#16162A]/80 border border-[#2D2D4E]/60 p-6 shadow-xl"
          >
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white">Revenue by Plan Tier</h2>
              <p className="text-sm text-slate-400 mt-0.5">
                Monthly revenue contribution per subscription plan
              </p>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={revenueByPlanData}
                margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
                barCategoryGap="35%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#2D2D4E" vertical={false} />
                <XAxis
                  dataKey="plan"
                  tick={{ fill: "#64748B", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#64748B", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  width={48}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                  {revenueByPlanData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Plan summary pills */}
            <div className="flex flex-wrap gap-3 mt-4">
              {revenueByPlanData.map((p, i) => (
                <div
                  key={p.plan}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                  />
                  <span className="text-xs text-slate-300 font-medium">{p.plan}</span>
                  <span className="text-xs text-slate-500">{p.accounts} accts</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Donut Chart — Churn vs Retained */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="lg:col-span-2 rounded-2xl bg-[#16162A]/80 border border-[#2D2D4E]/60 p-6 shadow-xl"
          >
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-white">Revenue Composition</h2>
              <p className="text-sm text-slate-400 mt-0.5">Retained vs churned vs expansion</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={churnData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={88}
                  paddingAngle={3}
                  dataKey="value"
                  labelLine={false}
                >
                  {churnData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                  ))}
                  <DonutLabel total={totalChurn} />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="space-y-2 mt-2">
              {churnData.map((d) => {
                const pct = totalChurn > 0 ? ((d.value / totalChurn) * 100).toFixed(1) : "0.0";
                return (
                  <div key={d.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: d.color }}
                      />
                      <span className="text-xs text-slate-400">{d.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white font-semibold">
                        ${(d.value / 1000).toFixed(1)}k
                      </span>
                      <span className="text-xs text-slate-600">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* ── Top Revenue Accounts Table ── */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="rounded-2xl bg-[#16162A]/80 border border-[#2D2D4E]/60 shadow-xl overflow-hidden"
        >
          {/* Table Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 border-b border-[#2D2D4E]/60">
            <div>
              <h2 className="text-lg font-semibold text-white">Top Revenue Accounts</h2>
              <p className="text-sm text-slate-400 mt-0.5">
                Highest-value customers ranked by MRR
              </p>
            </div>
            {/* Plan Filter */}
            <div className="flex items-center gap-2">
              {["All", "Basic", "Pro", "Enterprise"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPlanFilter(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    planFilter === p
                      ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                      : "text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2D2D4E]/40">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th
                    className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-300 transition-colors select-none"
                    onClick={() => handleSort("mrr")}
                  >
                    <span className="inline-flex items-center gap-1 justify-end">
                      MRR
                      {sortField === "mrr" ? (
                        sortDir === "desc" ? (
                          <ChevronDown className="w-3 h-3" />
                        ) : (
                          <ChevronUp className="w-3 h-3" />
                        )
                      ) : (
                        <ChevronDown className="w-3 h-3 opacity-30" />
                      )}
                    </span>
                  </th>
                  <th
                    className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-300 transition-colors select-none"
                    onClick={() => handleSort("arr")}
                  >
                    <span className="inline-flex items-center gap-1 justify-end">
                      ARR
                      {sortField === "arr" ? (
                        sortDir === "desc" ? (
                          <ChevronDown className="w-3 h-3" />
                        ) : (
                          <ChevronUp className="w-3 h-3" />
                        )
                      ) : (
                        <ChevronDown className="w-3 h-3 opacity-30" />
                      )}
                    </span>
                  </th>
                  <th
                    className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-300 transition-colors select-none"
                    onClick={() => handleSort("growth")}
                  >
                    <span className="inline-flex items-center gap-1 justify-end">
                      Growth
                      {sortField === "growth" ? (
                        sortDir === "desc" ? (
                          <ChevronDown className="w-3 h-3" />
                        ) : (
                          <ChevronUp className="w-3 h-3" />
                        )
                      ) : (
                        <ChevronDown className="w-3 h-3 opacity-30" />
                      )}
                    </span>
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Since
                  </th>
                </tr>
              </thead>
              <tbody>
                {(filteredAccounts ?? []).map((account, idx) => (
                  <motion.tr
                    key={account.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04, duration: 0.3 }}
                    whileHover={{ backgroundColor: "rgba(99,102,241,0.04)" }}
                    className="border-b border-[#2D2D4E]/30 last:border-0 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/30 to-violet-500/30 border border-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-300 flex-shrink-0">
                          {(account.customer ?? "?").charAt(0)}
                        </div>
                        <span className="font-medium text-white text-sm">
                          {account.customer}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <PlanBadge plan={account.plan} />
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={account.status} />
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="font-semibold text-white">
                        ${(account.mrr ?? 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="text-slate-300">
                        ${((account.arr ?? 0) / 1000).toFixed(1)}k
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold ${
                          (account.growth ?? 0) >= 0 ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {(account.growth ?? 0) >= 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {Math.abs(account.growth ?? 0).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-500 text-xs">
                      {account.since}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {filteredAccounts.length === 0 && (
              <div className="py-16 text-center text-slate-500 text-sm">
                No accounts match the selected filter.
              </div>
            )}
          </div>

          {/* Table Footer */}
          <div className="px-6 py-4 border-t border-[#2D2D4E]/40 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Showing {filteredAccounts.length} of {topAccounts.length} accounts
            </p>
            <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
              Export CSV →
            </button>
          </div>
        </motion.div>

      </div>
    </main>
  );
}