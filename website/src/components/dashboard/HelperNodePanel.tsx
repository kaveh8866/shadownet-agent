"use client";

import type { DashboardSnapshot } from "../../lib/dashboard/types";
import { formatUnixAgo } from "./format";
import { helperColor } from "./status";

export const HelperNodePanel = ({ snapshot }: { snapshot: DashboardSnapshot }) => {
  return (
    <div className="rounded-xl border border-border bg-card/60 p-4 shadow-[0_0_0_1px_var(--border)]">
      <div className="flex items-center justify-between gap-4">
        <div className="text-foreground font-bold">Helper Nodes</div>
        <div className="text-xs text-muted-foreground font-mono">updated {formatUnixAgo(snapshot.outside.lastUpdateUnix)}</div>
      </div>
      <div className="mt-3 text-xs text-muted-foreground">
        Markers are helper clusters or relay zones. No user locations.
      </div>
      <div className="mt-4 grid gap-2">
        {snapshot.helperNodes.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground">No helper nodes.</div>
        ) : (
          snapshot.helperNodes.map((n) => (
            <div key={n.id} className="rounded-lg border border-border bg-card p-3 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-foreground truncate">{n.label}</div>
                <div className="text-xs text-muted-foreground truncate">{n.regionLabel}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: helperColor[n.availability] }} />
                <span className="text-xs font-mono text-muted-foreground">{formatUnixAgo(n.lastUpdateUnix)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

