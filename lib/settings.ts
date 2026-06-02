import { getDB } from "@/lib/redis";

export interface Settings {
  // Abre el sobre antes de REVEAL_DATE si el organizador lo activa.
  revealOverride: boolean;
}

const SETTINGS_KEY = "settings";
const DEFAULTS: Settings = { revealOverride: false };

export async function getSettings(): Promise<Settings> {
  const stored = await getDB().get<Settings>(SETTINGS_KEY);
  return { ...DEFAULTS, ...(stored ?? {}) };
}

export async function setRevealOverride(value: boolean): Promise<Settings> {
  const db = getDB();
  const current = await getSettings();
  const updated: Settings = { ...current, revealOverride: value };
  await db.set(SETTINGS_KEY, updated);
  return updated;
}
