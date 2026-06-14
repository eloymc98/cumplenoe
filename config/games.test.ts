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
