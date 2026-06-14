"use client";

import { useState, useTransition } from "react";
import { MATERIAL_GROUPS, type MaterialItem, type MaterialItemId } from "@/config/games";
import { setVolunteerAction } from "@/app/actions";
import type { MaterialVolunteers, Volunteer } from "@/lib/material";
import { ModuleHead } from "@/components/nw";

function ItemRow({
  item,
  people,
  myId,
  pending,
  onSet,
}: {
  item: MaterialItem;
  people: Volunteer[];
  myId: string;
  pending: boolean;
  onSet: (itemId: MaterialItemId, qty: number) => void;
}) {
  const mine = people.find((v) => v.id === myId);
  const [qty, setQty] = useState(mine?.qty ?? 1);
  const total = people.reduce((s, v) => s + v.qty, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <span className="nw-bubble-font" style={{ fontSize: 14 }}>
          {item.emoji} {item.label}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            className="nw-input"
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Math.floor(Number(e.target.value) || 1)))}
            aria-label={`cantidad de ${item.label}`}
            style={{ width: 52, padding: "5px 6px", textAlign: "center", fontSize: 13 }}
          />
          <button
            className="nw-btn"
            disabled={pending}
            onClick={() => onSet(item.id, qty)}
            style={{ fontSize: 12, padding: "6px 12px", whiteSpace: "nowrap" }}
          >
            {mine ? "actualizar" : "apuntarme"}
          </button>
          {mine && (
            <button
              className="nw-btn ghost"
              disabled={pending}
              onClick={() => onSet(item.id, 0)}
              style={{ fontSize: 12, padding: "6px 10px", whiteSpace: "nowrap" }}
            >
              quitarme
            </button>
          )}
        </div>
      </div>
      <div className="nw-bubble-font" style={{ fontSize: 12, color: "var(--nw-ink-soft)" }}>
        {people.length === 0
          ? "nadie aún"
          : `${people.map((v) => `${v.name} ×${v.qty}`).join(", ")}  ·  total: ${total}`}
      </div>
    </div>
  );
}

export default function MaterialList({
  initial,
  myId,
}: {
  initial: MaterialVolunteers;
  myId: string;
}) {
  const [state, setState] = useState<MaterialVolunteers>(initial);
  const [pending, startTransition] = useTransition();

  const onSet = (itemId: MaterialItemId, qty: number) => {
    startTransition(async () => {
      const res = await setVolunteerAction(itemId, qty);
      if (res.ok) setState(res.state);
    });
  };

  return (
    <main className="nw-main nw-stack">
      <div className="nw-card glossy" style={{ padding: 16 }}>
        <ModuleHead icon="🎒">material del cumple</ModuleHead>
        <div className="nw-bubble-font" style={{ fontSize: 13, color: "var(--nw-ink-soft)" }}>
          apúntate e indica cuánto traes. ¡pueden apuntarse varias personas al mismo!
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
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {group.items.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                people={state[item.id] ?? []}
                myId={myId}
                pending={pending}
                onSet={onSet}
              />
            ))}
          </div>
        </div>
      ))}
    </main>
  );
}
