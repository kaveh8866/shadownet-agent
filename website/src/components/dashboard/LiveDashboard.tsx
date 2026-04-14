"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { DashboardSnapshot, DashboardView, RegionAggregate } from "../../lib/dashboard/types";
import { fetchDashboardSnapshot, connectDashboardStream } from "../../lib/dashboard/fetch-dashboard-data";
import { buildMockSnapshot } from "../../lib/dashboard/mock-data";
import { applyPrivacyFilter } from "../../lib/dashboard/privacy-filter";
import { ActivityFeed } from "./ActivityFeed";
import { DashboardFilters, type DashboardFiltersState } from "./DashboardFilters";
import { HelperNodePanel } from "./HelperNodePanel";
import { MeshActivityCard } from "./MeshActivityCard";
import { NetworkMap } from "./NetworkMap";
import { ProtocolHealthPanelInner } from "./ProtocolHealthPanel";
import { ReleaseHealthCard } from "./ReleaseHealthCard";
import { RegionDetailCard } from "./RegionDetailCard";
import { SummaryCards } from "./SummaryCards";
import { StatusLegend } from "./StatusLegend";
import { formatUnixAgo } from "./format";

type LiveMode = DashboardFiltersState["liveMode"];

const snapshotBaseUrl = process.env.NEXT_PUBLIC_SHADOWNET_DASHBOARD_SNAPSHOT_URL ?? "";
const streamBaseUrl = process.env.NEXT_PUBLIC_SHADOWNET_DASHBOARD_STREAM_URL ?? "";

const viewTitle: Record<DashboardView, string> = {
  global: "Global View",
  iran: "Iran Focus",
  protocols: "Protocols",
  releases: "Releases",
};

