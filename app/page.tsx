"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Activity, Users, Star, TrendingUp, Shield, Zap, BarChart2, CheckCircle, ChevronRight, Sparkles, Globe, Clock, Bell } from 'lucide-react';
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
} from "recharts";
import { APP_NAME, APP_TAGLINE, BRAND_COLORS, CHART_COLORS } from "@/lib/data";
import { fadeInUp, fadeIn, staggerContainer, scaleIn, slideInLeft, slideInRight } from "@/lib/motion";

// ─── Inline mock data ────────────────────────────────────────────────────────

const revenueData = [
  { month: "Jan", revenue: 32000, mrr: 28000 },
  { month: "Feb", revenue: 38000, mrr: 31000 },
  { month: "Mar", revenue: 35000, mrr: 33000 },
  { month: "Apr", revenue: 44000, mrr: 38000 },
  { month: "May", revenue: 51000, mrr: 44000 },
  { month: "Jun", revenue: 48000, mrr: 46000 },
  { month: "Jul", revenue: 59000, mrr: 52000 },
  { month: "Aug", revenue: 63000, mrr: 57000 },
];

const userGrowthData = [
  { month: "Jan", users: 1200, active: 980 },
  { month: "Feb", users: 1450, active: 1180 },
  { month: "Mar", users: 1700, active: 1390 },
  { month: "Apr", users: 1950, active: 1620 },
  { month: "May", users: 2300, active: 1900 },
  { month: "Jun", users: 2650, active: 2200 },
  { month: "Jul", users: 3100, active: 2580 },
  { month: "Aug", users: 3600, active: 3020 },
];

const channelData = [
  { name: "Organic", value: 38 },
  { name: "Paid", value: 27 },
  { name: "Referral", value: 20 },
  { name: "Direct", value: 15 },
];

const kpiCards = [
  {
    id: "mrr",
    label: "Monthly Recurring Revenue",
    value: "$57,200",
    change: +18.4,
    icon: Star,
    color: "from-indigo-500 to-violet-600",
    glow: "shadow-indigo-500/20",
  },
  {
    id: "users",
    label: "Total Active Users",
    value: "3,020",
    change: +24.1,
    icon: Users,
    color: "from-cyan-500 to-blue-600",
    glow: "shadow-cyan-500/20",
  },
  {
    id: "churn",
    label: "Churn Rate",
    value: "1.8%",
    change: -0.4,
    icon: Activity,
    color: "from-emerald-500 to-teal-600",
    glow: "shadow-emerald-500/20",
  },
  {
    id: "nps",
    label: "Net Promoter Score",
    value: "72",
    change: +5,
    icon: TrendingUp,
    color: "from-amber-500 to-orange-600",
    glow: "shadow-amber-500/20",
  },
];

