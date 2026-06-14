# Stories de juegos, votación y material — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir una experiencia tipo *stories* (tap-through, estética Y2K) que presenta las pruebas del cumple, con una votación en vivo entre dos juegos y una pantalla de material donde la gente se apunta a traer el material común.

**Architecture:** Contenido estático en `config/games.ts`. Lógica de datos en `lib/votes.ts` y `lib/material.ts` sobre la interfaz `DB` existente (solo `sadd`/`srem`/`smembers`, sin tocar `lib/redis.ts`). Server actions en `app/actions.ts`. UI en dos rutas server (`/juegos`, `/material`) que renderizan componentes cliente (`Stories.tsx`, `MaterialList.tsx`). Entrada desde una tarjeta fijada en el feed de la home.

**Tech Stack:** Next.js 16 (App Router, RSC, server actions), React 19, TypeScript, Upstash Redis (con mock en memoria en dev), `node:test` vía `tsx` para los unit tests de la lógica pura.

---

## Convenciones del proyecto (leer antes de empezar)

- Verificación estándar: `make check` (lint + `tsc --noEmit` + build). Tras este plan también `pnpm test`.
- Componentes cliente: `"use client"`, `useState`/`useTransition`, llaman a server actions importadas de `@/app/actions`, reutilizan decoraciones de `@/components/nw` (`Title`, `Sparkle`, `Bubble`, `Butterfly`, `LavaLamp`, `Avatar`, `ModuleHead`, etc.) y clases CSS `nw-*` de `app/globals.css`.
- Rutas: `app/<ruta>/page.tsx`, server component con `export const dynamic = "force-dynamic"`, redirige a `/` si no hay participante.
- Módulos `lib/*`: usan `getDB()` de `@/lib/redis` con prefijos de clave fijos.
- Server actions: `app/actions.ts` empieza con `"use server"`; obtienen el participante con `getCurrentParticipant()`; devuelven objetos `{ ok, ... }`.
- El mock DB (`usingMockDB`, cuando no hay env de Upstash) guarda los sets en `globalThis`; en los tests persiste durante todo el proceso, por eso cada test limpia sus claves con `db.del(...)`.

---

## File Structure

- Create: `config/games.ts` — datos estáticos (juegos fijos, juegos a votar, material).
- Create: `lib/votes.ts` — estado y registro de la votación.
- Create: `lib/votes.test.ts` — tests de `lib/votes.ts`.
- Create: `lib/material.ts` — voluntarios del material común.
- Create: `lib/material.test.ts` — tests de `lib/material.ts`.
- Modify: `app/actions.ts` — añadir `castVoteAction`, `toggleVolunteerAction`.
- Create: `components/Stories.tsx` — stories tap-through con slide de voto.
- Create: `app/juegos/page.tsx` — ruta de las stories.
- Create: `components/MaterialList.tsx` — lista de material común con toggle.
- Create: `app/material/page.tsx` — ruta de material.
- Modify: `app/page.tsx` — tarjeta fijada en "novedades" que enlaza a `/juegos`.
- Modify: `package.json` — devDep `tsx` + script `test`.
- Modify: `Makefile` — target `test`.

---

## Task 1: Infraestructura de tests

**Files:**
- Modify: `package.json`
- Modify: `Makefile`

- [ ] **Step 1: Añadir `tsx` como devDependency**

Run: `pnpm add -D tsx`
Expected: `tsx` aparece en `devDependencies` de `package.json`.

- [ ] **Step 2: Añadir el script `test` a `package.json`**

En `package.json`, dentro de `"scripts"`, añadir tras `"lint": "eslint"`:

```json
    "test": "node --import tsx --test \"lib/**/*.test.ts\""
```

- [ ] **Step 3: Añadir el target `test` al `Makefile`**

Tras el target `lint:` añadir:

```makefile
test: ## Pasa los unit tests
	pnpm test
```

- [ ] **Step 4: Verificar que el runner arranca (sin tests aún)**

