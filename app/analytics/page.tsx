"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Activity, TrendingUp, TrendingDown, Users, DollarSign, ArrowUpRight, ArrowDownRight, Filter, ChevronDown } from 'lucide-react';
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";
import { BRAND_COLORS, CHART_COLORS } from "@/lib/data";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const monthlyData = [
  { month: "Jan", current: 38200, previous: 29100, mrr: 12400, prevMrr: 9800 },
  { month: "Feb", current: 41500, previous: 31400, mrr: 13100, prevMrr: 10200 },
  { month: "Mar", current: 39800, previous: 33700, mrr: 13900, prevMrr: 11100 },
  { month: "Apr", current: 47200, previous: 35200, mrr: 15200, prevMrr: 11800 },
  { month: "May", current: 52100, previous: 37800, mrr: 16800, prevMrr: 12400 },
  { month: "Jun", current: 49600, previous: 40100, mrr: 17400, prevMrr: 13200 },
  { month: "Jul", current: 58300, previous: 42500, mrr: 19100, prevMrr: 14100 },
  { month: "Aug", current: 63100, previous: 44900, mrr: 20600, prevMrr: 14900 },
  { month: "Sep", current: 61400, previous: 47200, mrr: 21200, prevMrr: 15700 },
  { month: "Oct", current: 71800, previous: 49600, mrr: 23400, prevMrr: 16500 },
  { month: "Nov", current: 78200, previous: 52100, mrr: 25600, prevMrr: 17300 },
  { month: "Dec", current: 84500, previous: 55400, mrr: 27800, prevMrr: 18400 },
];

const quarterlyData = [
  { month: "Q1", current: 119500, previous: 94200, mrr: 39400, prevMrr: 31100 },
  { month: "Q2", current: 148900, previous: 113100, mrr: 49400, prevMrr: 37400 },
  { month: "Q3", current: 182800, previous: 134600, mrr: 60900, prevMrr: 44700 },
  { month: "Q4", current: 234500, previous: 157100, mrr: 76800, prevMrr: 52200 },
];

const channelData = [
  { channel: "Organic", enterprise: 28400, pro: 19200, starter: 8700 },
  { channel: "Paid Search", enterprise: 21600, pro: 14800, starter: 6200 },
  { channel: "Social", enterprise: 14200, pro: 11400, starter: 9800 },
  { channel: "Referral", enterprise: 18900, pro: 12600, starter: 4100 },
  { channel: "Email", enterprise: 11400, pro: 8900, starter: 3600 },
  { channel: "Direct", enterprise: 9800, pro: 7200, starter: 2900 },
];

const summaryStats = [
  {
    id: "revenue",
    label: "Total Revenue",
    value: 684700,
    prev: 556200,
    prefix: "$",
    icon: DollarSign,
    color: "indigo",
  },
  {
    id: "mrr",
    label: "Monthly Recurring",
    value: 27800,
    prev: 18400,
    prefix: "$",
    icon: TrendingUp,
    color: "violet",
  },
  {
    id: "users",
    label: "Active Users",
    value: 24381,
    prev: 19204,
    prefix: "",
    icon: Users,
    color: "cyan",
  },
  {
    id: "sessions",
    label: "Avg. Session Value",
    value: 28.07,
    prev: 22.41,
    prefix: "$",
    icon: Activity,
    color: "emerald",
  },
];

const topChannelRows = [
  { channel: "Organic Search", sessions: 142800, conversion: 3.8, revenue: 54200, change: 12.4 },
  { channel: "Paid Search", sessions: 98400, conversion: 4.2, revenue: 41300, change: 8.7 },
  { channel: "Social Media", sessions: 76200, conversion: 2.9, revenue: 22100, change: -3.2 },
  { channel: "Email Campaigns", sessions: 54100, conversion: 5.6, revenue: 30200, change: 18.9 },
  { channel: "Referral Partners", sessions: 41600, conversion: 6.1, revenue: 25400, change: 22.1 },
  { channel: "Direct Traffic", sessions: 38900, conversion: 3.1, revenue: 12100, change: -1.4 },
];

// ─── Types ────────────────────────────────────────────────────────────────────

