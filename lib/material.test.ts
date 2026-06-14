import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { getDB } from "@/lib/redis";
import { MATERIAL_ITEMS } from "@/config/games";
import { getMaterialState, setVolunteer, isMaterialItemId } from "@/lib/material";

beforeEach(async () => {
  await getDB().del(...MATERIAL_ITEMS.map((m) => `material:${m.id}`));
});

test("estado inicial: ningún voluntario en ningún ítem", async () => {
  const state = await getMaterialState();
  for (const m of MATERIAL_ITEMS) {
    assert.deepEqual(state[m.id], []);
  }
});

test("apuntarse guarda la cantidad (nombre cae al id si no existe)", async () => {
  const state = await setVolunteer("ana", "altavoz", 2);
  assert.deepEqual(state["altavoz"], [{ id: "ana", name: "ana", qty: 2 }]);
});

test("actualizar la cantidad no duplica al participante", async () => {
  await setVolunteer("ana", "toallas", 3);
  const state = await setVolunteer("ana", "toallas", 6);
  assert.deepEqual(state["toallas"], [{ id: "ana", name: "ana", qty: 6 }]);
});

test("cantidad <= 0 desapunta al participante", async () => {
  await setVolunteer("ana", "altavoz", 2);
  const state = await setVolunteer("ana", "altavoz", 0);
  assert.deepEqual(state["altavoz"], []);
});

test("varios pueden apuntarse al mismo ítem con cantidades", async () => {
  await setVolunteer("ana", "conos", 2);
  const state = await setVolunteer("luis", "conos", 4);
  const byId = Object.fromEntries(state["conos"].map((v) => [v.id, v.qty]));
  assert.deepEqual(byId, { ana: 2, luis: 4 });
});

test("isMaterialItemId valida contra la config", () => {
  assert.equal(isMaterialItemId("altavoz"), true);
  assert.equal(isMaterialItemId("toallas"), true);
  assert.equal(isMaterialItemId("no-existe"), false);
});
