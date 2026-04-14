import type { DashboardSnapshot, DashboardView } from "./types";
import { buildDemoSnapshot } from "./demo";

export const buildMockSnapshot = (view: DashboardView, privacyThreshold = 20): DashboardSnapshot =>
  buildDemoSnapshot(view, privacyThreshold);

