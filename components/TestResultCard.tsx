"use client";

import { useState } from "react";
import type { Team } from "@/lib/teams";

// Resultado del test de personalidad (equipo "sugerido"), separado del equipo
// final tras el balanceo. Desplegable: cerrado por defecto.
export default function TestResultCard({
  team,
  matched,
}: {
  team: Team;
  matched: boolean;
}) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <div className="nw-card" style={{ padding: 16, width: "100%", textAlign: "center" }}>
        <div className="nw-bubble-font" style={{ fontSize: 15.5, color: "var(--nw-violet)", marginBottom: 10 }}>
          🔮 ¿quieres conocer tu resultado del test?
        </div>
        <button type="button" className="nw-btn" onClick={() => setOpen(true)}>
          descubrir
        </button>
      </div>
    );
  }

  return (
    <div
      className="nw-card glossy"
      style={{ padding: 16, width: "100%", textAlign: "center", boxShadow: `0 0 0 2px ${team.color}, 0 8px 20px rgba(120,30,130,.2)` }}
    >
      <div className="nw-bubble-font" style={{ fontSize: 13.5, color: "var(--nw-ink-soft)", marginBottom: 6 }}>
        {matched ? "tu test acertó de pleno ✨" : "🌀 el test decía…"}
      </div>
      <div style={{ fontSize: 40, lineHeight: 1 }}>{team.emoji}</div>
      <div className="nw-bubble-font" style={{ fontSize: 20, color: team.color, marginTop: 2, marginBottom: 12 }}>
        {team.name}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
        {team.traits.map((trait) => (
          <span key={trait} className="nw-chip">
            {trait}
          </span>
        ))}
      </div>
    </div>
  );
}
