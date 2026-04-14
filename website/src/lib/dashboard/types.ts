export type DashboardView = "global" | "iran" | "protocols" | "releases";

export type RegionStatus = "healthy" | "degraded" | "unstable" | "blocked" | "unknown";

export type ProtocolID = "reality" | "hysteria2" | "tuic" | "shadowtls" | "dns_tunnel";

export type RecommendationTier = "primary" | "secondary" | "fallback" | "avoid";

export type SignatureStatus = "ok" | "warn" | "fail";

export type ActivitySeverity = "info" | "warn" | "crit";

export type ActivityType =
  | "snapshot"
  | "dpi_shift"
  | "protocol_cooldown"
  | "bundle_generated"
  | "bundle_imported"
  | "bundle_rejected"
  | "helper_status";

export type RegionAggregate = {
  countryName: string;
  status: RegionStatus;
  protocolMix: Partial<Record<ProtocolID, number>>;
  configSuccessRate: number;
  recentChangeRate: number;
  lastUpdateUnix: number;
  sampleCount: number;
};

export type InsideSignals = {
  activeInstallations: number;
  protocolSurvivalRate: number;
  blackoutProbability: number;
  meshActivityScore: number;
  seedAdoptionRate: number;
  lastUpdateUnix: number;
};

export type HelperAvailability = "up" | "degraded" | "down";

export type HelperNode = {
  id: string;
  label: string;
  regionLabel: string;
  coords: [number, number];
  availability: HelperAvailability;
  lastUpdateUnix: number;
};

export type OutsideHelperActivity = {
  activeHelperRegions: string[];
  bundlesGenerated24h: number;
  successfulDistributions24h: number;
  profileFreshnessHours: number;
  helperAvailabilityScore: number;
  lastUpdateUnix: number;
};

export type ProtocolHealth = {
  protocol: ProtocolID;
  successRate: number;
  failureTrend: number;
  cooldownRate: number;
  recommendationTier: RecommendationTier;
  lastUpdateUnix: number;
};

export type ReleaseHealth = {
  latestVersion: string;
  installerDownloads24h?: number;
  manifestFreshnessSec: number;
  signatureStatus: SignatureStatus;
  platformArtifacts: Record<"android" | "linux" | "windows" | "macos", boolean>;
  lastUpdateUnix: number;
};

export type ActivityItem = {
  id: string;
  tsUnix: number;
  severity: ActivitySeverity;
  type: ActivityType;
  message: string;
  regionLabel?: string;
};

export type ConnectionFlow = {
  id: string;
  from: [number, number];
  to: [number, number];
  intensity: number;
  label?: string;
  tsUnix: number;
};

export type DashboardSnapshot = {
  version: 1;
  view: DashboardView;
  generatedAtUnix: number;
  privacyThreshold: number;
  regions: RegionAggregate[];
  inside: InsideSignals;
  outside: OutsideHelperActivity;
  protocols: ProtocolHealth[];
  release: ReleaseHealth;
  helperNodes: HelperNode[];
  flows: ConnectionFlow[];
  activity: ActivityItem[];
};
