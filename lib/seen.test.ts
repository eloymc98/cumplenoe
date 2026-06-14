import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { getDB } from "@/lib/redis";
import { hasSeenJuegos, markJuegosSeen } from "@/lib/seen";

beforeEach(async () => {
  await getDB().del("seen:juegos");
});

test("por defecto no se ha visto", async () => {
  assert.equal(await hasSeenJuegos("ana"), false);
});

test("marcar visto lo registra para ese participante", async () => {
  await markJuegosSeen("ana");
  assert.equal(await hasSeenJuegos("ana"), true);
  assert.equal(await hasSeenJuegos("luis"), false);
});

test("marcar visto es idempotente", async () => {
  await markJuegosSeen("ana");
  await markJuegosSeen("ana");
  assert.equal(await hasSeenJuegos("ana"), true);
});
