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
