"use client";

import { useEffect, useState } from "react";

function diff(target: number) {
  const ms = Math.max(0, target - Date.now());
  return {
    done: ms === 0,
    d: Math.floor(ms / 86400000),
    h: Math.floor((ms % 86400000) / 3600000),
    m: Math.floor((ms % 3600000) / 60000),
    s: Math.floor((ms % 60000) / 1000),
  };
}

export default function Countdown({ targetISO }: { targetISO: string }) {
  const target = new Date(targetISO).getTime();
  const [t, setT] = useState<ReturnType<typeof diff> | null>(null);

  useEffect(() => {
    setT(diff(target));
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const cells: [number, string][] = t
    ? [
        [t.d, "días"],
        [t.h, "hrs"],
        [t.m, "min"],
        [t.s, "seg"],
      ]
    : [
        [0, "días"],
        [0, "hrs"],
        [0, "min"],
        [0, "seg"],
      ];

  return (
    <div className="count-cells" suppressHydrationWarning>
      {cells.map(([v, l]) => (
        <div key={l} className="count-cell">
          <div className="count-num">{String(v).padStart(2, "0")}</div>
          <div className="count-label">{l}</div>
        </div>
      ))}
    </div>
  );
}