export const LiveDashboard = ({ view }: { view: DashboardView }) => {
  const [filters, setFilters] = useState<DashboardFiltersState>({
    privacyMode: true,
    showHelpers: true,
    showFlows: view !== "iran",
    liveMode: "auto",
    timeWindow: "1h",
    protocol: "all",
    severity: "all",
  });

  const [snapshot, setSnapshot] = useState<DashboardSnapshot>(() => buildMockSnapshot(view, 20));
  const [status, setStatus] = useState<{ mode: "demo" | "poll" | "sse" | "off"; note: string }>({
    mode: "demo",
    note: "demo snapshot",
  });
  const [error, setError] = useState<string | null>(null);
  const [selectedRegionName, setSelectedRegionName] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const sseRef = useRef<EventSource | null>(null);
  const pollTimerRef = useRef<number | null>(null);

  const privacyThreshold = snapshot.privacyThreshold ?? 20;

  const canUseStream = useMemo(() => typeof window !== "undefined" && !!streamBaseUrl, []);
  const canUseSnapshotUrl = useMemo(() => typeof window !== "undefined" && !!snapshotBaseUrl, []);

  const displaySnapshot = useMemo(
    () =>
      applyPrivacyFilter(snapshot, {
        mode: filters.privacyMode ? "public" : "trusted",
      }),
    [filters.privacyMode, snapshot],
  );

  const selectedRegion: RegionAggregate | null = useMemo(() => {
    if (!selectedRegionName) return null;
    const hit = displaySnapshot.regions.find((r) => r.countryName === selectedRegionName);
    return hit ?? null;
  }, [displaySnapshot.regions, selectedRegionName]);

  const stopAll = useCallback(() => {
    if (pollTimerRef.current) {
      window.clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    if (sseRef.current) {
      sseRef.current.close();
      sseRef.current = null;
    }
  }, []);

  const loadOnce = useCallback(async (reason: string) => {
    if (!canUseSnapshotUrl) {
      const next = buildMockSnapshot(view, privacyThreshold);
      setSnapshot(next);
      setStatus({ mode: "demo", note: reason });
      setError(null);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const snap = await fetchDashboardSnapshot(
        {
          view,
          privacyThreshold,
          snapshotBaseUrl,
        },
        controller.signal,
      );
      setSnapshot(snap);
      setError(null);
      setStatus({ mode: "poll", note: reason });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "snapshot fetch failed";
      setError(msg);
      const next = buildMockSnapshot(view, privacyThreshold);
      setSnapshot(next);
      setStatus({ mode: "demo", note: "fallback to demo snapshot" });
    }
  }, [canUseSnapshotUrl, privacyThreshold, view]);

  useEffect(() => {
    stopAll();
    setError(null);
    setSnapshot(buildMockSnapshot(view, privacyThreshold));

    const mode: LiveMode = filters.liveMode;
    if (mode === "off") {
      setStatus({ mode: "off", note: "live updates disabled" });
      return () => stopAll();
    }

    const startPoll = (reason: string) => {
      void loadOnce(reason);
      pollTimerRef.current = window.setInterval(() => {
        void loadOnce("poll refresh");
      }, 10_000);
    };

    const startSSE = (reason: string) => {
      if (!canUseStream) {
        startPoll("stream unavailable; polling");
        return;
      }
      try {
        const es = connectDashboardStream({
          streamBaseUrl,
          view,
          privacyThreshold,
          onSnapshot: (snap) => {
            setSnapshot(snap);
            setError(null);
          },
          onError: () => {
            if (sseRef.current) {
              sseRef.current.close();
              sseRef.current = null;
            }
            startPoll("stream error; polling fallback");
          },
        });
        sseRef.current = es;
        setStatus({ mode: "sse", note: reason });
      } catch {
        startPoll("stream init failed; polling");
      }
    };

    if (mode === "poll") {
      startPoll("polling");
      return () => stopAll();
    }

    if (mode === "auto") {
      if (canUseStream) {
        startSSE("streaming");
        return () => stopAll();
      }
      if (canUseSnapshotUrl) {
        startPoll("polling");
        return () => stopAll();
      }

      const timer = window.setInterval(() => {
        setSnapshot(buildMockSnapshot(view, privacyThreshold));
        setStatus({ mode: "demo", note: "demo replay" });
      }, 5000);
      pollTimerRef.current = timer;
      return () => stopAll();
    }

    return () => stopAll();
  }, [view, filters.liveMode, canUseSnapshotUrl, canUseStream, privacyThreshold, loadOnce, stopAll]);

  return (
    <div className="grid gap-6">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div className="min-w-0">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Mode</div>
          <div className="mt-1 flex items-center gap-3 flex-wrap">
            <div className="text-foreground font-bold text-lg">{viewTitle[view]}</div>
            <div className="text-xs font-mono px-2 py-1 rounded border border-border bg-card/60 text-muted-foreground">
              {status.mode} • {status.note}
            </div>
            <div className="text-xs font-mono text-muted-foreground">updated {formatUnixAgo(snapshot.generatedAtUnix)}</div>
          </div>
          <div className="mt-2 text-sm text-muted-foreground max-w-3xl">
            All values are coarse, bucketed, privacy-thresholded, and safe for public viewing by default.
          </div>
          {error ? (
            <div className="mt-2 text-xs font-mono text-red-400 border border-border rounded px-3 py-2 bg-card/60">
              live feed unavailable: {error}
            </div>
          ) : null}
        </div>
      </div>

      <SummaryCards snapshot={displaySnapshot} />

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-9 grid gap-6">
          {view === "protocols" ? (
            <div className="grid md:grid-cols-2 gap-6">
              <ProtocolHealthPanelInner snapshot={displaySnapshot} protocol={filters.protocol} />
              <ReleaseHealthCard snapshot={displaySnapshot} />
            </div>
          ) : view === "releases" ? (
            <div className="grid md:grid-cols-2 gap-6">
              <ReleaseHealthCard snapshot={displaySnapshot} />
              <ProtocolHealthPanelInner snapshot={displaySnapshot} protocol={filters.protocol} />
            </div>
          ) : (
            <NetworkMap
              snapshot={displaySnapshot}
              privacyMode={filters.privacyMode}
              showHelpers={filters.showHelpers}
              showFlows={filters.showFlows}
              onSelectRegion={(r) => setSelectedRegionName(r.countryName)}
            />
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <MeshActivityCard snapshot={displaySnapshot} />
            <ActivityFeed snapshot={displaySnapshot} severity={filters.severity} timeWindow={filters.timeWindow} />
          </div>
        </div>

        <div className="lg:col-span-3 grid gap-6">
          <DashboardFilters value={filters} onChange={setFilters} />
          <StatusLegend />
          <RegionDetailCard region={selectedRegion} />
          <HelperNodePanel snapshot={displaySnapshot} />
        </div>
      </div>
    </div>
  );
};