Run: `pnpm test`
Expected: el comando se ejecuta sin error de configuración. Como aún no hay ficheros `*.test.ts`, node imprime que no encontró tests (exit 0 o aviso "no test files"). No debe fallar por `tsx` no encontrado.

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml Makefile
git commit -m "chore: añadir runner de tests (tsx + node:test)"
```

---

## Task 2: Contenido estático de los juegos y material

**Files:**
- Create: `config/games.ts`
- Test: `config/games.test.ts`

- [ ] **Step 1: Escribir el test que falla**

Create `config/games.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  FIXED_GAMES,
  VOTE_GAMES,
  MATERIAL_GENERAL,
  MATERIAL_PER_GAME,
} from "./games";

test("hay 6 juegos fijos con ids únicos", () => {
  assert.equal(FIXED_GAMES.length, 6);
  const ids = FIXED_GAMES.map((g) => g.id);
  assert.equal(new Set(ids).size, 6);
});

test("hay exactamente 2 juegos a votar", () => {
  assert.equal(VOTE_GAMES.length, 2);
  const ids = VOTE_GAMES.map((g) => g.id);
  assert.deepEqual(ids, ["roba-vidas", "operacion-esponja"]);
});

test("cada juego tiene emoji, name, hook y summary no vacíos", () => {
  for (const g of [...FIXED_GAMES, ...VOTE_GAMES]) {
    for (const field of ["emoji", "name", "hook", "summary"] as const) {
      assert.ok(g[field].length > 0, `${g.id}.${field} vacío`);
    }
  }
});

