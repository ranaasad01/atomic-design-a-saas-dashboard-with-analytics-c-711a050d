"use client";

import { useState, useMemo } from "react";
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
import { Activity, TrendingUp, TrendingDown, Users, DollarSign, ArrowUpRight, ArrowDownRight, Filter, Download, RefreshCw, Calendar, ChevronDown, BarChart2, PieChart as PieChartIcon, Layers, Eye, AlertCircle } from 'lucide-react';
import { BRAND_COLORS, CHART_COLORS } from "@/lib/data";
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const monthlyData = [
  { month: "Jan", revenue: 42000, mrr: 38000, users: 1200, activeUsers: 980, churn: 2.1, sessions: 14200, conversion: 3.2 },
  { month: "Feb", revenue: 47500, mrr: 41000, users: 1380, activeUsers: 1100, churn: 1.9, sessions: 16800, conversion: 3.5 },
  { month: "Mar", revenue: 51200, mrr: 44500, users: 1520, activeUsers: 1240, churn: 1.7, sessions: 18400, conversion: 3.8 },
  { month: "Apr", revenue: 49800, mrr: 43200, users: 1610, activeUsers: 1290, churn: 2.0, sessions: 17900, conversion: 3.6 },
  { month: "May", revenue: 58300, mrr: 50100, users: 1820, activeUsers: 1480, churn: 1.5, sessions: 21300, conversion: 4.1 },
  { month: "Jun", revenue: 63100, mrr: 54800, users: 2010, activeUsers: 1650, churn: 1.4, sessions: 23700, conversion: 4.4 },
  { month: "Jul", revenue: 67400, mrr: 58200, users: 2180, activeUsers: 1790, churn: 1.3, sessions: 25100, conversion: 4.6 },
  { month: "Aug", revenue: 72800, mrr: 62500, users: 2340, activeUsers: 1920, churn: 1.2, sessions: 27400, conversion: 4.9 },
  { month: "Sep", revenue: 69200, mrr: 59800, users: 2290, activeUsers: 1870, churn: 1.6, sessions: 26200, conversion: 4.7 },
  { month: "Oct", revenue: 78500, mrr: 67300, users: 2510, activeUsers: 2060, churn: 1.1, sessions: 29800, conversion: 5.2 },
  { month: "Nov", revenue: 84200, mrr: 72100, users: 2720, activeUsers: 2230, churn: 1.0, sessions: 32100, conversion: 5.5 },
  { month: "Dec", revenue: 91600, mrr: 78400, users: 2940, activeUsers: 2410, churn: 0.9, sessions: 35600, conversion: 5.8 },
];

const channelData = [
  { name: "Organic Search", value: 38, color: "#6366F1" },
  { name: "Direct", value: 24, color: "#8B5CF6" },
  { name: "Paid Ads", value: 18, color: "#06B6D4" },
  { name: "Referral", value: 12, color: "#10B981" },
  { name: "Social", value: 8, color: "#F59E0B" },
];

const cohortData = [
  { cohort: "Jan", m0: 100, m1: 72, m2: 61, m3: 55, m4: 51, m5: 48 },
  { cohort: "Feb", m0: 100, m1: 75, m2: 64, m3: 58, m4: 53, m5: 50 },
  { cohort: "Mar", m0: 100, m1: 78, m2: 67, m3: 61, m4: 57, m5: null },
  { cohort: "Apr", m0: 100, m1: 74, m2: 63, m3: 57, m4: null, m5: null },
  { cohort: "May", m0: 100, m1: 80, m2: 69, m3: null, m4: null, m5: null },
  { cohort: "Jun", m0: 100, m1: 82, m2: null, m3: null, m4: null, m5: null },
];

const topPages = [
  { page: "/dashboard", views: 48200, bounce: "24%", avgTime: "4m 12s", trend: 12 },
  { page: "/analytics", views: 31500, bounce: "31%", avgTime: "6m 48s", trend: 8 },
  { page: "/revenue", views: 24800, bounce: "28%", avgTime: "5m 22s", trend: 15 },
  { page: "/users", views: 19300, bounce: "35%", avgTime: "3m 55s", trend: -3 },
  { page: "/settings", views: 12100, bounce: "42%", avgTime: "2m 30s", trend: -7 },
  { page: "/reports", views: 9800, bounce: "38%", avgTime: "4m 10s", trend: 21 },
];

const kpiCards = [
  { id: "revenue", label: "Total Revenue", value: "$748.6k", change: 18.4, icon: DollarSign, color: "indigo" },
  { id: "users", label: "Total Users", value: "2,940", change: 145, icon: Users, color: "violet" },
  { id: "sessions", label: "Avg Sessions/Mo", value: "24,800", change: 9.2, icon: Activity, color: "cyan" },
  { id: "conversion", label: "Avg Conversion", value: "4.6%", change: 2.1, icon: TrendingUp, color: "emerald" },
];

