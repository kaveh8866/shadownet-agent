"use client";

import type { DashboardSnapshot } from "../../lib/dashboard/types";
import { formatCompactNumber, formatUnixAgo } from "./format";

export const ReleaseHealthCard = ({ snapshot }: { snapshot: DashboardSnapshot }) => {
  const r = snapshot.release;
  return (
    <div className="rounded-xl border border-border bg-card/60 p-4 shadow-[0_0_0_1px_var(--border)]">
      <div className="flex items-center justify-between gap-4">
        <div className="text-foreground font-bold">Release Health</div>
        <div className="text-xs text-muted-foreground font-mono">updated {formatUnixAgo(r.lastUpdateUnix)}</div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Latest</div>
          <div className="text-foreground font-semibold font-mono mt-1">{r.latestVersion}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Signature</div>
          <div className="text-foreground font-semibold font-mono mt-1">{r.signatureStatus}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Manifest Age</div>
          <div className="text-foreground font-semibold font-mono mt-1">{Math.round(r.manifestFreshnessSec / 60)}m</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Downloads</div>
          <div className="text-foreground font-semibold font-mono mt-1">
            {typeof r.installerDownloads24h === "number" ? formatCompactNumber(r.installerDownloads24h) : "n/a"}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-border bg-card p-3">
        <div className="text-xs text-muted-foreground uppercase tracking-wider">Artifacts</div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
          {Object.entries(r.platformArtifacts).map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-3 rounded border border-border px-3 py-2">
              <span className="text-muted-foreground">{k}</span>
              <span className={`font-mono ${v ? "text-emerald-400" : "text-red-400"}`}>{v ? "ok" : "missing"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

