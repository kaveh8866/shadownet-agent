import type { ActivitySeverity, HelperAvailability, RegionStatus, RecommendationTier } from "../../lib/dashboard/types";

export const statusPalette: Record<RegionStatus, { label: string; color: string }> = {
  healthy: { label: "Healthy", color: "#10b981" },
  degraded: { label: "Degraded", color: "#f59e0b" },
  unstable: { label: "Unstable", color: "#ef4444" },
  blocked: { label: "Blocked", color: "#7f1d1d" },
  unknown: { label: "Unknown", color: "#64748b" },
};

export const tierLabel: Record<RecommendationTier, string> = {
  primary: "Primary",
  secondary: "Secondary",
  fallback: "Fallback",
  avoid: "Avoid",
};

export const tierColor: Record<RecommendationTier, string> = {
  primary: "#10b981",
  secondary: "#22c55e",
  fallback: "#f59e0b",
  avoid: "#ef4444",
};

export const helperColor: Record<HelperAvailability, string> = {
  up: "#10b981",
  degraded: "#f59e0b",
  down: "#ef4444",
};

export const severityColor: Record<ActivitySeverity, string> = {
  info: "#60a5fa",
  warn: "#f59e0b",
  crit: "#ef4444",
};
