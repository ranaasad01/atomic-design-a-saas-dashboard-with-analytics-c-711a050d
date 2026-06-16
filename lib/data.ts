export const APP_NAME = "Pulse Analytics";
export const APP_TAGLINE = "Business intelligence, beautifully simplified.";
export const APP_VERSION = "2.4.1";

export interface NavLink {
  href: string;
  label: string;
  icon?: string;
  badge?: string;
}

export const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/analytics", label: "Analytics" },
  { href: "/users", label: "Users" },
  { href: "/revenue", label: "Revenue" },
  { href: "/settings", label: "Settings" },
];

export const sidebarLinks: NavLink[] = [
  { href: "/", label: "Overview", icon: "Layout" },
  { href: "/analytics", label: "Analytics", icon: "Activity" },
  { href: "/users", label: "Users", icon: "User", badge: "2.4k" },
  { href: "/revenue", label: "Revenue", icon: "Star" },
  { href: "/settings", label: "Settings", icon: "Settings" },
];

export interface KPICard {
  id: string;
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  prefix?: string;
  suffix?: string;
}

export interface ChartDataPoint {
  month: string;
  revenue: number;
  mrr: number;
  users: number;
  activeUsers: number;
  churn: number;
}

export const BRAND_COLORS = {
  primary: "#6366F1",
  secondary: "#8B5CF6",
  accent: "#06B6D4",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  dark: "#1E1E2E",
  surface: "#16162A",
  border: "#2D2D4E",
  muted: "#64748B",
} as const;

export const CHART_COLORS = [
  "#6366F1",
  "#8B5CF6",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#EF4444",
] as const;