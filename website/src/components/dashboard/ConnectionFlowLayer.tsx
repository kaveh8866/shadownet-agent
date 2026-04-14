"use client";

import { Line } from "react-simple-maps";
import type { ConnectionFlow } from "../../lib/dashboard/types";

export const ConnectionFlowLayer = ({
  flows,
  enabled,
}: {
  flows: ConnectionFlow[];
  enabled: boolean;
}) => {
  if (!enabled) return null;
  return (
    <>
      {flows.map((f) => (
        <Line
          key={f.id}
          from={f.from}
          to={f.to}
          stroke="rgba(59,130,246,0.55)"
          strokeWidth={1 + Math.round(f.intensity * 2)}
          strokeLinecap="round"
          strokeDasharray="4 6"
        />
      ))}
    </>
  );
};

