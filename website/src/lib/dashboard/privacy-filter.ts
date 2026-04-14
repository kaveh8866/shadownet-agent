import type { DashboardSnapshot, RegionAggregate } from "./types";

const bucketUnix = (unix: number, bucketSec: number) => {
  if (bucketSec <= 1) return unix;
  return Math.floor(unix / bucketSec) * bucketSec;
};

const roundTo = (n: number, step: number) => {
  if (step <= 1) return n;
  return Math.round(n / step) * step;
};

const quantizeCoord = (v: number, step: number) => {
  if (step <= 0) return v;
  return Math.round(v / step) * step;
};

const quantizePair = (p: [number, number], step: number): [number, number] => [
  quantizeCoord(p[0], step),
  quantizeCoord(p[1], step),
];

const stripLowVolumeRegion = (r: RegionAggregate, bucketSec: number): RegionAggregate => ({
  ...r,
  status: "unknown",
  protocolMix: {},
  configSuccessRate: 0,
  recentChangeRate: 0,
  lastUpdateUnix: bucketUnix(r.lastUpdateUnix, bucketSec),
  sampleCount: 0,
});

export type PrivacyMode = "public" | "trusted";

export const applyPrivacyFilter = (
  snap: DashboardSnapshot,
  opts: {
    mode: PrivacyMode;
    threshold?: number;
    timeBucketSec?: number;
  },
): DashboardSnapshot => {
  const threshold = typeof opts.threshold === "number" ? opts.threshold : snap.privacyThreshold;
  const bucketSec = opts.mode === "public" ? opts.timeBucketSec ?? 300 : opts.timeBucketSec ?? 60;

  const regions = snap.regions.map((r) => {
    if (opts.mode === "trusted") return { ...r, lastUpdateUnix: bucketUnix(r.lastUpdateUnix, bucketSec) };
    if (r.sampleCount < threshold) return stripLowVolumeRegion(r, bucketSec);
    return {
      ...r,
      lastUpdateUnix: bucketUnix(r.lastUpdateUnix, bucketSec),
      sampleCount: Math.max(threshold, roundTo(r.sampleCount, 25)),
    };
  });

  const inside = {
    ...snap.inside,
    lastUpdateUnix: bucketUnix(snap.inside.lastUpdateUnix, bucketSec),
    activeInstallations: opts.mode === "public" ? roundTo(snap.inside.activeInstallations, 50) : snap.inside.activeInstallations,
  };

  const outside = {
    ...snap.outside,
    lastUpdateUnix: bucketUnix(snap.outside.lastUpdateUnix, bucketSec),
    bundlesGenerated24h: opts.mode === "public" ? roundTo(snap.outside.bundlesGenerated24h, 5) : snap.outside.bundlesGenerated24h,
    successfulDistributions24h:
      opts.mode === "public" ? roundTo(snap.outside.successfulDistributions24h, 5) : snap.outside.successfulDistributions24h,
  };

  const protocols = snap.protocols.map((p) => ({ ...p, lastUpdateUnix: bucketUnix(p.lastUpdateUnix, bucketSec) }));
  const release = { ...snap.release, lastUpdateUnix: bucketUnix(snap.release.lastUpdateUnix, bucketSec) };

  const activity = snap.activity
    .map((a) => ({ ...a, tsUnix: bucketUnix(a.tsUnix, bucketSec) }))
    .slice(0, 50);

  const flows =
    opts.mode === "public"
      ? snap.flows.map((f) => ({
          ...f,
          from: quantizePair(f.from, 0.5),
          to: quantizePair(f.to, 0.5),
          tsUnix: bucketUnix(f.tsUnix, bucketSec),
          intensity: Math.min(1, Math.max(0, f.intensity)),
        }))
      : snap.flows.map((f) => ({ ...f, tsUnix: bucketUnix(f.tsUnix, bucketSec) }));

  const helperNodes =
    opts.mode === "public"
      ? snap.helperNodes.map((n, i) => ({
          ...n,
          id: `zone-${i}`,
          label: "zone",
          coords: quantizePair(n.coords, 0.5),
          lastUpdateUnix: bucketUnix(n.lastUpdateUnix, bucketSec),
        }))
      : snap.helperNodes.map((n) => ({ ...n, lastUpdateUnix: bucketUnix(n.lastUpdateUnix, bucketSec) }));

  return {
    ...snap,
    generatedAtUnix: bucketUnix(snap.generatedAtUnix, bucketSec),
    privacyThreshold: threshold,
    regions,
    inside,
    outside,
    protocols,
    release,
    activity,
    flows,
    helperNodes,
  };
};
