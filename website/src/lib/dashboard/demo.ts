import type {
  DashboardSnapshot,
  DashboardView,
  HelperNode,
  ProtocolHealth,
  RegionAggregate,
} from "./types";

const nowUnix = () => Math.floor(Date.now() / 1000);

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const jitter = (base: number, spread: number, seed: number) => {
  const x = Math.sin(seed * 9999) * 10000;
  const r = x - Math.floor(x);
  return base + (r - 0.5) * spread * 2;
};

const statusByPressure = (pressure: number): RegionAggregate["status"] => {
  if (pressure >= 0.85) return "blocked";
  if (pressure >= 0.65) return "unstable";
  if (pressure >= 0.4) return "degraded";
  if (pressure >= 0.2) return "healthy";
  return "unknown";
};

const demoRegions = (): RegionAggregate[] => {
  const t = nowUnix();
  const base: Array<{ name: string; pressure: number; samples: number }> = [
    { name: "Iran", pressure: 0.78, samples: 2200 },
    { name: "Iraq", pressure: 0.36, samples: 160 },
    { name: "Turkey", pressure: 0.28, samples: 280 },
    { name: "Afghanistan", pressure: 0.58, samples: 75 },
    { name: "Pakistan", pressure: 0.33, samples: 120 },
    { name: "Armenia", pressure: 0.18, samples: 45 },
    { name: "Azerbaijan", pressure: 0.31, samples: 55 },
    { name: "United Arab Emirates", pressure: 0.12, samples: 70 },
    { name: "Germany", pressure: 0.06, samples: 900 },
    { name: "France", pressure: 0.08, samples: 640 },
    { name: "United Kingdom", pressure: 0.07, samples: 500 },
    { name: "United States of America", pressure: 0.05, samples: 1200 },
    { name: "Canada", pressure: 0.06, samples: 400 },
    { name: "Sweden", pressure: 0.07, samples: 250 },
    { name: "Netherlands", pressure: 0.07, samples: 260 },
    { name: "Romania", pressure: 0.09, samples: 180 },
    { name: "Finland", pressure: 0.08, samples: 140 },
  ];

  return base.map((r, idx) => {
    const seed = idx + t / 60;
    const success = clamp01(jitter(1 - r.pressure, 0.08, seed));
    const change = clamp01(jitter(r.pressure, 0.06, seed + 13));
    const reality = clamp01(jitter(0.38, 0.12, seed + 1));
    const h2 = clamp01(jitter(0.24, 0.1, seed + 2));
    const tuic = clamp01(jitter(0.18, 0.08, seed + 3));
    const shadowtls = clamp01(jitter(0.12, 0.06, seed + 4));
    const dns = clamp01(1 - (reality + h2 + tuic + shadowtls));

    const mixSum = reality + h2 + tuic + shadowtls + dns;
    const protocolMix = {
      reality: reality / mixSum,
      hysteria2: h2 / mixSum,
      tuic: tuic / mixSum,
      shadowtls: shadowtls / mixSum,
      dns_tunnel: dns / mixSum,
    };

    return {
      countryName: r.name,
      status: statusByPressure(r.pressure),
      protocolMix,
      configSuccessRate: success,
      recentChangeRate: change,
      lastUpdateUnix: t - (idx % 7) * 60,
      sampleCount: r.samples,
    };
  });
};

const demoHelperNodes = (): HelperNode[] => {
  const t = nowUnix();
  const list: HelperNode[] = [
    {
      id: "de-1",
      label: "EU Helper Cluster",
      regionLabel: "Central Europe",
      coords: [10.4, 51.1],
      availability: "up",
      lastUpdateUnix: t - 20,
    },
    {
      id: "nl-1",
      label: "NL Relays",
      regionLabel: "Western Europe",
      coords: [5.3, 52.1],
      availability: "up",
      lastUpdateUnix: t - 35,
    },
    {
      id: "se-1",
      label: "Nordic Nodes",
      regionLabel: "Northern Europe",
      coords: [15.2, 60.1],
      availability: "degraded",
      lastUpdateUnix: t - 60,
    },
    {
      id: "us-1",
      label: "US West Helpers",
      regionLabel: "North America",
      coords: [-121.7, 37.3],
      availability: "up",
      lastUpdateUnix: t - 40,
    },
  ];
  return list;
};