test("el material general tiene ids únicos y no está vacío", () => {
  assert.ok(MATERIAL_GENERAL.length > 0);
  const ids = MATERIAL_GENERAL.map((m) => m.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("hay material por juego para cada juego fijo y para los votables", () => {
  for (const g of [...FIXED_GAMES, ...VOTE_GAMES]) {
    assert.ok(
      MATERIAL_PER_GAME.some((m) => m.gameId === g.id),
      `falta material para ${g.id}`,
    );
  }
});
```

- [ ] **Step 2: Ejecutar el test para verle fallar**

Run: `pnpm test`
Expected: FAIL — `Cannot find module './games'` (o similar).

- [ ] **Step 3: Crear `config/games.ts`**

```ts
// Contenido estático de las pruebas del cumple y el material necesario.
// Sigue el patrón de config/quiz-questions.ts y config/team-test.ts.

export interface Game {
  id: string;
  emoji: string;
  name: string;
  hook: string; // frase de gancho
  summary: string; // cómo se juega, en breve
}

export const FIXED_GAMES = [
  {
    id: "toallas",
    emoji: "🏖",
    name: "Juego de las Toallas",
    hook: "¡La música suena y la carrera comienza!",
    summary:
      "Sillas musicales con toallas: cuando para la música, corre a por una. Cada ronda desaparece una toalla y alguien queda eliminado.",
  },
  {
    id: "trivial-splash",
    emoji: "💦",
    name: "Trivial Splash",
    hook: "Rapidez, conocimiento y puntería.",
    summary:
      "Duelos 1 vs 1 de cultura general cara a cara. Quien falla o responde tarde queda eliminado… ¡y acaba empapado!",
  },
  {
    id: "relevo-acuatico",
    emoji: "🥄🌊",
    name: "Relevo Acuático",
    hook: "¿Tienes buen pulso?",
    summary:
      "En fila, de la arena al agua, pasa una pelota de ping pong sobre una cuchara sujeta con la boca, sin tocarla con las manos.",
  },
  {
    id: "conexion",
    emoji: "🔗",
    name: "Conexión",
    hook: "¿Conectaréis vuestras ideas a tiempo?",
    summary:
      "Dos compañeros construyen una frase diciendo una palabra cada uno, por turnos, para que un tercero adivine la palabra secreta.",
  },
  {
    id: "al-vaso",
    emoji: "🥤",
    name: "¡Al Vaso!",
    hook: "Simón dice… ¡y reflejos!",
    summary:
      "Haz solo lo que diga 'Simón dice'. Cuando grite 'Simón dice: ¡Al vaso!', coge el vaso del centro antes que el rival.",
  },
  {
    id: "tres-en-raya",
    emoji: "❌⭕",
    name: "Tres en Raya Relay",
    hook: "Velocidad, estrategia y trabajo en equipo.",
    summary:
      "Relevo a un tablero gigante en la arena: coloca y mueve tus petos para formar una línea de tres antes que el equipo rival.",
  },
] as const satisfies readonly Game[];

export const VOTE_GAMES = [
  {
    id: "roba-vidas",
    emoji: "🎽",
    name: "Roba Vidas",
    hook: "Protege tus vidas… y roba las del rival.",
    summary:
      "Cada jugador lleva dos vidas (cintas). Róbale las suyas al equipo contrario mientras proteges las tuyas. Gana quien conserve más.",
  },
  {
    id: "operacion-esponja",
    emoji: "🧽",
    name: "Operación Esponja",
    hook: "Velocidad, coordinación y mucha agua.",
    summary:
      "Relevo transportando agua solo con una esponja para llenar el cubo de tu equipo antes que el rival.",
  },
] as const satisfies readonly Game[];

export type FixedGameId = (typeof FIXED_GAMES)[number]["id"];
export type VoteGameId = (typeof VOTE_GAMES)[number]["id"];

export interface MaterialItem {
  id: string;
  emoji: string;
  label: string;
}

// Material común: la gente puede apuntarse a traerlo.
export const MATERIAL_GENERAL = [
  { id: "altavoz", emoji: "🔊", label: "1 altavoz portátil" },
  { id: "movil", emoji: "📱", label: "1 móvil con música y cronómetro" },
  { id: "libreta", emoji: "📒", label: "1 libreta" },
  { id: "bolis", emoji: "🖊", label: "2 bolígrafos" },
  { id: "silbato", emoji: "📣", label: "1 silbato (opcional)" },
  { id: "conos", emoji: "🚩", label: "4 conos o marcas" },
] as const satisfies readonly MaterialItem[];

export type MaterialItemId = (typeof MATERIAL_GENERAL)[number]["id"];

// Material por juego: solo informativo (lo trae la organización).
export interface MaterialPerGame {
  gameId: FixedGameId | VoteGameId;
  items: string[];
  note?: string;
}

export const MATERIAL_PER_GAME: readonly MaterialPerGame[] = [
  { gameId: "toallas", items: ["6-8 toallas"] },
  {
    gameId: "trivial-splash",
    items: ["1-2 pistolas de agua", "50-100 preguntas preparadas", "2 toallas para los duelistas"],
  },
  {
    gameId: "relevo-acuatico",
    items: ["14 cucharas (+1-2 extra)", "2 pelotas de ping pong (+2 de reserva)"],
  },
  { gameId: "conexion", items: ["30-40 papelitos o tarjetas", "1 rotulador"] },
  { gameId: "al-vaso", items: ["1 vaso resistente"] },
  { gameId: "tres-en-raya", items: ["6 petos (3 por equipo)"] },
  { gameId: "roba-vidas", items: ["28 cintas o pañuelos (14 por equipo)"], note: "si sale elegido" },
  { gameId: "operacion-esponja", items: ["4 cubos", "2 esponjas grandes"], note: "si sale elegido" },
];
```

- [ ] **Step 4: Ejecutar los tests para verlos pasar**

Run: `pnpm test`
Expected: PASS — los 5 tests de `config/games.test.ts` en verde.

- [ ] **Step 5: Commit**

```bash
git add config/games.ts config/games.test.ts
git commit -m "feat: contenido estático de juegos y material"
```

---

## Task 3: Lógica de votación (`lib/votes.ts`)

**Files:**
- Create: `lib/votes.ts`
- Test: `lib/votes.test.ts`

- [ ] **Step 1: Escribir el test que falla**

Create `lib/votes.test.ts`:

```ts
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { getDB } from "@/lib/redis";
import { getVoteState, castVote, isVoteGameId } from "@/lib/votes";

beforeEach(async () => {
  // El mock DB persiste en el proceso: limpiamos los sets de votos.
  await getDB().del("vote:roba-vidas", "vote:operacion-esponja");
});

test("estado inicial: sin votos y sin voto propio", async () => {
  const state = await getVoteState("ana");
  assert.deepEqual(state.counts, { "roba-vidas": 0, "operacion-esponja": 0 });
  assert.equal(state.myVote, null);
});

test("votar cuenta el voto y fija myVote", async () => {
  const state = await castVote("ana", "roba-vidas");
  assert.equal(state.counts["roba-vidas"], 1);
  assert.equal(state.counts["operacion-esponja"], 0);
  assert.equal(state.myVote, "roba-vidas");
});

test("votar dos veces el mismo juego no duplica", async () => {
  await castVote("ana", "roba-vidas");
  const state = await castVote("ana", "roba-vidas");
  assert.equal(state.counts["roba-vidas"], 1);
});

test("cambiar el voto lo mueve de juego sin duplicar", async () => {
  await castVote("ana", "roba-vidas");
  const state = await castVote("ana", "operacion-esponja");
  assert.equal(state.counts["roba-vidas"], 0);
  assert.equal(state.counts["operacion-esponja"], 1);
  assert.equal(state.myVote, "operacion-esponja");
});

test("varios participantes suman", async () => {
  await castVote("ana", "roba-vidas");
  await castVote("luis", "roba-vidas");
  const state = await getVoteState("otro");
  assert.equal(state.counts["roba-vidas"], 2);
  assert.equal(state.myVote, null);
});

test("isVoteGameId valida contra la config", () => {
  assert.equal(isVoteGameId("roba-vidas"), true);
  assert.equal(isVoteGameId("toallas"), false);
});
```

- [ ] **Step 2: Ejecutar el test para verle fallar**

Run: `pnpm test`
Expected: FAIL — `Cannot find module '@/lib/votes'`.

- [ ] **Step 3: Crear `lib/votes.ts`**

```ts
import { getDB } from "@/lib/redis";
import { VOTE_GAMES, type VoteGameId } from "@/config/games";

const voteKey = (id: VoteGameId) => `vote:${id}`;

export interface VoteState {
  counts: Record<VoteGameId, number>;
  myVote: VoteGameId | null;
}

export function isVoteGameId(id: string): id is VoteGameId {
  return VOTE_GAMES.some((g) => g.id === id);
}

/** Recuentos de cada opción y el voto del participante (derivado de los sets). */
export async function getVoteState(participantId: string): Promise<VoteState> {
  const db = getDB();
  const counts = {} as Record<VoteGameId, number>;
  let myVote: VoteGameId | null = null;
  for (const g of VOTE_GAMES) {
    const members = await db.smembers(voteKey(g.id));
    counts[g.id] = members.length;
    if (members.includes(participantId)) myVote = g.id;
  }
  return { counts, myVote };
}

/** Registra (o cambia) el voto del participante y devuelve el estado actualizado. */
export async function castVote(
  participantId: string,
  gameId: VoteGameId,
): Promise<VoteState> {
  const db = getDB();
  for (const g of VOTE_GAMES) {
    if (g.id !== gameId) await db.srem(voteKey(g.id), participantId);
  }
  await db.sadd(voteKey(gameId), participantId);
  return getVoteState(participantId);
}
```

- [ ] **Step 4: Ejecutar los tests para verlos pasar**

Run: `pnpm test`
Expected: PASS — los tests de `lib/votes.test.ts` en verde.

- [ ] **Step 5: Commit**

```bash
git add lib/votes.ts lib/votes.test.ts
git commit -m "feat: lógica de votación de juegos"
```

---

## Task 4: Lógica de material (`lib/material.ts`)

**Files:**
- Create: `lib/material.ts`
- Test: `lib/material.test.ts`

- [ ] **Step 1: Escribir el test que falla**

Create `lib/material.test.ts`:

```ts
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { getDB } from "@/lib/redis";
import { MATERIAL_GENERAL } from "@/config/games";
import { getMaterialState, toggleVolunteer, isMaterialItemId } from "@/lib/material";

beforeEach(async () => {
  await getDB().del(...MATERIAL_GENERAL.map((m) => `material:${m.id}`));
});

test("estado inicial: ningún voluntario en ningún ítem", async () => {
  const state = await getMaterialState();
  for (const m of MATERIAL_GENERAL) {
    assert.deepEqual(state[m.id], []);
  }
});

test("apuntarse añade al participante (nombre cae al id si no existe)", async () => {
  const state = await toggleVolunteer("ana", "altavoz");
  assert.deepEqual(state["altavoz"], [{ id: "ana", name: "ana" }]);
});

test("apuntarse de nuevo (toggle) elimina al participante", async () => {
  await toggleVolunteer("ana", "altavoz");
  const state = await toggleVolunteer("ana", "altavoz");
  assert.deepEqual(state["altavoz"], []);
});

test("varios pueden apuntarse al mismo ítem (lista abierta)", async () => {
  await toggleVolunteer("ana", "conos");
  const state = await toggleVolunteer("luis", "conos");
  const ids = state["conos"].map((v) => v.id).sort();
  assert.deepEqual(ids, ["ana", "luis"]);
});

test("isMaterialItemId valida contra la config", () => {
  assert.equal(isMaterialItemId("altavoz"), true);
  assert.equal(isMaterialItemId("toallas"), false);
});
```

- [ ] **Step 2: Ejecutar el test para verle fallar**

Run: `pnpm test`
Expected: FAIL — `Cannot find module '@/lib/material'`.

- [ ] **Step 3: Crear `lib/material.ts`**

```ts
import { getDB } from "@/lib/redis";
import { MATERIAL_GENERAL, type MaterialItemId } from "@/config/games";
import { getParticipant } from "@/lib/participants";

const matKey = (id: MaterialItemId) => `material:${id}`;

export interface Volunteer {
  id: string;
  name: string;
}

export type MaterialVolunteers = Record<MaterialItemId, Volunteer[]>;

export function isMaterialItemId(id: string): id is MaterialItemId {
  return MATERIAL_GENERAL.some((m) => m.id === id);
}

async function volunteersFor(itemId: MaterialItemId): Promise<Volunteer[]> {
  const ids = await getDB().smembers(matKey(itemId));
  return Promise.all(
    ids.map(async (pid) => {
      const p = await getParticipant(pid);
      return { id: pid, name: p?.name ?? pid };
    }),
  );
}

/** Voluntarios apuntados a cada ítem de material común, con sus nombres. */
export async function getMaterialState(): Promise<MaterialVolunteers> {
  const out = {} as MaterialVolunteers;
  for (const item of MATERIAL_GENERAL) {
    out[item.id] = await volunteersFor(item.id);
  }
  return out;
}

/** Apunta o quita (toggle) al participante de un ítem y devuelve el estado. */
export async function toggleVolunteer(
  participantId: string,
  itemId: MaterialItemId,
): Promise<MaterialVolunteers> {
  const db = getDB();
  const members = await db.smembers(matKey(itemId));
  if (members.includes(participantId)) {
    await db.srem(matKey(itemId), participantId);
  } else {
    await db.sadd(matKey(itemId), participantId);
  }
  return getMaterialState();
}
```

- [ ] **Step 4: Ejecutar los tests para verlos pasar**

Run: `pnpm test`
Expected: PASS — los tests de `lib/material.test.ts` en verde.

- [ ] **Step 5: Commit**

```bash
git add lib/material.ts lib/material.test.ts
git commit -m "feat: lógica de voluntarios de material"
```

---

## Task 5: Server actions

**Files:**
- Modify: `app/actions.ts`

- [ ] **Step 1: Añadir los imports**

En `app/actions.ts`, junto a los imports existentes de `@/lib/*`, añadir:

```ts
import { castVote, isVoteGameId, type VoteState } from "@/lib/votes";
import {
  toggleVolunteer,
  isMaterialItemId,
  type MaterialVolunteers,
} from "@/lib/material";
```

- [ ] **Step 2: Añadir las actions al final del fichero**

Al final de `app/actions.ts`:

```ts
// --- Votación de juegos ---

export async function castVoteAction(
  gameId: string,
): Promise<{ ok: false } | { ok: true; state: VoteState }> {
  const participant = await getCurrentParticipant();
  if (!participant) return { ok: false as const };
  if (!isVoteGameId(gameId)) return { ok: false as const };
  const state = await castVote(participant.id, gameId);
  return { ok: true as const, state };
}

// --- Voluntarios de material ---

export async function toggleVolunteerAction(
  itemId: string,
): Promise<{ ok: false } | { ok: true; state: MaterialVolunteers }> {
  const participant = await getCurrentParticipant();
  if (!participant) return { ok: false as const };
  if (!isMaterialItemId(itemId)) return { ok: false as const };
  const state = await toggleVolunteer(participant.id, itemId);
  return { ok: true as const, state };
}
```

- [ ] **Step 3: Verificar tipos**

Run: `make typecheck`
Expected: PASS, sin errores.

- [ ] **Step 4: Commit**

```bash
git add app/actions.ts
git commit -m "feat: server actions de voto y material"
```

---

## Task 6: Componente Stories

**Files:**
- Create: `components/Stories.tsx`

- [ ] **Step 1: Crear `components/Stories.tsx`**

```tsx
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
    setVote((v) => v); // no-op para claridad; el estado real llega del server
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
```

- [ ] **Step 2: Verificar tipos**

Run: `make typecheck`
Expected: PASS. Si `nw.tsx` no exporta alguno de los componentes importados (`Title`, `Sparkle`, `Bubble`, `Butterfly`, `LavaLamp`, `ModuleHead`), abrir `components/nw.tsx` y ajustar los imports a los nombres reales o sustituir por los disponibles.

- [ ] **Step 3: Commit**

```bash
git add components/Stories.tsx
git commit -m "feat: componente Stories con slide de votación"
```

---

## Task 7: Ruta `/juegos`

**Files:**
- Create: `app/juegos/page.tsx`

- [ ] **Step 1: Crear `app/juegos/page.tsx`**

```tsx
import { redirect } from "next/navigation";
import { getCurrentParticipant } from "@/lib/session";
import { getVoteState } from "@/lib/votes";
import Stories from "@/components/Stories";

export const dynamic = "force-dynamic";

export default async function JuegosPage() {
  const participant = await getCurrentParticipant();
  if (!participant) redirect("/");

  const initialVote = await getVoteState(participant.id);
  return <Stories initialVote={initialVote} />;
}
```

- [ ] **Step 2: Verificar tipos y build de la ruta**

Run: `make typecheck`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add app/juegos/page.tsx
git commit -m "feat: ruta /juegos con las stories"
```

---

## Task 8: Componente MaterialList

**Files:**
- Create: `components/MaterialList.tsx`

- [ ] **Step 1: Crear `components/MaterialList.tsx`**

```tsx
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
```

- [ ] **Step 2: Verificar tipos**

Run: `make typecheck`
Expected: PASS. Igual que en Task 6: si `ModuleHead` no existe en `nw.tsx`, ajustar al nombre real.

- [ ] **Step 3: Commit**

```bash
git add components/MaterialList.tsx
git commit -m "feat: componente de lista de material"
```

---

## Task 9: Ruta `/material`

**Files:**
- Create: `app/material/page.tsx`

- [ ] **Step 1: Crear `app/material/page.tsx`**

```tsx
import { redirect } from "next/navigation";
import { getCurrentParticipant } from "@/lib/session";
import { getMaterialState } from "@/lib/material";
import MaterialList from "@/components/MaterialList";

export const dynamic = "force-dynamic";

export default async function MaterialPage() {
  const participant = await getCurrentParticipant();
  if (!participant) redirect("/");

  const initial = await getMaterialState();
  return <MaterialList initial={initial} myId={participant.id} />;
}
```

- [ ] **Step 2: Verificar tipos**

Run: `make typecheck`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add app/material/page.tsx
git commit -m "feat: ruta /material"
```

---

## Task 10: Tarjeta de entrada en la home

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Añadir `Link` (ya importado) — tarjeta fijada antes del feed**

En `app/page.tsx`, localizar el bloque del feed:

```tsx
      {/* feed */}
      <ModuleHead icon="📰">novedades</ModuleHead>
      {posts.map((post, i) => (
```

Insertar, justo debajo de `<ModuleHead icon="📰">novedades</ModuleHead>` y antes de `{posts.map(...)}`:

```tsx
      <Link
        href="/juegos"
        className="nw-card glossy"
        style={{ padding: 14, display: "block", textDecoration: "none" }}
      >
        <div className="nw-bubble-font" style={{ fontSize: 11, color: "var(--nw-pink)", marginBottom: 6 }}>
          📌 nuevo
        </div>
        <div className="nw-pixel" style={{ fontSize: 18, color: "var(--nw-violet)" }}>
          ✦ ¡los juegos del cumple! ✦
        </div>
        <div className="nw-bubble-font" style={{ fontSize: 13, color: "var(--nw-ink-soft)", marginTop: 4 }}>
          descubre las pruebas y vota tu favorita →
        </div>
      </Link>
```

(`Link` ya está importado en `app/page.tsx`; no añadir un import nuevo.)

- [ ] **Step 2: Verificar tipos**

Run: `make typecheck`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: tarjeta de los juegos en la home"
```

---

## Task 11: Verificación final y comprobación manual

**Files:** ninguno (verificación)

- [ ] **Step 1: Tests + lint + tipos + build**

Run: `pnpm test && make check`
Expected: tests en verde; lint sin errores; `tsc --noEmit` sin errores; build OK.

- [ ] **Step 2: Comprobación manual**

Run: `make dev` y abrir `http://localhost:3000`.
Comprobar:
- En la home (tras login dev), la tarjeta "✦ ¡los juegos del cumple! ✦" aparece en "novedades" y enlaza a `/juegos`.
- En `/juegos`: la barra de progreso avanza; tocar la mitad derecha avanza y la izquierda retrocede; se ven los 6 juegos.
- En el slide de voto: al votar aparecen las barras de % y el nº de votos; cambiar el voto actualiza los porcentajes; el botón "siguiente →" avanza.
- El slide final enlaza a `/material`.
- En `/material`: "apuntarme" añade tu nombre y cambia a "quitarme"; recargar la página conserva el estado (si hay Redis) o lo conserva durante la sesión del server (mock en dev).

- [ ] **Step 3: Commit final (si hubo ajustes manuales)**

```bash
git add -A
git commit -m "chore: ajustes tras verificación de juegos/material"
```

---

## Self-Review (completado por el autor del plan)

- **Cobertura del spec:** contenido (Task 2), stories tap-through + voto en vivo (Tasks 6-7), material lista abierta solo común + por-juego informativo (Tasks 4, 8-9), entrada en novedades (Task 10), Redis solo con `sadd`/`srem`/`smembers` (Tasks 3-4), sesión requerida y validación de ids (Tasks 5, 7, 9). ✔
- **Placeholders:** ninguno; todo el código está completo. ✔
- **Consistencia de tipos:** `VoteState`, `MaterialVolunteers`, `VoteGameId`, `MaterialItemId`, `castVoteAction`, `toggleVolunteerAction`, `getVoteState`, `castVote`, `getMaterialState`, `toggleVolunteer` se usan con la misma firma en lib, actions, rutas y componentes. ✔
- **Riesgo conocido:** los nombres exactos exportados por `components/nw.tsx` deben confirmarse al implementar (Tasks 6 y 8 lo indican). Fuera de eso, sin dependencias no definidas. ✔
