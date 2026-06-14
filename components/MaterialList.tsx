"use client";

import { useState, useTransition } from "react";
import {
  MATERIAL_GENERAL,
  MATERIAL_PER_GAME,
  FIXED_GAMES,
  VOTE_GAMES,
  type MaterialItemId,
} from "@/config/games";
import { toggleVolunteerAction } from "@/app/actions";
import type { MaterialVolunteers } from "@/lib/material";
import { ModuleHead } from "@/components/nw";

const ALL_GAMES = [...FIXED_GAMES, ...VOTE_GAMES];
const gameById = (id: string) => ALL_GAMES.find((g) => g.id === id);

export default function MaterialList({
  initial,
  myId,
}: {
  initial: MaterialVolunteers;
  myId: string;
}) {
  const [state, setState] = useState<MaterialVolunteers>(initial);
  const [pending, startTransition] = useTransition();

  const toggle = (itemId: MaterialItemId) => {
    startTransition(async () => {
      const res = await toggleVolunteerAction(itemId);
      if (res.ok) setState(res.state);
    });
  };

  return (
    <main className="nw-main nw-stack">
      <div className="nw-card glossy" style={{ padding: 16 }}>
        <ModuleHead icon="🎒">material del cumple</ModuleHead>
        <div className="nw-bubble-font" style={{ fontSize: 13, color: "var(--nw-ink-soft)" }}>
          apúntate a traer el material común. ¡pueden apuntarse varias personas al mismo!
        </div>
      </div>

      {/* Material común — apuntable */}
      <div className="nw-card" style={{ padding: 14 }}>
        <ModuleHead icon="✦">material común</ModuleHead>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {MATERIAL_GENERAL.map((item) => {
            const people = state[item.id] ?? [];
            const mine = people.some((v) => v.id === myId);
            return (
              <div key={item.id} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                  <span className="nw-bubble-font" style={{ fontSize: 14 }}>
                    {item.emoji} {item.label}
                  </span>
                  <button
                    className={mine ? "nw-btn" : "nw-btn ghost"}
                    disabled={pending}
                    onClick={() => toggle(item.id)}
                    style={{ fontSize: 12, padding: "6px 12px", whiteSpace: "nowrap" }}
                  >
                    {mine ? "quitarme" : "apuntarme"}
                  </button>
                </div>
                <div className="nw-bubble-font" style={{ fontSize: 12, color: "var(--nw-ink-soft)" }}>
                  {people.length === 0
                    ? "nadie aún"
                    : people.map((v) => v.name).join(", ")}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Material por juego — informativo */}
      <div className="nw-card" style={{ padding: 14 }}>
        <ModuleHead icon="📋">por juego (lo trae la organización)</ModuleHead>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {MATERIAL_PER_GAME.map((m) => {
            const game = gameById(m.gameId);
            return (
              <div key={m.gameId}>
                <div className="nw-bubble-font" style={{ fontSize: 14, color: "var(--nw-violet)" }}>
                  {game?.emoji} {game?.name}
                  {m.note ? (
                    <span style={{ color: "var(--nw-ink-soft)", fontSize: 12 }}> · {m.note}</span>
                  ) : null}
                </div>
                <div className="nw-bubble-font" style={{ fontSize: 13, color: "var(--nw-ink-soft)" }}>
                  {m.items.join(" · ")}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
