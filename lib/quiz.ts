import { getDB } from "@/lib/redis";

const LEADERBOARD = "quiz:leaderboard";
const bestKey = (id: string) => `quiz:best:${id}`;

export interface QuizBest {
  participantId: string;
  points: number;
  playedAt: number;
}

export interface LeaderboardEntry {
  participantId: string;
  name: string;
  points: number;
  finalTeam?: string;
}

/**
 * Registra una puntuación en puntos. Solo sustituye la anterior si es mejor.
 * Devuelve true si fue un nuevo récord personal.
 */
export async function recordPoints(
  participantId: string,
  points: number,
): Promise<boolean> {
  const db = getDB();
  const prev = await db.zscore(LEADERBOARD, participantId);
  if (prev !== null && prev >= points) return false;
  await db.zadd(LEADERBOARD, { score: points, member: participantId });
  const best: QuizBest = { participantId, points, playedAt: Date.now() };
  await db.set(bestKey(participantId), best);
  return true;
}

export async function getBest(participantId: string): Promise<QuizBest | null> {
  return getDB().get<QuizBest>(bestKey(participantId));
}

/** Ranking individual ordenado de más a menos puntos. */
export async function getLeaderboard(
  resolve: (id: string) => Promise<{ name: string; finalTeam?: string }>,
  limit = 100,
): Promise<LeaderboardEntry[]> {
  const db = getDB();
  const flat = await db.zrange(LEADERBOARD, 0, limit - 1, {
    rev: true,
    withScores: true,
  });
  const entries: LeaderboardEntry[] = [];
  for (let i = 0; i < flat.length; i += 2) {
    const participantId = String(flat[i]);
    const points = Number(flat[i + 1]);
    const meta = await resolve(participantId);
    entries.push({ participantId, points, ...meta });
  }
  return entries;
}
