"use client";

import type { RegionAggregate } from "../../lib/dashboard/types";
import { formatPercent, formatUnixAgo } from "./format";
import { statusPalette } from "./status";

export type RegionTooltipState = {
  visible: boolean;
  x: number;
  y: number;
  region?: RegionAggregate;
};

export const RegionTooltip = ({ state }: { state: RegionTooltipState }) => {
  if (!state.visible || !state.region) return null;
  const r = state.region;
  const status = statusPalette[r.status];

  const mix = Object.entries(r.protocolMix)
    .filter(([, v]) => typeof v === "number")
    .map(([k, v]) => ({ k, v: v as number }))
    .sort((a, b) => b.v - a.v)
    .slice(0, 3);

  return (
    <div
      className="pointer-events-none fixed z-50 rounded-xl border border-border bg-card/95 backdrop-blur-sm shadow-[0_18px_60px_rgba(0,0,0,0.35)] px-4 py-3 w-[260px]"
      style={{ left: state.x + 14, top: state.y + 14 }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-foreground font-bold truncate">{r.countryName}</div>
        <div className="text-xs font-mono px-2 py-1 rounded border border-border" style={{ color: status.color }}>
          {status.label}
        </div>
      </div>
      <div className="mt-2 text-xs text-muted-foreground grid grid-cols-2 gap-2">
        <div>
          <div className="uppercase tracking-wider">Config</div>
          <div className="text-foreground font-semibold">{formatPercent(r.configSuccessRate)}</div>
        </div>
        <div>
          <div className="uppercase tracking-wider">Changes</div>
          <div className="text-foreground font-semibold">{formatPercent(r.recentChangeRate)}</div>
        </div>
      </div>
      <div className="mt-2 text-xs text-muted-foreground">
        <div className="uppercase tracking-wider">Protocol Mix</div>
        <div className="mt-1 flex flex-wrap gap-2">
          {mix.map((m) => (
            <span key={m.k} className="px-2 py-1 rounded border border-border text-foreground/90 font-mono">
              {m.k}:{formatPercent(m.v)}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-2 text-xs text-muted-foreground flex items-center justify-between">
        <span>Last update</span>
        <span className="font-mono text-foreground/80">{formatUnixAgo(r.lastUpdateUnix)}</span>
      </div>
    </div>
  );
};

