"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { FIXED_GAMES, VOTE_GAMES, type VoteGameId } from "@/config/games";
import { castVoteAction } from "@/app/actions";
import type { VoteState } from "@/lib/votes";
import { Title, Sparkle, Bubble, Butterfly, LavaLamp, ModuleHead } from "@/components/nw";

type Slide =
  | { kind: "intro" }
  | { kind: "game"; index: number }
  | { kind: "vote" }
  | { kind: "outro" };

function buildSlides(): Slide[] {
  return [
    { kind: "intro" },
    ...FIXED_GAMES.map((_, index) => ({ kind: "game" as const, index })),
    { kind: "vote" },
    { kind: "outro" },
  ];
}

export default function Stories({ initialVote }: { initialVote: VoteState }) {
  const slides = buildSlides();
  const [i, setI] = useState(0);
  const [vote, setVote] = useState<VoteState>(initialVote);
  const [, startTransition] = useTransition();

  const slide = slides[i];
  const atStart = i === 0;
  const atEnd = i === slides.length - 1;

  const next = () => setI((n) => Math.min(n + 1, slides.length - 1));
  const prev = () => setI((n) => Math.max(n - 1, 0));

  // En el slide de voto no avanzamos al tocar la mitad derecha (los botones mandan).
  const onTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if (slide.kind === "vote") return;
    const x = e.clientX - e.currentTarget.getBoundingClientRect().left;
    if (x < e.currentTarget.clientWidth / 2) prev();
    else next();
  };

  const submitVote = (gameId: VoteGameId) => {
    startTransition(async () => {
      const res = await castVoteAction(gameId);
      if (res.ok) setVote(res.state);
    });
  };

  const totalVotes = VOTE_GAMES.reduce((sum, g) => sum + vote.counts[g.id], 0);

  return (
    <div
      onClick={onTap}
      style={{
        position: "fixed",
        inset: 0,
        background: "linear-gradient(160deg,#2a0a4a,#4b1d7a 55%,#1b0636)",
        display: "flex",
        flexDirection: "column",
        zIndex: 50,
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      {/* Barra de progreso */}
      <div style={{ display: "flex", gap: 4, padding: "10px 12px 4px" }}>
        {slides.map((_, idx) => (
          <div
            key={idx}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              background: idx <= i ? "var(--nw-pink, #ff7ad9)" : "rgba(255,255,255,0.25)",
            }}
          />
        ))}
      </div>

      {/* Botón cerrar */}
      <Link
        href="/"
        onClick={(e) => e.stopPropagation()}
        className="nw-chip"
        style={{ position: "absolute", top: 26, right: 12, zIndex: 60, fontSize: 11, padding: "4px 10px" }}
      >
        cerrar ✕
      </Link>

      {/* Decoración Y2K */}
      <Butterfly size={64} style={{ top: 60, left: 8 }} />
      <Bubble size={36} style={{ top: 120, right: 16 }} dur={8} />
      <Sparkle size={22} style={{ bottom: 120, left: 20 }} />
      <LavaLamp h={110} style={{ bottom: 8, right: 6 }} />

      {/* Contenido del slide */}
      <div
        className="nw-center"
        style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 16, padding: "0 24px", textAlign: "center", position: "relative", zIndex: 55 }}
      >
        {slide.kind === "intro" && (
          <>
            <Title size={20} kind="chrome" style={{ marginBottom: -6 }}>
              disney channel games
            </Title>
            <Title size={44}>las pruebas</Title>
            <div className="nw-bubble-font nw-white" style={{ fontSize: 15 }}>
              6 juegos te esperan el 27 de junio.
              <br />
              desliza para descubrirlos ✦
            </div>
          </>
        )}

        {slide.kind === "game" && (
          <>
            <div style={{ fontSize: 56 }}>{FIXED_GAMES[slide.index].emoji}</div>
            <Title size={34}>{FIXED_GAMES[slide.index].name}</Title>
            <div className="nw-bubble-font" style={{ fontSize: 15, color: "var(--nw-pink)" }}>
              {FIXED_GAMES[slide.index].hook}
            </div>
            <div className="nw-bubble-font nw-white" style={{ fontSize: 14, lineHeight: 1.4 }}>
              {FIXED_GAMES[slide.index].summary}
            </div>
          </>
        )}

        {slide.kind === "vote" && (
          <>
            <ModuleHead icon="🗳">tú decides el último juego</ModuleHead>
            <div className="nw-bubble-font nw-white" style={{ fontSize: 14 }}>
              ¿cuál prefieres que juguemos?
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {VOTE_GAMES.map((g) => {
                const count = vote.counts[g.id];
                const pct = totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100);
                const mine = vote.myVote === g.id;
                return (
                  <button
                    key={g.id}
                    className={mine ? "nw-btn block" : "nw-btn ghost block"}
                    onClick={(e) => {
                      e.stopPropagation();
                      submitVote(g.id);
                    }}
                    style={{ position: "relative", overflow: "hidden", textAlign: "left", padding: "12px 14px" }}
                  >
                    {vote.myVote && (
                      <span
                        aria-hidden
                        style={{ position: "absolute", inset: 0, width: `${pct}%`, background: "rgba(255,122,217,0.35)", transition: "width .4s ease" }}
                      />
                    )}
                    <span style={{ position: "relative", display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <span>
                        {g.emoji} {g.name}
                      </span>
                      {vote.myVote && <span>{pct}%</span>}
                    </span>
                  </button>
                );
              })}
            </div>
            {vote.myVote ? (
              <div className="nw-bubble-font" style={{ fontSize: 12, color: "var(--nw-ink-soft)" }}>
                {totalVotes} voto{totalVotes === 1 ? "" : "s"} · puedes cambiarlo · toca la flecha →
              </div>
            ) : (
              <div className="nw-bubble-font" style={{ fontSize: 12, color: "var(--nw-ink-soft)" }}>
                vota para ver los resultados
              </div>
            )}
            <button
              className="nw-chip"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              style={{ alignSelf: "center", fontSize: 12 }}
            >
              siguiente →
            </button>
          </>
        )}

        {slide.kind === "outro" && (
          <>
            <div style={{ fontSize: 56 }}>🎒</div>
            <Title size={34}>¡prepárate!</Title>
            <div className="nw-bubble-font nw-white" style={{ fontSize: 15, lineHeight: 1.4 }}>
              mira el material que hace falta y apúntate a traer lo que puedas.
            </div>
            <Link
              href="/material"
              onClick={(e) => e.stopPropagation()}
              className="nw-btn"
              style={{ fontSize: 15, padding: "10px 18px" }}
            >
              ver el material ✦
            </Link>
            <Link
              href="/"
              onClick={(e) => e.stopPropagation()}
              className="nw-bubble-font"
              style={{ fontSize: 12, color: "var(--nw-ink-soft)" }}
            >
              volver al inicio
            </Link>
          </>
        )}
      </div>

      {/* Pistas de navegación */}
      <div className="nw-bubble-font" style={{ textAlign: "center", paddingBottom: 14, fontSize: 11, color: "rgba(255,255,255,0.6)", position: "relative", zIndex: 55 }}>
        {atStart ? "toca la derecha para empezar →" : atEnd ? "fin ✦" : "‹ atrás · siguiente ›"}
      </div>
    </div>
  );
}
