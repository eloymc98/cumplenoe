import { auth } from "@/auth";
import { ensureParticipant, type Participant } from "@/lib/participants";

/**
 * Devuelve el participante autenticado (creándolo/actualizándolo a partir de la
 * sesión de Google la primera vez). null si no hay sesión.
 */
export async function getCurrentParticipant(): Promise<Participant | null> {
  const session = await auth();
  if (!session?.user?.email) return null;
  return ensureParticipant(session.user);
}
