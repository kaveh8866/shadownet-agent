"use client";

import type { DashboardSnapshot } from "../../lib/dashboard/types";
import { formatPercent, formatUnixAgo } from "./format";

export const MeshActivityCard = ({ snapshot }: { snapshot: DashboardSnapshot }) => {
  const i = snapshot.inside;
  return (
    <div className="rounded-xl border border-border bg-card/60 p-4 shadow-[0_0_0_1px_var(--border)]">
      <div className="flex items-center justify-between gap-4">
        <div className="text-foreground font-bold">Inside Signals</div>
        <div className="text-xs text-muted-foreground font-mono">updated {formatUnixAgo(i.lastUpdateUnix)}</div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Active</div>
          <div className="text-foreground font-semibold font-mono mt-1">{i.activeInstallations.toLocaleString()}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Blackout</div>
          <div className="text-foreground font-semibold font-mono mt-1">{formatPercent(i.blackoutProbability)}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Survival</div>
          <div className="text-foreground font-semibold font-mono mt-1">{formatPercent(i.protocolSurvivalRate)}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Mesh</div>
          <div className="text-foreground font-semibold font-mono mt-1">{formatPercent(i.meshActivityScore)}</div>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-border bg-card p-3">
        <div className="flex items-center justify-between gap-4 text-xs">
          <span className="text-muted-foreground uppercase tracking-wider">Seed adoption</span>
          <span className="text-foreground font-mono font-semibold">{formatPercent(i.seedAdoptionRate)}</span>
        </div>
        <div className="mt-2 h-2 rounded bg-border overflow-hidden">
          <div className="h-full bg-primary" style={{ width: `${Math.round(i.seedAdoptionRate * 100)}%` }} />
        </div>
      </div>
    </div>
  );
};

