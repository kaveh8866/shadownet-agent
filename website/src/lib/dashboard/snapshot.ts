import type { DashboardSnapshot, DashboardView } from "./types";
import { buildDemoSnapshot } from "./demo";

export type SnapshotMode = "demo";

export const resolveSnapshot = async (opts: {
  view: DashboardView;
  mode?: SnapshotMode;
  privacyThreshold?: number;
}): Promise<DashboardSnapshot> => {
  const mode = opts.mode ?? "demo";
  const privacyThreshold = opts.privacyThreshold ?? 20;

  if (mode === "demo") {
    return buildDemoSnapshot(opts.view, privacyThreshold);
  }

  return buildDemoSnapshot(opts.view, privacyThreshold);
};
