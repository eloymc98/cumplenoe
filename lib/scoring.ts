import { TEAM_TEST } from "@/config/team-test";
import { TEAM_IDS, type TeamId } from "@/lib/teams";

/**
 * Calcula el equipo sugerido a partir de las respuestas del test.
 * `answers[i]` = índice de la opción elegida en la pregunta i.
 * Empates se rompen de forma determinista por el orden de TEAM_IDS.
 */
export function computeSuggestedTeam(answers: number[]): TeamId {
  const scores: Record<TeamId, number> = {
    rojo: 0,
    azul: 0,
    verde: 0,
    amarillo: 0,
  };

  TEAM_TEST.forEach((q, i) => {
    const choice = answers[i];
    const option = q.options[choice];
    if (!option) return;
    for (const [team, w] of Object.entries(option.weights)) {
      scores[team as TeamId] += w ?? 0;
    }
  });

  let best: TeamId = TEAM_IDS[0];
  for (const t of TEAM_IDS) {
    if (scores[t] > scores[best]) best = t;
  }
  return best;
}

/** Valida que las respuestas cubran todas las preguntas con índices válidos. */
export function validateAnswers(answers: unknown): answers is number[] {
  if (!Array.isArray(answers)) return false;
  if (answers.length !== TEAM_TEST.length) return false;
  return answers.every((a, i) => {
    return (
      Number.isInteger(a) && a >= 0 && a < TEAM_TEST[i].options.length
    );
  });
}
