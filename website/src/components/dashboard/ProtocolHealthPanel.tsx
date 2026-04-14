"use client";

import type { DashboardSnapshot } from "../../lib/dashboard/types";
import { formatPercent, formatUnixAgo } from "./format";
import { tierColor, tierLabel } from "./status";

const protocolLabel: Record<DashboardSnapshot["protocols"][number]["protocol"], string> = {
  reality: "Reality",
  hysteria2: "Hysteria2",
  tuic: "TUIC",
  shadowtls: "ShadowTLS",
  dns_tunnel: "DNS tunnel",
};

export const ProtocolHealthPanel = ({ snapshot }: { snapshot: DashboardSnapshot }) => {
  return (
    <ProtocolHealthPanelInner snapshot={snapshot} protocol="all" />
  );
};

export const ProtocolHealthPanelInner = ({
  snapshot,
  protocol,
}: {
  snapshot: DashboardSnapshot;
  protocol: "all" | DashboardSnapshot["protocols"][number]["protocol"];
}) => {
  const items = protocol === "all" ? snapshot.protocols : snapshot.protocols.filter((p) => p.protocol === protocol);
  return (
    <div className="rounded-xl border border-border bg-card/60 p-4 shadow-[0_0_0_1px_var(--border)]">
      <div className="flex items-center justify-between gap-4">
        <div className="text-foreground font-bold">Protocol Health</div>
        <div className="text-xs text-muted-foreground font-mono">updated {formatUnixAgo(snapshot.generatedAtUnix)}</div>
      </div>

      <div className="mt-4 grid gap-2">
        {items.map((p) => (
          <div key={p.protocol} className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-foreground">{protocolLabel[p.protocol]}</div>
              <div
                className="text-xs font-mono px-2 py-1 rounded border border-border"
                style={{ color: tierColor[p.recommendationTier] }}
              >
                {tierLabel[p.recommendationTier]}
              </div>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
              <div>
                <div className="uppercase tracking-wider">Success</div>
                <div className="text-foreground font-semibold">{formatPercent(p.successRate)}</div>
              </div>
              <div>
                <div className="uppercase tracking-wider">Trend</div>
                <div className="text-foreground font-semibold">{p.failureTrend > 0 ? "+" : ""}{p.failureTrend.toFixed(2)}</div>
              </div>
              <div>
                <div className="uppercase tracking-wider">Cooldown</div>
                <div className="text-foreground font-semibold">{formatPercent(p.cooldownRate)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
