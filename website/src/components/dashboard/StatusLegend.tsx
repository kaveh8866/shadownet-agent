"use client";

import { statusPalette } from "./status";

export const StatusLegend = () => {
  return (
    <div className="rounded-xl border border-border bg-card/60 p-4 shadow-[0_0_0_1px_var(--border)]">
      <div className="text-foreground font-bold">Status</div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
        {Object.entries(statusPalette).map(([key, v]) => (
          <div key={key} className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: v.color }} />
            <span>{v.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 text-xs text-muted-foreground">
        Regions below privacy threshold are shown as Unknown.
      </div>
    </div>
  );
};