const features = [
  {
    icon: BarChart2,
    title: "Real-Time Analytics",
    description:
      "Monitor revenue, churn, and user growth as it happens. Live dashboards update every 30 seconds so you never miss a beat.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10 border-indigo-500/20",
  },
  {
    icon: Users,
    title: "User Cohort Analysis",
    description:
      "Segment users by acquisition channel, plan tier, or behavior. Understand exactly who your best customers are and why they stay.",
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
  },
  {
    icon: Zap,
    title: "Instant Alerts",
    description:
      "Set custom thresholds for any metric. Get notified via Slack, email, or in-app the moment something needs your attention.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "SOC 2 Type II certified. All data encrypted at rest and in transit. Role-based access controls for every team member.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: Globe,
    title: "Multi-Region Support",
    description:
      "Deploy in US, EU, or APAC regions. Stay compliant with GDPR and CCPA out of the box with regional data residency.",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
  {
    icon: Clock,
    title: "Historical Benchmarks",
    description:
      "Compare any metric against your own historical baseline or industry benchmarks. Spot trends before they become problems.",
    color: "text-rose-400",
    bg: "bg-rose-500/10 border-rose-500/20",
  },
];

const testimonials = [
  {
    id: "t1",
    name: "Sarah Chen",
    role: "Head of Growth, Luma SaaS",
    avatar: "/images/sarah-chen-avatar.jpg",
    quote:
      "Pulse Analytics replaced four separate tools for us. Our team now spends 80% less time pulling reports and 80% more time acting on insights.",
    rating: 5,
  },
  {
    id: "t2",
    name: "Marcus Webb",
    role: "CTO, Orbit Finance",
    avatar: "/images/marcus-webb-avatar.jpg",
    quote:
      "The cohort analysis alone is worth the subscription. We identified a leaky onboarding step that was costing us $12k MRR — fixed it in a week.",
    rating: 5,
  },
  {
    id: "t3",
    name: "Priya Nair",
    role: "CEO, Stackwise",
    avatar: "/images/priya-nair-avatar.jpg",
    quote:
      "I check Pulse before my morning coffee. The real-time alerts mean I'm never blindsided by a churn spike or a payment failure again.",
    rating: 5,
  },
];

const pricingPlans = [
  {
    id: "starter",
    name: "Starter",
    price: "$49",
    period: "/mo",
    description: "Perfect for early-stage startups tracking core metrics.",
    features: [
      "Up to 5,000 tracked users",
      "Revenue & MRR dashboards",
      "7-day data retention",
      "Email alerts",
      "2 team seats",
    ],
    cta: "Start free trial",
    highlight: false,
  },
  {
    id: "growth",
    name: "Growth",
    price: "$149",
    period: "/mo",
    description: "For scaling teams that need deeper cohort and funnel analysis.",
    features: [
      "Up to 50,000 tracked users",
      "Full cohort & funnel analysis",
      "90-day data retention",
      "Slack + email alerts",
      "10 team seats",
      "Custom dashboards",
    ],
    cta: "Start free trial",
    highlight: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Unlimited scale, dedicated support, and custom SLAs.",
    features: [
      "Unlimited tracked users",
      "Unlimited data retention",
      "SSO & SCIM provisioning",
      "Dedicated success manager",
      "Custom integrations",
      "SLA guarantee",
    ],
    cta: "Contact sales",
    highlight: false,
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function KPIStrip() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {kpiCards.map((card) => {
        const Icon = card.icon;
        const isPositive = card.change >= 0;
        return (
          <motion.div
            key={card.id}
            variants={scaleIn}
            whileHover={{ y: -4, scale: 1.02 }}
            className={`relative rounded-2xl bg-[#16162A] border border-[#2D2D4E] p-5 overflow-hidden shadow-xl ${card.glow}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  isPositive
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-rose-500/15 text-rose-400"
                }`}
              >
                {isPositive ? "+" : ""}
                {card.change}%
              </span>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{card.value}</p>
            <p className="text-xs text-slate-500">{card.label}</p>
            {/* decorative glow blob */}
            <div className={`absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br ${card.color} opacity-10 blur-xl`} />
          </motion.div>
        );
      })}
    </motion.div>
  );
}

function RevenueChart() {
  return (
    <motion.div
      variants={slideInLeft}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="rounded-2xl bg-[#16162A] border border-[#2D2D4E] p-6 shadow-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-white">Revenue vs MRR</h3>
          <p className="text-xs text-slate-500 mt-0.5">Last 8 months</p>
        </div>
        <span className="text-xs bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full font-medium">
          +18.4% MoM
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradMRR" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2D2D4E" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            contentStyle={{ background: "#1E1E2E", border: "1px solid #2D2D4E", borderRadius: 12, color: "#fff", fontSize: 12 }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
          />
          <Area type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={2.5} fill="url(#gradRevenue)" name="Revenue" />
          <Area type="monotone" dataKey="mrr" stroke="#8B5CF6" strokeWidth={2.5} fill="url(#gradMRR)" name="MRR" />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-5 mt-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" />
          <span className="text-xs text-slate-400">Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-violet-500 inline-block" />
          <span className="text-xs text-slate-400">MRR</span>
        </div>
      </div>
    </motion.div>
  );
}

function UserGrowthChart() {
  return (
    <motion.div
      variants={slideInRight}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="rounded-2xl bg-[#16162A] border border-[#2D2D4E] p-6 shadow-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-white">User Growth</h3>
          <p className="text-xs text-slate-500 mt-0.5">Total vs Active</p>
        </div>
        <span className="text-xs bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-full font-medium">
          3,600 total
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={userGrowthData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2D2D4E" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`} />
          <Tooltip
            contentStyle={{ background: "#1E1E2E", border: "1px solid #2D2D4E", borderRadius: 12, color: "#fff", fontSize: 12 }}
          />
          <Bar dataKey="users" fill="#06B6D4" radius={[4, 4, 0, 0]} name="Total Users" />
          <Bar dataKey="active" fill="#6366F1" radius={[4, 4, 0, 0]} name="Active Users" />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-5 mt-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-cyan-500 inline-block" />
          <span className="text-xs text-slate-400">Total Users</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" />
          <span className="text-xs text-slate-400">Active Users</span>
        </div>
      </div>
    </motion.div>
  );
}

function ChannelPieChart() {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="rounded-2xl bg-[#16162A] border border-[#2D2D4E] p-6 shadow-xl flex flex-col"
    >
      <div className="mb-4">
        <h3 className="text-base font-semibold text-white">Acquisition Channels</h3>
        <p className="text-xs text-slate-500 mt-0.5">Traffic source breakdown</p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-6 flex-1">
        <ResponsiveContainer width={160} height={160}>
          <PieChart>
            <Pie
              data={channelData}
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={72}
              paddingAngle={3}
              dataKey="value"
            >
              {channelData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: "#1E1E2E", border: "1px solid #2D2D4E", borderRadius: 12, color: "#fff", fontSize: 12 }}
              formatter={(value: number) => [`${value}%`, undefined]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-col gap-2.5 flex-1">
          {channelData.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: CHART_COLORS[index % CHART_COLORS.length] }}
                />
                <span className="text-sm text-slate-400">{item.name}</span>
              </div>
              <span className="text-sm font-semibold text-white">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [activePlan, setActivePlan] = useState<string>("growth");

  return (
    <main className="min-h-screen bg-[#0A0A14] text-white overflow-x-hidden">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-violet-600/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-cyan-600/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/25 rounded-full px-4 py-1.5 mb-8">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-xs font-medium text-indigo-300">Now with AI-powered anomaly detection</span>
              <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6"
            >
              <span className="text-white">Your metrics,</span>
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                crystal clear.
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10"
            >
              {APP_TAGLINE} Track MRR, churn, user growth, and acquisition channels in one
              unified dashboard — no SQL, no spreadsheets, no guesswork.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/analytics">
                <motion.span
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-semibold px-7 py-3.5 rounded-xl shadow-lg shadow-indigo-500/30 transition-all duration-200 cursor-pointer"
                >
                  Start free trial
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </Link>
              <Link href="/analytics">
                <motion.span
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 cursor-pointer"
                >
                  View live demo
                  <Activity className="w-4 h-4 text-indigo-400" />
                </motion.span>
              </Link>
            </motion.div>

            {/* Social proof bar */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500"
            >
              {[
                { icon: Shield, text: "SOC 2 certified" },
                { icon: Users, text: "2,400+ companies" },
                { icon: Star, text: "4.9 / 5 on G2" },
                { icon: Clock, text: "14-day free trial" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.text} className="flex items-center gap-1.5">
                    <Icon className="w-4 h-4 text-indigo-400" />
                    <span>{item.text}</span>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* ── Dashboard preview ── */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            className="mt-20 relative"
          >
            {/* Glow under card */}
            <div className="absolute inset-x-10 bottom-0 h-24 bg-indigo-600/20 blur-2xl rounded-full" />
            <div className="relative rounded-2xl bg-[#16162A] border border-[#2D2D4E] shadow-2xl shadow-black/50 overflow-hidden">
              {/* Fake browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-[#0F0F1A] border-b border-[#2D2D4E]">
                <span className="w-3 h-3 rounded-full bg-rose-500/70" />
                <span className="w-3 h-3 rounded-full bg-amber-500/70" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
                <div className="ml-4 flex-1 bg-[#1E1E2E] rounded-md px-3 py-1 text-xs text-slate-500 max-w-xs">
                  app.pulseanalytics.io/dashboard
                </div>
                <Bell className="w-4 h-4 text-slate-600 ml-auto" />
              </div>
              {/* KPI strip inside preview */}
              <div className="p-6">
                <KPIStrip />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
                  <RevenueChart />
                  <UserGrowthChart />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">
              Everything you need
            </motion.p>
            <motion.h2 variants={fadeInUp} className="text-4xl sm:text-5xl font-bold text-white mb-5">
              Built for modern SaaS teams
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-slate-400 text-lg max-w-2xl mx-auto">
              From seed-stage startups to Series C companies, Pulse gives every team the
              analytics infrastructure they need to grow with confidence.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  variants={fadeInUp}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`rounded-2xl border p-6 ${feat.bg} transition-all duration-300 cursor-default`}
                >
                  <div className={`w-11 h-11 rounded-xl ${feat.bg} border flex items-center justify-center mb-4`}>
                    <Icon className={`w-5 h-5 ${feat.color}`} />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{feat.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feat.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── ANALYTICS SHOWCASE ───────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3">
              Live analytics
            </motion.p>
            <motion.h2 variants={fadeInUp} className="text-4xl sm:text-5xl font-bold text-white mb-5">
              Every metric, one place
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-slate-400 text-lg max-w-2xl mx-auto">
              Interactive charts that update in real time. Drill down from high-level trends
              to individual user sessions in seconds.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <RevenueChart />
            </div>
            <div>
              <ChannelPieChart />
            </div>
          </div>

          <div className="mt-5">
            <UserGrowthChart />
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-3">
              Social proof
            </motion.p>
            <motion.h2 variants={fadeInUp} className="text-4xl sm:text-5xl font-bold text-white mb-5">
              Trusted by 2,400+ teams
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-slate-400 text-lg max-w-xl mx-auto">
              See how fast-growing SaaS companies use Pulse to make smarter decisions, faster.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {testimonials.map((t) => (
              <motion.div
                key={t.id}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="rounded-2xl bg-[#16162A] border border-[#2D2D4E] p-6 shadow-xl flex flex-col gap-4"
              >
                {/* Stars */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed flex-1">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-[#2D2D4E]">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {(t.name ?? "?").charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-3">
              Pricing
            </motion.p>
            <motion.h2 variants={fadeInUp} className="text-4xl sm:text-5xl font-bold text-white mb-5">
              Simple, transparent pricing
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-slate-400 text-lg max-w-xl mx-auto">
              No hidden fees. No per-seat surprises. Start free for 14 days — no credit card required.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch"
          >
            {pricingPlans.map((plan) => (
              <motion.div
                key={plan.id}
                variants={scaleIn}
                whileHover={{ y: -6 }}
                onClick={() => setActivePlan(plan.id)}
                className={`relative rounded-2xl border p-7 flex flex-col cursor-pointer transition-all duration-300 ${
                  plan.highlight
                    ? "bg-gradient-to-b from-indigo-500/15 to-violet-500/10 border-indigo-500/40 shadow-2xl shadow-indigo-500/10"
                    : "bg-[#16162A] border-[#2D2D4E]"
                } ${activePlan === plan.id ? "ring-2 ring-indigo-500/60" : ""}`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-xs font-semibold px-4 py-1 rounded-full shadow-lg">
                      Most popular
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-sm text-slate-500 mb-4">{plan.description}</p>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                    {plan.period && <span className="text-slate-500 mb-1">{plan.period}</span>}
                  </div>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link href="/analytics">
                  <motion.span
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`w-full inline-flex items-center justify-center gap-2 font-semibold py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                      plan.highlight
                        ? "bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/25"
                        : "bg-white/5 hover:bg-white/10 border border-white/10 text-white"
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="relative rounded-3xl bg-gradient-to-br from-indigo-600/30 via-violet-600/20 to-cyan-600/20 border border-indigo-500/30 p-12 text-center overflow-hidden shadow-2xl"
          >
            {/* Decorative blobs */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="relative z-10">
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                <span className="text-xs font-medium text-indigo-200">14-day free trial · No credit card</span>
              </motion.div>
              <motion.h2 variants={fadeInUp} className="text-4xl sm:text-5xl font-extrabold text-white mb-5 leading-tight">
                Ready to see your business
                <br />
                <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
                  clearly?
                </span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-300 text-lg mb-10 max-w-xl mx-auto">
                Join 2,400+ SaaS teams who replaced their spreadsheets and fragmented tools
                with Pulse Analytics. Setup takes under 10 minutes.
              </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/analytics">
                  <motion.span
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 font-bold px-8 py-4 rounded-xl shadow-xl transition-all duration-200 cursor-pointer"
                  >
                    Get started free
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                </Link>
                <Link href="/revenue">
                  <motion.span
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 cursor-pointer"
                  >
                    See revenue demo
                    <BarChart2 className="w-4 h-4 text-indigo-300" />
                  </motion.span>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}