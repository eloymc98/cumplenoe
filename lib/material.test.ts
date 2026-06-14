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
