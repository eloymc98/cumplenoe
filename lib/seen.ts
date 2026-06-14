import { getDB } from "@/lib/redis";

const SEEN_JUEGOS = "seen:juegos";

/** ¿Ha abierto ya este participante las stories de los juegos? */
export async function hasSeenJuegos(participantId: string): Promise<boolean> {
  const members = await getDB().smembers(SEEN_JUEGOS);
  return members.includes(participantId);
}

/** Marca que el participante ya ha visto las stories de los juegos. */
export async function markJuegosSeen(participantId: string): Promise<void> {
  await getDB().sadd(SEEN_JUEGOS, participantId);
}
