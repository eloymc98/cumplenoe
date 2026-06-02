import type { TeamId } from "@/lib/teams";

// Test de personalidad para asignar equipo. Cada opción suma puntos a un equipo.
// (Copys del diseño hi-fi; el resultado es secreto hasta la revelación.)
//
//   rojo (🔥 Inferno) · azul (🌀 Ciclones) · verde (☄️ Comets) · amarillo (⚡ Thunderbolt)

export interface TeamTestOption {
  text: string;
  weights: Partial<Record<TeamId, number>>;
}

export interface TeamTestQuestion {
  id: string;
  question: string;
  options: TeamTestOption[];
}

export const TEAM_TEST: TeamTestQuestion[] = [
  {
    id: "q1",
    question: "En una fiesta, tú eres…",
    options: [
      { text: "quien lo organiza todo", weights: { verde: 1 } },
      { text: "el alma de la pista", weights: { amarillo: 1 } },
      { text: "quien busca la mejor charla", weights: { azul: 1 } },
      { text: "quien llega tarde y épico", weights: { rojo: 1 } },
    ],
  },
  {
    id: "q2",
    question: "Tu peli Disney Channel favorita es más bien…",
    options: [
      { text: "drama con corazón", weights: { azul: 1 } },
      { text: "comedia gamberra", weights: { rojo: 1 } },
      { text: "musical para cantar", weights: { amarillo: 1 } },
      { text: "aventura mágica", weights: { verde: 1 } },
    ],
  },
  {
    id: "q3",
    question: "Tu superpoder secreto sería…",
    options: [
      { text: "energía infinita", weights: { amarillo: 1 } },
      { text: "carisma puro", weights: { azul: 1 } },
      { text: "estrategia maestra", weights: { verde: 1 } },
      { text: "valentía sin freno", weights: { rojo: 1 } },
    ],
  },
  {
    id: "q4",
    question: "Eliges un look para los Games…",
    options: [
      { text: "chándal con purpurina", weights: { amarillo: 1 } },
      { text: "total black misterioso", weights: { rojo: 1 } },
      { text: "pastel y mariposas", weights: { azul: 1 } },
      { text: "deportivo técnico", weights: { verde: 1 } },
    ],
  },
  {
    id: "q5",
    question: "En una prueba por equipos prefieres…",
    options: [
      { text: "liderar el plan", weights: { verde: 1 } },
      { text: "animar a gritos", weights: { amarillo: 1 } },
      { text: "el cuerpo a cuerpo", weights: { rojo: 1 } },
      { text: "unir al grupo", weights: { azul: 1 } },
    ],
  },
  {
    id: "q6",
    question: "Tu emoji de cabecera es…",
    options: [
      { text: "⚡", weights: { amarillo: 1 } },
      { text: "🔥", weights: { rojo: 1 } },
      { text: "🌀", weights: { azul: 1 } },
      { text: "☄️", weights: { verde: 1 } },
    ],
  },
  {
    id: "q7",
    question: "Si ganas, lo celebras…",
    options: [
      { text: "llorando de la emoción", weights: { azul: 1 } },
      { text: "bailando encima de la mesa", weights: { amarillo: 1 } },
      { text: "ya pensando en la próxima", weights: { verde: 1 } },
      { text: "rugiendo como campeón", weights: { rojo: 1 } },
    ],
  },
];
