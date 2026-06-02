import { getDB } from "@/lib/redis";
import { isTeamId, type TeamId } from "@/lib/teams";

export interface Participant {
  id: string; // email saneado (identidad estable de Google)
  name: string;
  email: string;
  image?: string;
  createdAt: number;
  // Respuestas del test de equipos: índice de pregunta -> índice de opción.
  teamAnswers?: number[];
  suggestedTeam?: TeamId;
  finalTeam?: TeamId;
  testCompletedAt?: number;
}

const PARTICIPANTS_SET = "participants";
const key = (id: string) => `participant:${id}`;

export function idFromEmail(email: string): string {
  return email.trim().toLowerCase().replace(/[^a-z0-9@._-]+/g, "_");
}

/**
 * Crea o actualiza el participante a partir del usuario autenticado (Google).
 * Identidad estable por email. Conserva el progreso (test, equipo) si ya existía.
 */
export async function ensureParticipant(user: {
  email?: string | null;
  name?: string | null;
  image?: string | null;
}): Promise<Participant | null> {
  if (!user?.email) return null;
  const db = getDB();
  const id = idFromEmail(user.email);
  const existing = await db.get<Participant>(key(id));

  const participant: Participant = {
    id,
    email: user.email,
    name: user.name?.trim() || existing?.name || user.email.split("@")[0],
    image: user.image ?? existing?.image,
    createdAt: existing?.createdAt ?? Date.now(),
    teamAnswers: existing?.teamAnswers,
    suggestedTeam: existing?.suggestedTeam,
    finalTeam: existing?.finalTeam,
    testCompletedAt: existing?.testCompletedAt,
  };

  await db.set(key(id), participant);
  if (!existing) await db.sadd(PARTICIPANTS_SET, id);
  return participant;
}

export async function getParticipant(id: string): Promise<Participant | null> {
  return getDB().get<Participant>(key(id));
}

export async function listParticipants(): Promise<Participant[]> {
  const db = getDB();
  const ids = await db.smembers(PARTICIPANTS_SET);
  const rows = await Promise.all(ids.map((id) => db.get<Participant>(key(id))));
  return rows
    .filter((p): p is Participant => p !== null)
    .sort((a, b) => a.createdAt - b.createdAt);
}

/** Guarda el resultado del test (respuestas + equipo sugerido). */
export async function saveTestResult(
  id: string,
  teamAnswers: number[],
  suggestedTeam: TeamId,
): Promise<Participant | null> {
  const db = getDB();
  const p = await db.get<Participant>(key(id));
  if (!p) return null;
  const updated: Participant = {
    ...p,
    teamAnswers,
    suggestedTeam,
    finalTeam: p.finalTeam ?? suggestedTeam,
    testCompletedAt: Date.now(),
  };
  await db.set(key(id), updated);
  return updated;
}

/** Override del organizador: fija el equipo final de un participante. */
export async function setFinalTeam(
  id: string,
  finalTeam: TeamId,
): Promise<Participant | null> {
  if (!isTeamId(finalTeam)) return null;
  const db = getDB();
  const p = await db.get<Participant>(key(id));
  if (!p) return null;
  const updated: Participant = { ...p, finalTeam };
  await db.set(key(id), updated);
  return updated;
}
