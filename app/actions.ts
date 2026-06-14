"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";
import { getCurrentParticipant } from "@/lib/session";
import { saveTestResult, setFinalTeam } from "@/lib/participants";
import { computeSuggestedTeam, validateAnswers } from "@/lib/scoring";
import { recordPoints } from "@/lib/quiz";
import { setRevealOverride } from "@/lib/settings";
import { isTeamId } from "@/lib/teams";
import {
  ADMIN_COOKIE,
  checkPassword,
  isAdmin,
  sessionToken,
} from "@/lib/admin-auth";
import { castVote, isVoteGameId, type VoteState } from "@/lib/votes";
import { markJuegosSeen } from "@/lib/seen";
import {
  setVolunteer,
  isMaterialItemId,
  type MaterialVolunteers,
} from "@/lib/material";

const YEAR = 60 * 60 * 24 * 365;

// --- Auth (Google / dev) ---

export async function loginAction(formData: FormData) {
  // En dev el proveedor "dev" pide nombre; en prod usamos Google.
  const name = String(formData.get("name") ?? "").trim();
  if (name) {
    await signIn("dev", { name, redirectTo: "/" });
    return;
  }
  await signIn("google", { redirectTo: "/" });
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}

// --- Test de equipos ---

export async function submitTestAction(answers: number[]) {
  const participant = await getCurrentParticipant();
  if (!participant) redirect("/");
  if (!validateAnswers(answers)) {
    return { ok: false as const, error: "Respuestas incompletas" };
  }
  const suggested = computeSuggestedTeam(answers);
  await saveTestResult(participant!.id, answers, suggested);
  redirect("/sobre");
}

// --- Quiz ---

export async function recordQuizAction(points: number) {
  const participant = await getCurrentParticipant();
  if (!participant) return { ok: false as const, error: "identify" };
  const isRecord = await recordPoints(participant.id, points);
  return { ok: true as const, isRecord };
}

// --- Admin (contraseña compartida) ---

export async function adminLoginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    redirect("/admin?error=1");
  }
  const store = await cookies();
  store.set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: YEAR,
  });
  redirect("/admin");
}

export async function adminLogoutAction() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin");
}

export async function setFinalTeamAction(formData: FormData) {
  if (!(await isAdmin())) redirect("/admin");
  const id = String(formData.get("id") ?? "");
  const team = String(formData.get("team") ?? "");
  if (id && isTeamId(team)) {
    await setFinalTeam(id, team);
  }
  redirect("/admin");
}

export async function setRevealOverrideAction(formData: FormData) {
  if (!(await isAdmin())) redirect("/admin");
  const value = String(formData.get("value") ?? "") === "on";
  await setRevealOverride(value);
  redirect("/admin");
}

// --- Votación de juegos ---

export async function castVoteAction(
  gameId: string,
): Promise<{ ok: false } | { ok: true; state: VoteState }> {
  const participant = await getCurrentParticipant();
  if (!participant) return { ok: false as const };
  if (!isVoteGameId(gameId)) return { ok: false as const };
  const state = await castVote(participant.id, gameId);
  return { ok: true as const, state };
}

// --- Voluntarios de material ---

export async function setVolunteerAction(
  itemId: string,
  qty: number,
): Promise<{ ok: false } | { ok: true; state: MaterialVolunteers }> {
  const participant = await getCurrentParticipant();
  if (!participant) return { ok: false as const };
  if (!isMaterialItemId(itemId)) return { ok: false as const };
  const n = Number.isFinite(qty) ? Math.floor(qty) : 0;
  const state = await setVolunteer(participant.id, itemId, n);
  return { ok: true as const, state };
}

// --- Novedades vistas ---

export async function markJuegosSeenAction(): Promise<void> {
  const participant = await getCurrentParticipant();
  if (!participant) return;
  await markJuegosSeen(participant.id);
}
