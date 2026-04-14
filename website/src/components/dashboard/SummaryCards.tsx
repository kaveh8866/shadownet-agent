"use client";

import type { DashboardSnapshot } from "../../lib/dashboard/types";
import { countByStatus } from "../../lib/dashboard/transform-map-data";
import { formatUnixAgo } from "./format";

const freshnessLabel = (generatedAtUnix: number) => {
  const now = Math.floor(Date.now() / 1000);
  const age = Math.max(0, now - generatedAtUnix);
  if (age < 20) return { label: "live", cls: "text-emerald-400" };
  if (age < 90) return { label: "delayed", cls: "text-amber-400" };
  if (age < 10 * 60) return { label: "stale", cls: "text-red-400" };
  return { label: "offline", cls: "text-muted-foreground" };
};

export const SummaryCards = ({ snapshot }: { snapshot: DashboardSnapshot }) => {
  const counts = countByStatus(snapshot.regions);
  const blockedCount = counts.blocked + counts.unstable;
  const helperUp = snapshot.helperNodes.filter((n) => n.availability === "up").length;
  const protocolLeader =
    snapshot.protocols
      .slice()
      .sort((a, b) => b.successRate - a.successRate)[0]?.protocol ?? "reality";
  const fresh = freshnessLabel(snapshot.generatedAtUnix);

  return (
    <div className="grid md:grid-cols-5 gap-4">
      <div className="rounded-xl border border-border bg-card/60 p-4 shadow-[0_0_0_1px_var(--border)]">
        <div className="text-xs text-muted-foreground uppercase tracking-wider">Freshness</div>
        <div className="mt-2 flex items-center justify-between gap-3">
          <div className={`font-mono font-semibold ${fresh.cls}`}>{fresh.label}</div>
          <div className="text-xs font-mono text-muted-foreground">{formatUnixAgo(snapshot.generatedAtUnix)}</div>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card/60 p-4 shadow-[0_0_0_1px_var(--border)]">
        <div className="text-xs text-muted-foreground uppercase tracking-wider">Network health</div>
        <div className="mt-2 text-foreground font-bold text-lg">{Math.round(snapshot.inside.protocolSurvivalRate * 100)}%</div>
        <div className="mt-1 text-xs text-muted-foreground">aggregate survival rate</div>
      </div>
      <div className="rounded-xl border border-border bg-card/60 p-4 shadow-[0_0_0_1px_var(--border)]">
        <div className="text-xs text-muted-foreground uppercase tracking-wider">Blocked regions</div>
        <div className="mt-2 text-foreground font-bold text-lg">{blockedCount}</div>
        <div className="mt-1 text-xs text-muted-foreground">blocked + unstable</div>
      </div>
      <div className="rounded-xl border border-border bg-card/60 p-4 shadow-[0_0_0_1px_var(--border)]">
        <div className="text-xs text-muted-foreground uppercase tracking-wider">Helper zones</div>
        <div className="mt-2 text-foreground font-bold text-lg">{helperUp}</div>
        <div className="mt-1 text-xs text-muted-foreground">availability up</div>
      </div>
      <div className="rounded-xl border border-border bg-card/60 p-4 shadow-[0_0_0_1px_var(--border)]">
        <div className="text-xs text-muted-foreground uppercase tracking-wider">Protocol leader</div>
        <div className="mt-2 text-foreground font-bold text-lg font-mono">{protocolLeader}</div>
        <div className="mt-1 text-xs text-muted-foreground">highest success rate</div>
      </div>
    </div>
  );
};

