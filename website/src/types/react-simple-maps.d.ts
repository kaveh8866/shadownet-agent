declare module "react-simple-maps" {
  import * as React from "react";

  export const ComposableMap: React.ComponentType<Record<string, unknown>>;
  export const ZoomableGroup: React.ComponentType<Record<string, unknown>>;
  export const Geographies: React.ComponentType<Record<string, unknown>>;
  export const Geography: React.ComponentType<Record<string, unknown>>;
  export const Marker: React.ComponentType<Record<string, unknown>>;
  export const Annotation: React.ComponentType<Record<string, unknown>>;
  export const Line: React.ComponentType<Record<string, unknown>>;
}

