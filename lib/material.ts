import { getDB } from "@/lib/redis";
import { MATERIAL_ITEMS, type MaterialItemId } from "@/config/games";
import { getParticipant } from "@/lib/participants";

const matKey = (id: MaterialItemId) => `material:${id}`;

export interface Volunteer {
  id: string;
  name: string;
}

export type MaterialVolunteers = Record<MaterialItemId, Volunteer[]>;

export function isMaterialItemId(id: string): id is MaterialItemId {
  return MATERIAL_ITEMS.some((m) => m.id === id);
}

async function volunteersFor(itemId: MaterialItemId): Promise<Volunteer[]> {
  const ids = await getDB().smembers(matKey(itemId));
  return Promise.all(
    ids.map(async (pid) => {
      const p = await getParticipant(pid);
      return { id: pid, name: p?.name ?? pid };
    }),
  );
}

/** Voluntarios apuntados a cada ítem de material común, con sus nombres. */
export async function getMaterialState(): Promise<MaterialVolunteers> {
  const out = {} as MaterialVolunteers;
  for (const item of MATERIAL_ITEMS) {
    out[item.id] = await volunteersFor(item.id);
  }
  return out;
}

/** Apunta o quita (toggle) al participante de un ítem y devuelve el estado. */
export async function toggleVolunteer(
  participantId: string,
  itemId: MaterialItemId,
): Promise<MaterialVolunteers> {
  const db = getDB();
  const members = await db.smembers(matKey(itemId));
  if (members.includes(participantId)) {
    await db.srem(matKey(itemId), participantId);
  } else {
    await db.sadd(matKey(itemId), participantId);
  }
  return getMaterialState();
}
