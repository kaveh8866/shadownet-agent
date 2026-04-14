"use client";

import type { RegionAggregate } from "../../lib/dashboard/types";
import { formatPercent, formatUnixAgo } from "./format";
import { statusPalette } from "./status";

export const RegionDetailCard = ({ region }: { region: RegionAggregate | null }) => {
  if (!region) {
    return (
      <div className="rounded-xl border border-border bg-card/60 p-4 shadow-[0_0_0_1px_var(--border)]">
        <div className="text-foreground font-bold">Region Details</div>
        <div className="mt-3 text-sm text-muted-foreground">Select a region on the map to inspect aggregate metrics.</div>
      </div>
    );
  }

  const status = statusPalette[region.status];
  const mix = Object.entries(region.protocolMix)
    .filter(([, v]) => typeof v === "number")
    .map(([k, v]) => ({ k, v: v as number }))
    .sort((a, b) => b.v - a.v)
    .slice(0, 5);

  return (
    <div className="rounded-xl border border-border bg-card/60 p-4 shadow-[0_0_0_1px_var(--border)]">
      <div className="flex items-center justify-between gap-3">
        <div className="text-foreground font-bold truncate">{region.countryName}</div>
        <div className="text-xs font-mono px-2 py-1 rounded border border-border" style={{ color: status.color }}>
          {status.label}
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Config success</div>
          <div className="mt-1 text-foreground font-semibold font-mono">{formatPercent(region.configSuccessRate)}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Change rate</div>
          <div className="mt-1 text-foreground font-semibold font-mono">{formatPercent(region.recentChangeRate)}</div>
        </div>
      </div>
      <div className="mt-3 rounded-lg border border-border bg-card p-3">
        <div className="text-xs text-muted-foreground uppercase tracking-wider">Protocol mix</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {mix.length === 0 ? (
            <span className="text-xs text-muted-foreground">suppressed by privacy mode</span>
          ) : (
            mix.map((m) => (
              <span key={m.k} className="px-2 py-1 rounded border border-border text-foreground/90 font-mono text-xs">
                {m.k}:{formatPercent(m.v)}
              </span>
            ))
          )}
        </div>
      </div>
      <div className="mt-3 text-xs text-muted-foreground flex items-center justify-between">
        <span>Last update</span>
        <span className="font-mono text-foreground/80">{formatUnixAgo(region.lastUpdateUnix)}</span>
      </div>
      <div className="mt-2 text-xs text-muted-foreground">
        Sample count is not shown here in public mode. Regions below the privacy threshold are redacted.
      </div>
    </div>
  );
};

