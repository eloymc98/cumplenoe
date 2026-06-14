import { getDB } from "@/lib/redis";
import { MATERIAL_ITEMS, type MaterialItemId } from "@/config/games";
import { getParticipant } from "@/lib/participants";

const matKey = (id: MaterialItemId) => `material:${id}`;

export interface Volunteer {
  id: string;
  name: string;
  qty: number;
}

export type MaterialVolunteers = Record<MaterialItemId, Volunteer[]>;

export function isMaterialItemId(id: string): boolean {
  return MATERIAL_ITEMS.some((m) => m.id === id);
}

/** Mapa crudo participantId -> cantidad guardado para un ítem. */
async function readRaw(itemId: MaterialItemId): Promise<Record<string, number>> {
  return (await getDB().get<Record<string, number>>(matKey(itemId))) ?? {};
}

async function volunteersFor(itemId: MaterialItemId): Promise<Volunteer[]> {
  const raw = await readRaw(itemId);
  return Promise.all(
    Object.entries(raw).map(async ([pid, qty]) => {
      const p = await getParticipant(pid);
      return { id: pid, name: p?.name ?? pid, qty };
    }),
  );
}

/** Voluntarios apuntados a cada ítem, con su nombre y la cantidad que traen. */
export async function getMaterialState(): Promise<MaterialVolunteers> {
  const out = {} as MaterialVolunteers;
  for (const item of MATERIAL_ITEMS) {
    out[item.id] = await volunteersFor(item.id);
  }
  return out;
}

/**
 * Apunta al participante a un ítem con una cantidad. Con `qty <= 0` se desapunta.
 * Devuelve el estado actualizado.
 */
export async function setVolunteer(
  participantId: string,
  itemId: MaterialItemId,
  qty: number,
): Promise<MaterialVolunteers> {
  const db = getDB();
  const raw = await readRaw(itemId);
  if (qty > 0) {
    raw[participantId] = Math.floor(qty);
  } else {
    delete raw[participantId];
  }
  await db.set(matKey(itemId), raw);
  return getMaterialState();
}