type Period = "monthly" | "quarterly";
type Metric = "revenue" | "mrr";

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  stat,
  index,
}: {
  stat: (typeof summaryStats)[number];
  index: number;
}) {
  const Icon = stat.icon;
  const change = stat.prev > 0 ? ((stat.value - stat.prev) / stat.prev) * 100 : 0;
  const isPositive = change >= 0;

  const colorMap: Record<string, string> = {
    indigo: "from-indigo-500/20 to-indigo-600/5 border-indigo-500/20 shadow-indigo-500/10",
    violet: "from-violet-500/20 to-violet-600/5 border-violet-500/20 shadow-violet-500/10",
    cyan: "from-cyan-500/20 to-cyan-600/5 border-cyan-500/20 shadow-cyan-500/10",
    emerald: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/20 shadow-emerald-500/10",
  };
  const iconColorMap: Record<string, string> = {
    indigo: "bg-indigo-500/20 text-indigo-400",
    violet: "bg-violet-500/20 text-violet-400",
    cyan: "bg-cyan-500/20 text-cyan-400",
    emerald: "bg-emerald-500/20 text-emerald-400",
  };

  const cardClass = colorMap[stat.color] ?? colorMap["indigo"];
  const iconClass = iconColorMap[stat.color] ?? iconColorMap["indigo"];

  const displayValue =
    stat.id === "sessions"
      ? `${stat.prefix}${(stat.value ?? 0).toFixed(2)}`
      : `${stat.prefix}${(stat.value ?? 0).toLocaleString()}`;

  return (
    <motion.div
      variants={fadeInUp}
      custom={index}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`relative rounded-2xl border bg-gradient-to-br p-5 shadow-lg ${cardClass}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span
          className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
            isPositive
              ? "bg-emerald-500/15 text-emerald-400"
              : "bg-red-500/15 text-red-400"
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownRight className="w-3 h-3" />
          )}
          {Math.abs(change).toFixed(1)}%
        </span>
      </div>
      <p className="text-2xl font-bold text-white mb-1">{displayValue}</p>
      <p className="text-xs text-slate-400">{stat.label}</p>
    </motion.div>
  );
}

function SelectDropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <label className="sr-only">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-[#1A1A2E] border border-[#2D2D4E] text-slate-300 text-sm rounded-xl px-4 py-2.5 pr-9 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 cursor-pointer transition-all hover:border-indigo-500/40"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
      </div>
    </div>
  );
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) => {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl p-3 shadow-xl">
      <p className="text-xs text-slate-400 mb-2 font-medium">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-sm">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-slate-300 capitalize">{entry.name}:</span>
          <span className="text-white font-semibold">
            ${(entry.value ?? 0).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

const BarTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) => {
  if (!active || !payload || payload.length === 0) return null;
  const total = payload.reduce((sum, p) => sum + (p.value ?? 0), 0);
  return (
    <div className="bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl p-3 shadow-xl min-w-[160px]">
      <p className="text-xs text-slate-400 mb-2 font-medium">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-4 text-sm mb-1">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate-300 capitalize">{entry.name}</span>
          </div>
          <span className="text-white font-semibold">${(entry.value ?? 0).toLocaleString()}</span>
        </div>
      ))}
      <div className="border-t border-[#2D2D4E] mt-2 pt-2 flex justify-between text-sm">
        <span className="text-slate-400">Total</span>
        <span className="text-white font-bold">${total.toLocaleString()}</span>
      </div>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("monthly");
  const [metric, setMetric] = useState<Metric>("revenue");

  const chartData = period === "monthly" ? monthlyData : quarterlyData;

  const currentKey = metric === "revenue" ? "current" : "mrr";
  const previousKey = metric === "revenue" ? "previous" : "prevMrr";

  const periodOptions = [
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
  ];

  const metricOptions = [
    { value: "revenue", label: "Total Revenue" },
    { value: "mrr", label: "MRR" },
  ];

  return (
    <main className="min-h-screen bg-[#0A0A14] pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Page Header ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <motion.div variants={fadeInUp} className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
              <Activity className="w-3 h-3" />
              Live Analytics
            </span>
          </motion.div>
          <motion.h1
            variants={fadeInUp}
            className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight"
          >
            Analytics{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Deep-Dive
            </span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-slate-400 text-base max-w-xl">
            Compare performance across periods, channels, and segments. Filter by metric and time range to surface actionable insights.
          </motion.p>
        </motion.div>

        {/* ── Filter Controls ── */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap items-center gap-3 mb-8 p-4 rounded-2xl bg-[#12121F] border border-[#2D2D4E]/60"
        >
          <div className="flex items-center gap-2 text-slate-400 text-sm mr-2">
            <Filter className="w-4 h-4" />
            <span className="font-medium">Filters</span>
          </div>
          <SelectDropdown
            label="Period"
            value={period}
            options={periodOptions}
            onChange={(v) => setPeriod(v as Period)}
          />
          <SelectDropdown
            label="Metric"
            value={metric}
            options={metricOptions}
            onChange={(v) => setMetric(v as Metric)}
          />
          <div className="ml-auto text-xs text-slate-500">
            Showing data for <span className="text-slate-300 font-medium">FY 2024</span>
          </div>
        </motion.div>

        {/* ── Summary Stat Cards ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {summaryStats.map((stat, i) => (
            <StatCard key={stat.id} stat={stat} index={i} />
          ))}
        </motion.div>

        {/* ── Multi-Series Line Chart ── */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="rounded-2xl bg-[#12121F] border border-[#2D2D4E]/60 p-6 mb-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">
                {metric === "revenue" ? "Revenue" : "MRR"} — Current vs Previous Period
              </h2>
              <p className="text-sm text-slate-400">
                {period === "monthly" ? "Month-by-month" : "Quarter-by-quarter"} comparison for FY 2024 vs FY 2023
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-6 h-0.5 bg-indigo-400 rounded inline-block" />
                Current Period
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-6 h-0.5 bg-violet-400/50 rounded inline-block border-dashed" />
                Previous Period
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
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
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                width={52}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey={currentKey}
                name="Current"
                stroke={CHART_COLORS[0]}
                strokeWidth={2.5}
                dot={{ r: 4, fill: CHART_COLORS[0], strokeWidth: 0 }}
                activeDot={{ r: 6, fill: CHART_COLORS[0], strokeWidth: 2, stroke: "#1A1A2E" }}
              />
              <Line
                type="monotone"
                dataKey={previousKey}
                name="Previous"
                stroke={CHART_COLORS[1]}
                strokeWidth={2}
                strokeDasharray="5 4"
                dot={{ r: 3, fill: CHART_COLORS[1], strokeWidth: 0 }}
                activeDot={{ r: 5, fill: CHART_COLORS[1], strokeWidth: 2, stroke: "#1A1A2E" }}
                opacity={0.65}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* ── Stacked Bar Chart ── */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="rounded-2xl bg-[#12121F] border border-[#2D2D4E]/60 p-6 mb-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">Channel Performance by Plan Tier</h2>
              <p className="text-sm text-slate-400">
                Revenue breakdown across acquisition channels — Enterprise, Pro, and Starter tiers
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              {[
                { label: "Enterprise", color: CHART_COLORS[0] },
                { label: "Pro", color: CHART_COLORS[2] },
                { label: "Starter", color: CHART_COLORS[3] },
              ].map((item) => (
                <span key={item.label} className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-sm inline-block"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.label}
                </span>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={channelData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D2D4E" vertical={false} />
              <XAxis
                dataKey="channel"
                tick={{ fill: "#64748B", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#64748B", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                width={52}
              />
              <Tooltip content={<BarTooltip />} />
              <Bar dataKey="enterprise" name="Enterprise" stackId="a" fill={CHART_COLORS[0]} radius={[0, 0, 0, 0]} />
              <Bar dataKey="pro" name="Pro" stackId="a" fill={CHART_COLORS[2]} />
              <Bar dataKey="starter" name="Starter" stackId="a" fill={CHART_COLORS[3]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* ── Channel Summary Table ── */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="rounded-2xl bg-[#12121F] border border-[#2D2D4E]/60 overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-[#2D2D4E]/60">
            <h2 className="text-lg font-semibold text-white mb-1">Channel Summary</h2>
            <p className="text-sm text-slate-400">Sessions, conversion rates, and revenue by acquisition channel</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2D2D4E]/40">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Channel</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Sessions</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Conv. Rate</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Revenue</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">vs Prior</th>
                </tr>
              </thead>
              <tbody>
                {(topChannelRows ?? []).map((row, i) => {
                  const isPositive = (row.change ?? 0) >= 0;
                  return (
                    <motion.tr
                      key={row.channel}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06, duration: 0.35, ease: "easeOut" }}
                      className="border-b border-[#2D2D4E]/30 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                          />
                          <span className="text-slate-200 font-medium">{row.channel}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-300">
                        {(row.sessions ?? 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-slate-300">{(row.conversion ?? 0).toFixed(1)}%</span>
                      </td>
                      <td className="px-6 py-4 text-right text-white font-semibold">
                        ${(row.revenue ?? 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                            isPositive
                              ? "bg-emerald-500/15 text-emerald-400"
                              : "bg-red-500/15 text-red-400"
                          }`}
                        >
                          {isPositive ? (
                            <ArrowUpRight className="w-3 h-3" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3" />
                          )}
                          {Math.abs(row.change ?? 0).toFixed(1)}%
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-[#0F0F1A]/50 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Showing all 6 channels · FY 2024 · Updated just now
            </p>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
            >
              Export CSV
              <ArrowUpRight className="w-3 h-3" />
            </motion.button>
          </div>
        </motion.div>

      </div>
    </main>
  );
}