"use client";

import { useState, useTransition } from "react";
import { MATERIAL_GROUPS, type MaterialItemId } from "@/config/games";
import { toggleVolunteerAction } from "@/app/actions";
import type { MaterialVolunteers } from "@/lib/material";
import { ModuleHead } from "@/components/nw";

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
          apúntate a traer lo que puedas. ¡pueden apuntarse varias personas al mismo!
        </div>
      </div>

      {MATERIAL_GROUPS.map((group) => (
        <div key={group.title} className="nw-card" style={{ padding: 14 }}>
          <ModuleHead icon={group.emoji}>
            {group.title}
            {group.note ? (
              <span style={{ color: "var(--nw-ink-soft)", fontSize: 12, fontWeight: 400 }}> · {group.note}</span>
            ) : null}
          </ModuleHead>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {group.items.map((item) => {
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
                    {people.length === 0 ? "nadie aún" : people.map((v) => v.name).join(", ")}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </main>
  );
}
