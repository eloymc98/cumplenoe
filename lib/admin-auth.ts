import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "noe_admin";

// Contraseña del panel. En producción se define ADMIN_PASSWORD como env var.
function adminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "noe-cumple-2026";
}

function secret(): string {
  return process.env.ADMIN_SECRET ?? adminPassword();
}

/** Token determinista que se guarda en la cookie tras autenticarse. */
export function sessionToken(): string {
  return createHmac("sha256", secret()).update("noe-admin-session").digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export function checkPassword(input: string): boolean {
  return safeEqual(input, adminPassword());
}

/** Lee la cookie de sesión y valida que sea un token admin legítimo. */
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  const value = store.get(ADMIN_COOKIE)?.value;
  if (!value) return false;
  return safeEqual(value, sessionToken());
}
