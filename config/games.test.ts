import { test } from "node:test";
import assert from "node:assert/strict";
import { FIXED_GAMES, VOTE_GAMES, MATERIAL_GROUPS, MATERIAL_ITEMS } from "./games";

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

test("cada juego tiene textos no vacíos y reglas", () => {
  for (const g of [...FIXED_GAMES, ...VOTE_GAMES]) {
    for (const field of ["emoji", "name", "hook", "participantes", "objetivo"] as const) {
      assert.ok(g[field].length > 0, `${g.id}.${field} vacío`);
    }
    assert.ok(g.comoSeJuega.length > 0, `${g.id}.comoSeJuega vacío`);
    assert.ok(g.normas.length > 0, `${g.id}.normas vacío`);
  }
});

test("todos los ítems de material tienen ids únicos", () => {
  assert.ok(MATERIAL_ITEMS.length > 0);
  const ids = MATERIAL_ITEMS.map((m) => m.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("MATERIAL_ITEMS es el aplanado de MATERIAL_GROUPS", () => {
  const fromGroups = MATERIAL_GROUPS.flatMap((g) => g.items.map((i) => i.id));
  assert.deepEqual(
    MATERIAL_ITEMS.map((m) => m.id),
    fromGroups,
  );
});