const demoProtocolHealth = (): ProtocolHealth[] => {
  const t = nowUnix();
  const base: Array<{ protocol: ProtocolHealth["protocol"]; success: number; trend: number; cooldown: number; tier: ProtocolHealth["recommendationTier"] }> =
    [
      { protocol: "reality", success: 0.86, trend: -0.03, cooldown: 0.08, tier: "primary" },
      { protocol: "hysteria2", success: 0.74, trend: -0.06, cooldown: 0.16, tier: "secondary" },
      { protocol: "tuic", success: 0.62, trend: -0.02, cooldown: 0.22, tier: "secondary" },
      { protocol: "shadowtls", success: 0.58, trend: -0.01, cooldown: 0.19, tier: "fallback" },
      { protocol: "dns_tunnel", success: 0.33, trend: 0.02, cooldown: 0.05, tier: "avoid" },
    ];

  return base.map((p, idx) => ({
    protocol: p.protocol,
    successRate: clamp01(jitter(p.success, 0.04, idx + t / 120)),
    failureTrend: Math.max(-1, Math.min(1, jitter(p.trend, 0.03, idx + 7 + t / 180))),
    cooldownRate: clamp01(jitter(p.cooldown, 0.04, idx + 17 + t / 180)),
    recommendationTier: p.tier,
    lastUpdateUnix: t - 15 - idx * 4,
  }));
};

export const buildDemoSnapshot = (view: DashboardView, privacyThreshold = 20): DashboardSnapshot => {
  const t = nowUnix();
  const regions = demoRegions();
  const helperNodes = demoHelperNodes();
  const protocols = demoProtocolHealth();

  const isIranFocus = view === "iran";
  const insideActive = isIranFocus ? 6800 : 11000;
  const blackoutProbability = isIranFocus ? 0.61 : 0.34;

  return {
    version: 1,
    view,
    generatedAtUnix: t,
    privacyThreshold,
    regions,
    inside: {
      activeInstallations: insideActive,
      protocolSurvivalRate: 0.77,
      blackoutProbability,
      meshActivityScore: isIranFocus ? 0.42 : 0.18,
      seedAdoptionRate: 0.64,
      lastUpdateUnix: t - 10,
    },
    outside: {
      activeHelperRegions: ["Central Europe", "Western Europe", "North America"],
      bundlesGenerated24h: 146,
      successfulDistributions24h: 88,
      profileFreshnessHours: 6.5,
      helperAvailabilityScore: 0.83,
      lastUpdateUnix: t - 12,
    },
    protocols,
    release: {
      latestVersion: "v0.1.0",
      manifestFreshnessSec: 2 * 60 * 60,
      signatureStatus: "ok",
      platformArtifacts: { android: true, linux: true, windows: true, macos: true },
      lastUpdateUnix: t - 90,
    },
    helperNodes,
    flows: [
      { id: "flow-eu-ir", from: [10.4, 51.1], to: [53.7, 32.0], intensity: 0.7, label: "Bundles", tsUnix: t - 30 },
      { id: "flow-us-ir", from: [-121.7, 37.3], to: [53.7, 32.0], intensity: 0.35, label: "Relays", tsUnix: t - 55 },
    ],
    activity: [
      { id: "a1", tsUnix: t - 18, severity: "warn", type: "dpi_shift", message: "SNI reset rate rose in Iran Focus view", regionLabel: "Iran" },
      { id: "a2", tsUnix: t - 42, severity: "info", type: "bundle_generated", message: "Signed bundle created by EU helper cluster", regionLabel: "Central Europe" },
      { id: "a3", tsUnix: t - 76, severity: "info", type: "bundle_imported", message: "Aggregate imports increased (privacy-thresholded)", regionLabel: "Iran" },
      { id: "a4", tsUnix: t - 104, severity: "warn", type: "protocol_cooldown", message: "Hysteria2 cooldowns trending upward (aggregate)", regionLabel: "Iran" },
      { id: "a5", tsUnix: t - 165, severity: "info", type: "snapshot", message: "Snapshot refreshed", regionLabel: view.toUpperCase() },
    ],
  };
};
