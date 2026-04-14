import type { DashboardSnapshot, DashboardView } from "./types";

export type SnapshotFetchConfig = {
  view: DashboardView;
  privacyThreshold: number;
  snapshotBaseUrl?: string;
};

export const buildDashboardUrl = (base: string, view: DashboardView, privacyThreshold: number) => {
  if (!base) return "";
  const replaced = base.includes("{view}") ? base.replaceAll("{view}", view) : base;
  const url = new URL(replaced, replaced.startsWith("http") ? undefined : window.location.origin);
  if (!url.searchParams.has("view")) url.searchParams.set("view", view);
  if (!url.searchParams.has("privacyThreshold")) url.searchParams.set("privacyThreshold", `${privacyThreshold}`);
  return url.toString();
};

const shallowValidateSnapshot = (v: unknown): v is DashboardSnapshot => {
  if (!v || typeof v !== "object") return false;
  const x = v as DashboardSnapshot;
  if (x.version !== 1) return false;
  if (!x.view) return false;
  if (!Array.isArray(x.regions)) return false;
  if (!Array.isArray(x.protocols)) return false;
  if (!Array.isArray(x.helperNodes)) return false;
  if (!Array.isArray(x.flows)) return false;
  if (!Array.isArray(x.activity)) return false;
  return true;
};

export const fetchDashboardSnapshot = async (
  cfg: SnapshotFetchConfig,
  signal?: AbortSignal,
): Promise<DashboardSnapshot> => {
  const base = cfg.snapshotBaseUrl ?? "";
  const url = buildDashboardUrl(base, cfg.view, cfg.privacyThreshold);
  if (!url) throw new Error("snapshot url not configured");
  const res = await fetch(url, { method: "GET", cache: "no-store", signal });
  if (!res.ok) throw new Error(`snapshot fetch failed: ${res.status}`);
  const json = (await res.json()) as unknown;
  if (!shallowValidateSnapshot(json)) throw new Error("snapshot schema mismatch");
  return json;
};

export const connectDashboardStream = (cfg: {
  streamBaseUrl: string;
  view: DashboardView;
  privacyThreshold: number;
  onSnapshot: (snap: DashboardSnapshot) => void;
  onError: () => void;
}) => {
  const url = buildDashboardUrl(cfg.streamBaseUrl, cfg.view, cfg.privacyThreshold);
  const es = new EventSource(url);
  es.addEventListener("snapshot", (evt) => {
    const data = (evt as MessageEvent).data;
    try {
      const json = JSON.parse(data) as unknown;
      if (!shallowValidateSnapshot(json)) return;
      cfg.onSnapshot(json);
    } catch {
    }
  });
  es.onerror = () => cfg.onError();
  return es;
};