const DATE_RANGES = ["Last 7 days", "Last 30 days", "Last 90 days", "Last 12 months", "All time"];
const CHART_METRICS = ["revenue", "mrr", "users", "activeUsers", "sessions", "conversion", "churn"];
const CHART_TYPES = ["area", "bar", "line"] as const;
type ChartType = typeof CHART_TYPES[number];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatValue(val: number, metric: string): string {
  if (metric === "revenue" || metric === "mrr") {
    return `$${(val / 1000).toFixed(1)}k`;
  }
  if (metric === "churn" || metric === "conversion") {
    return `${(val ?? 0).toFixed(1)}%`;
  }
  return (val ?? 0).toLocaleString();
}

function getColorClass(color: string) {
  const map: Record<string, { bg: string; text: string; border: string; glow: string }> = {
    indigo: { bg: "bg-indigo-500/15", text: "text-indigo-400", border: "border-indigo-500/30", glow: "shadow-indigo-500/20" },
    violet: { bg: "bg-violet-500/15", text: "text-violet-400", border: "border-violet-500/30", glow: "shadow-violet-500/20" },
    cyan: { bg: "bg-cyan-500/15", text: "text-cyan-400", border: "border-cyan-500/30", glow: "shadow-cyan-500/20" },
    emerald: { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/30", glow: "shadow-emerald-500/20" },
  };
  return map[color] ?? map["indigo"];
}

function getCohortColor(value: number | null): string {
  if (value === null) return "bg-[#1E1E2E]";
  if (value >= 80) return "bg-indigo-500/80";
  if (value >= 65) return "bg-indigo-500/60";
  if (value >= 55) return "bg-indigo-500/40";
  if (value >= 45) return "bg-indigo-500/25";
  return "bg-indigo-500/15";
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label, metric }: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
  metric: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-[#1E1E2E] border border-[#2D2D4E] rounded-xl p-3 shadow-xl shadow-black/40 min-w-[140px]">
      <p className="text-xs text-slate-400 mb-2 font-medium">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-xs text-slate-300 capitalize">{entry.name}:</span>
          <span className="text-xs font-semibold text-white ml-auto pl-3">
            {formatValue(entry.value, metric)}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AnalyticsDeepDivePage() {
  const [dateRange, setDateRange] = useState("Last 12 months");
  const [dateDropOpen, setDateDropOpen] = useState(false);
  const [primaryMetric, setPrimaryMetric] = useState("revenue");
  const [secondaryMetric, setSecondaryMetric] = useState("users");
  const [chartType, setChartType] = useState<ChartType>("area");
  const [activeTab, setActiveTab] = useState<"overview" | "acquisition" | "retention" | "pages">("overview");

  const filteredData = useMemo(() => {
    const rangeMap: Record<string, number> = {
      "Last 7 days": 1,
      "Last 30 days": 1,
      "Last 90 days": 3,
      "Last 12 months": 12,
      "All time": 12,
    };
    const months = rangeMap[dateRange] ?? 12;
    return monthlyData.slice(-months);
  }, [dateRange]);

  const primaryColor = CHART_COLORS[0];
  const secondaryColor = CHART_COLORS[2];

  const ChartComponent = chartType === "bar" ? BarChart : chartType === "line" ? LineChart : AreaChart;

  function renderChartSeries(metric: string, color: string, isSecondary = false) {
    const opacity = isSecondary ? 0.7 : 1;
    if (chartType === "bar") {
      return (
        <Bar
          key={metric}
          dataKey={metric}
          fill={color}
          fillOpacity={opacity}
          radius={[4, 4, 0, 0]}
          maxBarSize={32}
        />
      );
    }
    if (chartType === "line") {
      return (
        <Line
          key={metric}
          type="monotone"
          dataKey={metric}
          stroke={color}
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 5, fill: color }}
          strokeOpacity={opacity}
        />
      );
    }
    // area
    return (
      <Area
        key={metric}
        type="monotone"
        dataKey={metric}
        stroke={color}
        strokeWidth={2.5}
        fill={`url(#grad-${metric})`}
        fillOpacity={isSecondary ? 0.3 : 0.5}
        dot={false}
        activeDot={{ r: 5, fill: color }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

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
                  Deep Dive
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Analytics &amp; Filters
              </h1>
              <p className="text-slate-400 mt-1 text-sm">
                Explore revenue, growth, acquisition, and retention with interactive charts and filters.
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Date Range Picker */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setDateDropOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1E1E2E] border border-[#2D2D4E] text-sm text-slate-300 hover:border-indigo-500/40 transition-all"
                >
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  {dateRange}
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </motion.button>
                {dateDropOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-full mt-1.5 w-44 bg-[#1E1E2E] border border-[#2D2D4E] rounded-xl shadow-xl shadow-black/40 z-30 overflow-hidden"
                  >
                    {DATE_RANGES.map((r) => (
                      <button
                        key={r}
                        onClick={() => { setDateRange(r); setDateDropOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          dateRange === r
                            ? "text-indigo-300 bg-indigo-500/10"
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1E1E2E] border border-[#2D2D4E] text-sm text-slate-400 hover:text-white hover:border-indigo-500/40 transition-all"
              >
                <Filter className="w-4 h-4" />
                Filters
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm text-white font-medium transition-all shadow-lg shadow-indigo-500/25"
              >
                <Download className="w-4 h-4" />
                Export
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* ── KPI Cards ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {kpiCards.map((card) => {
            const colors = getColorClass(card.color);
            const Icon = card.icon;
            const isPositive = card.change >= 0;
            return (
              <motion.div
                key={card.id}
                variants={scaleIn}
                whileHover={{ y: -3, scale: 1.02 }}
                className={`bg-[#16162A] border ${colors.border} rounded-2xl p-5 shadow-lg ${colors.glow} cursor-default`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
                    isPositive ? "text-emerald-400 bg-emerald-500/10" : "text-red-400 bg-red-500/10"
                  }`}>
                    {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {Math.abs(card.change)}%
                  </span>
                </div>
                <p className="text-2xl font-bold text-white tracking-tight">{card.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{card.label}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Tabs ── */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex items-center gap-1 mb-6 bg-[#16162A] border border-[#2D2D4E] rounded-xl p-1 w-fit"
        >
          {(["overview", "acquisition", "retention", "pages"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                activeTab === tab
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* ── Overview Tab ── */}
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Main Chart */}
            <motion.div
              variants={fadeInUp}
              className="bg-[#16162A] border border-[#2D2D4E] rounded-2xl p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-white">Trend Analysis</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Compare two metrics over time</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Metric Selectors */}
                  <select
                    value={primaryMetric}
                    onChange={(e) => setPrimaryMetric(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-[#0F0F1A] border border-[#2D2D4E] text-sm text-indigo-300 focus:outline-none focus:border-indigo-500/50 capitalize"
                  >
                    {CHART_METRICS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <span className="text-slate-600 text-sm">vs</span>
                  <select
                    value={secondaryMetric}
                    onChange={(e) => setSecondaryMetric(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-[#0F0F1A] border border-[#2D2D4E] text-sm text-cyan-300 focus:outline-none focus:border-cyan-500/50 capitalize"
                  >
                    {CHART_METRICS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>

                  {/* Chart Type Toggle */}
                  <div className="flex items-center gap-0.5 bg-[#0F0F1A] border border-[#2D2D4E] rounded-lg p-0.5">
                    {(["area", "bar", "line"] as ChartType[]).map((t) => {
                      const icons: Record<ChartType, React.ReactNode> = {
                        area: <Layers className="w-3.5 h-3.5" />,
                        bar: <BarChart2 className="w-3.5 h-3.5" />,
                        line: <Activity className="w-3.5 h-3.5" />,
                      };
                      return (
                        <button
                          key={t}
                          onClick={() => setChartType(t)}
                          className={`p-1.5 rounded-md transition-all ${
                            chartType === t
                              ? "bg-indigo-600 text-white"
                              : "text-slate-500 hover:text-white"
                          }`}
                        >
                          {icons[t]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={320}>
                <ChartComponent data={filteredData}>
                  <defs>
                    <linearGradient id={`grad-${primaryMetric}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={primaryColor} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={primaryColor} stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id={`grad-${secondaryMetric}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={secondaryColor} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={secondaryColor} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D2D4E" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} width={50} />
                  <Tooltip content={<CustomTooltip metric={primaryMetric} />} />
                  <Legend
                    wrapperStyle={{ paddingTop: "16px", fontSize: "12px", color: "#94A3B8" }}
                  />
                  {renderChartSeries(primaryMetric, primaryColor)}
                  {renderChartSeries(secondaryMetric, secondaryColor, true)}
                </ChartComponent>
              </ResponsiveContainer>
            </motion.div>

            {/* Two smaller charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* MRR Growth */}
              <motion.div variants={fadeInUp} className="bg-[#16162A] border border-[#2D2D4E] rounded-2xl p-6">
                <h3 className="text-base font-semibold text-white mb-1">MRR Growth</h3>
                <p className="text-xs text-slate-500 mb-5">Monthly recurring revenue trajectory</p>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={filteredData}>
                    <defs>
                      <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2D2D4E" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} width={45} />
                    <Tooltip content={<CustomTooltip metric="mrr" />} />
                    <Area type="monotone" dataKey="mrr" stroke="#8B5CF6" strokeWidth={2.5} fill="url(#mrrGrad)" dot={false} activeDot={{ r: 4, fill: "#8B5CF6" }} />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Churn Rate */}
              <motion.div variants={fadeInUp} className="bg-[#16162A] border border-[#2D2D4E] rounded-2xl p-6">
                <h3 className="text-base font-semibold text-white mb-1">Churn Rate</h3>
                <p className="text-xs text-slate-500 mb-5">Monthly churn % — lower is better</p>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2D2D4E" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} width={35} domain={[0, 3]} />
                    <Tooltip content={<CustomTooltip metric="churn" />} />
                    <Line type="monotone" dataKey="churn" stroke="#EF4444" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: "#EF4444" }} />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ── Acquisition Tab ── */}
        {activeTab === "acquisition" && (
          <motion.div
            key="acquisition"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Channel Breakdown Pie */}
              <motion.div variants={fadeInUp} className="bg-[#16162A] border border-[#2D2D4E] rounded-2xl p-6">
                <h3 className="text-base font-semibold text-white mb-1">Traffic Channels</h3>
                <p className="text-xs text-slate-500 mb-5">Breakdown of user acquisition sources</p>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <ResponsiveContainer width={200} height={200}>
                    <PieChart>
                      <Pie
                        data={channelData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {channelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: "#1E1E2E", border: "1px solid #2D2D4E", borderRadius: "12px", fontSize: "12px" }}
                        formatter={(value: number) => [`${value}%`, "Share"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-col gap-2.5 flex-1">
                    {channelData.map((ch) => (
                      <div key={ch.name} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: ch.color }} />
                          <span className="text-sm text-slate-300">{ch.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-[#2D2D4E] rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${ch.value}%`, backgroundColor: ch.color }} />
                          </div>
                          <span className="text-sm font-semibold text-white w-8 text-right">{ch.value}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Conversion Rate */}
              <motion.div variants={fadeInUp} className="bg-[#16162A] border border-[#2D2D4E] rounded-2xl p-6">
                <h3 className="text-base font-semibold text-white mb-1">Conversion Rate</h3>
                <p className="text-xs text-slate-500 mb-5">Visitor-to-signup conversion over time</p>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={filteredData}>
                    <defs>
                      <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.45} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2D2D4E" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} width={35} />
                    <Tooltip content={<CustomTooltip metric="conversion" />} />
                    <Area type="monotone" dataKey="conversion" stroke="#10B981" strokeWidth={2.5} fill="url(#convGrad)" dot={false} activeDot={{ r: 4, fill: "#10B981" }} />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Sessions Bar Chart */}
            <motion.div variants={fadeInUp} className="bg-[#16162A] border border-[#2D2D4E] rounded-2xl p-6">
              <h3 className="text-base font-semibold text-white mb-1">Monthly Sessions</h3>
              <p className="text-xs text-slate-500 mb-5">Total site sessions per month</p>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={filteredData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D2D4E" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} width={50} />
                  <Tooltip content={<CustomTooltip metric="sessions" />} />
                  <Bar dataKey="sessions" fill="#06B6D4" radius={[5, 5, 0, 0]} fillOpacity={0.85} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </motion.div>
        )}

        {/* ── Retention Tab ── */}
        {activeTab === "retention" && (
          <motion.div
            key="retention"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Cohort Heatmap */}
            <motion.div variants={fadeInUp} className="bg-[#16162A] border border-[#2D2D4E] rounded-2xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-base font-semibold text-white">Cohort Retention Heatmap</h3>
                  <p className="text-xs text-slate-500 mt-0.5">% of users retained by month after signup</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-indigo-500/15 inline-block" /> Low</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-indigo-500/80 inline-block" /> High</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left text-xs text-slate-500 font-medium pb-3 pr-4 w-16">Cohort</th>
                      {["M0", "M1", "M2", "M3", "M4", "M5"].map((m) => (
                        <th key={m} className="text-center text-xs text-slate-500 font-medium pb-3 px-1 w-16">{m}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="space-y-1">
                    {cohortData.map((row) => (
                      <tr key={row.cohort}>
                        <td className="text-xs text-slate-400 font-medium pr-4 py-1">{row.cohort}</td>
                        {([row.m0, row.m1, row.m2, row.m3, row.m4, row.m5] as (number | null)[]).map((val, i) => (
                          <td key={i} className="px-1 py-1">
                            <div className={`w-14 h-10 rounded-lg flex items-center justify-center text-xs font-semibold ${getCohortColor(val)} ${val !== null ? "text-white" : "text-transparent"}`}>
                              {val !== null ? `${val}%` : "—"}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Active vs Total Users */}
            <motion.div variants={fadeInUp} className="bg-[#16162A] border border-[#2D2D4E] rounded-2xl p-6">
              <h3 className="text-base font-semibold text-white mb-1">Active vs Total Users</h3>
              <p className="text-xs text-slate-500 mb-5">Monthly active users compared to total signups</p>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={filteredData}>
                  <defs>
                    <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D2D4E" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} width={50} />
                  <Tooltip contentStyle={{ background: "#1E1E2E", border: "1px solid #2D2D4E", borderRadius: "12px", fontSize: "12px" }} />
                  <Legend wrapperStyle={{ paddingTop: "12px", fontSize: "12px", color: "#94A3B8" }} />
                  <Area type="monotone" dataKey="users" name="Total Users" stroke="#6366F1" strokeWidth={2} fill="url(#totalGrad)" dot={false} />
                  <Area type="monotone" dataKey="activeUsers" name="Active Users" stroke="#10B981" strokeWidth={2} fill="url(#activeGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          </motion.div>
        )}

        {/* ── Pages Tab ── */}
        {activeTab === "pages" && (
          <motion.div
            key="pages"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={fadeInUp} className="bg-[#16162A] border border-[#2D2D4E] rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#2D2D4E]">
                <div>
                  <h3 className="text-base font-semibold text-white">Top Pages</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Most visited pages ranked by total views</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-[#0F0F1A] border border-[#2D2D4E] px-3 py-1.5 rounded-lg">
                  <Eye className="w-3.5 h-3.5" />
                  {dateRange}
                </div>
              </div>

              <div className="divide-y divide-[#2D2D4E]">
                {/* Header Row */}
                <div className="grid grid-cols-12 px-6 py-3 text-xs text-slate-500 font-medium uppercase tracking-wider">
                  <div className="col-span-4">Page</div>
                  <div className="col-span-2 text-right">Views</div>
                  <div className="col-span-2 text-right">Bounce</div>
                  <div className="col-span-2 text-right">Avg Time</div>
                  <div className="col-span-2 text-right">Trend</div>
                </div>

                {(topPages ?? []).map((row, i) => (
                  <motion.div
                    key={row.page}
                    variants={fadeInUp}
                    whileHover={{ backgroundColor: "rgba(99,102,241,0.04)" }}
                    className="grid grid-cols-12 px-6 py-4 items-center transition-colors"
                  >
                    <div className="col-span-4 flex items-center gap-3">
                      <span className="text-xs text-slate-600 font-mono w-4">{i + 1}</span>
                      <span className="text-sm text-slate-200 font-mono">{row.page}</span>
                    </div>
                    <div className="col-span-2 text-right">
                      <span className="text-sm font-semibold text-white">{(row.views ?? 0).toLocaleString()}</span>
                    </div>
                    <div className="col-span-2 text-right">
                      <span className="text-sm text-slate-400">{row.bounce}</span>
                    </div>
                    <div className="col-span-2 text-right">
                      <span className="text-sm text-slate-400">{row.avgTime}</span>
                    </div>
                    <div className="col-span-2 text-right">
                      <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
                        row.trend >= 0
                          ? "text-emerald-400 bg-emerald-500/10"
                          : "text-red-400 bg-red-500/10"
                      }`}>
                        {row.trend >= 0
                          ? <ArrowUpRight className="w-3 h-3" />
                          : <ArrowDownRight className="w-3 h-3" />}
                        {Math.abs(row.trend)}%
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Insight Banner */}
            <motion.div
              variants={fadeInUp}
              className="flex items-start gap-3 bg-amber-500/8 border border-amber-500/20 rounded-2xl px-5 py-4"
            >
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-300">Insight: High bounce on /settings</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  The settings page has a 42% bounce rate — 18% above average. Consider improving onboarding
                  prompts and reducing form complexity to keep users engaged.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ── Footer Note ── */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-10 flex items-center justify-between text-xs text-slate-600 border-t border-[#2D2D4E] pt-5"
        >
          <span>Data refreshed every 15 minutes · UTC timezone</span>
          <button className="flex items-center gap-1.5 hover:text-slate-400 transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh now
          </button>
        </motion.div>

      </div>
    </div>
  );
}