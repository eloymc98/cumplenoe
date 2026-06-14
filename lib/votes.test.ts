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
