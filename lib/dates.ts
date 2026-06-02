// Fechas clave del evento y lógica de revelación del "sobre".

// Cumpleaños de Noe.
export const BIRTHDAY = new Date("2026-06-27T18:00:00+02:00");

// Fecha en la que se abre automáticamente el sobre con el equipo (una semana antes).
export const REVEAL_DATE = new Date("2026-06-20T18:00:00+02:00");

// Zona horaria de referencia para textos.
export const EVENT_TZ = "Europe/Madrid";

/**
 * El sobre se considera abierto si ya pasó REVEAL_DATE o si el organizador
 * activó el override manual desde el panel.
 */
export function isRevealed(revealOverride: boolean, now: Date = new Date()): boolean {
  return revealOverride || now.getTime() >= REVEAL_DATE.getTime();
}

export function msUntil(target: Date, now: Date = new Date()): number {
  return Math.max(0, target.getTime() - now.getTime());
}
