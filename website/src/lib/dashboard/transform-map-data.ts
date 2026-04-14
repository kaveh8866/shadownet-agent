import type { DashboardSnapshot, RegionAggregate } from "./types";

export const buildRegionIndex = (regions: RegionAggregate[]) => {
  const byName = new Map<string, RegionAggregate>();
  for (const r of regions) byName.set(r.countryName.toLowerCase(), r);
  return byName;
};

export const countByStatus = (regions: RegionAggregate[]) => {
  const out: Record<DashboardSnapshot["regions"][number]["status"], number> = {
    healthy: 0,
    degraded: 0,
    unstable: 0,
    blocked: 0,
    unknown: 0,
  };
  for (const r of regions) out[r.status] = (out[r.status] ?? 0) + 1;
  return out;
};

