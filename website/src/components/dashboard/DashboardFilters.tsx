"use client";

import type { ActivitySeverity, ProtocolID } from "../../lib/dashboard/types";

export type DashboardFiltersState = {
  privacyMode: boolean;
  showHelpers: boolean;
  showFlows: boolean;
  liveMode: "auto" | "poll" | "off";
  timeWindow: "15m" | "1h" | "24h";
  protocol: "all" | ProtocolID;
  severity: "all" | ActivitySeverity;
};

export const DashboardFilters = ({
  value,
  onChange,
}: {
  value: DashboardFiltersState;
  onChange: (next: DashboardFiltersState) => void;
}) => {
  const toggleBool = (k: "privacyMode" | "showHelpers" | "showFlows") =>
    onChange({ ...value, [k]: !value[k] });
  return (
    <div className="rounded-xl border border-border bg-card/60 p-4 shadow-[0_0_0_1px_var(--border)]">
      <div className="text-foreground font-bold">Filters</div>
      <div className="mt-4 grid gap-2 text-sm">
        <button
          type="button"
          className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card px-4 py-3 hover:opacity-90 transition-opacity"
          onClick={() => toggleBool("privacyMode")}
        >
          <span className="text-foreground font-semibold">Privacy mode</span>
          <span className={`font-mono text-xs ${value.privacyMode ? "text-emerald-400" : "text-red-400"}`}>
            {value.privacyMode ? "on" : "off"}
          </span>
        </button>

        <button
          type="button"
          className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card px-4 py-3 hover:opacity-90 transition-opacity"
          onClick={() => toggleBool("showHelpers")}
        >
          <span className="text-foreground font-semibold">Helper markers</span>
          <span className={`font-mono text-xs ${value.showHelpers ? "text-emerald-400" : "text-muted-foreground"}`}>
            {value.showHelpers ? "shown" : "hidden"}
          </span>
        </button>

        <button
          type="button"
          className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card px-4 py-3 hover:opacity-90 transition-opacity"
          onClick={() => toggleBool("showFlows")}
        >
          <span className="text-foreground font-semibold">Distribution flows</span>
          <span className={`font-mono text-xs ${value.showFlows ? "text-emerald-400" : "text-muted-foreground"}`}>
            {value.showFlows ? "shown" : "hidden"}
          </span>
        </button>

        <div className="rounded-lg border border-border bg-card px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <span className="text-foreground font-semibold">Time window</span>
            <select
              className="bg-transparent border border-border rounded px-2 py-1 text-xs font-mono text-foreground"
              value={value.timeWindow}
              onChange={(e) => onChange({ ...value, timeWindow: e.target.value as DashboardFiltersState["timeWindow"] })}
            >
              <option value="15m">15m</option>
              <option value="1h">1h</option>
              <option value="24h">24h</option>
            </select>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">Applied to activity and trend summaries.</div>
        </div>

        <div className="rounded-lg border border-border bg-card px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <span className="text-foreground font-semibold">Protocol</span>
            <select
              className="bg-transparent border border-border rounded px-2 py-1 text-xs font-mono text-foreground"
              value={value.protocol}
              onChange={(e) => onChange({ ...value, protocol: e.target.value as DashboardFiltersState["protocol"] })}
            >
              <option value="all">all</option>
              <option value="reality">reality</option>
              <option value="hysteria2">hysteria2</option>
              <option value="tuic">tuic</option>
              <option value="shadowtls">shadowtls</option>
              <option value="dns_tunnel">dns_tunnel</option>
            </select>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">Filters protocol table focus.</div>
        </div>

        <div className="rounded-lg border border-border bg-card px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <span className="text-foreground font-semibold">Severity</span>
            <select
              className="bg-transparent border border-border rounded px-2 py-1 text-xs font-mono text-foreground"
              value={value.severity}
              onChange={(e) => onChange({ ...value, severity: e.target.value as DashboardFiltersState["severity"] })}
            >
              <option value="all">all</option>
              <option value="info">info</option>
              <option value="warn">warn</option>
              <option value="crit">crit</option>
            </select>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">Filters activity feed.</div>
        </div>

        <div className="rounded-lg border border-border bg-card px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <span className="text-foreground font-semibold">Live updates</span>
            <select
              className="bg-transparent border border-border rounded px-2 py-1 text-xs font-mono text-foreground"
              value={value.liveMode}
              onChange={(e) => onChange({ ...value, liveMode: e.target.value as DashboardFiltersState["liveMode"] })}
            >
              <option value="auto">auto</option>
              <option value="poll">poll</option>
              <option value="off">off</option>
            </select>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Static builds can use demo mode or poll an external feed.
          </div>
        </div>
      </div>
    </div>
  );
};
