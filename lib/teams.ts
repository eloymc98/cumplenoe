// Datos fijos de los 4 equipos de los Disney Channel Games.
// Agnóstico al diseño: los colores aquí son referencia; el look final se ajusta en CSS.

export type TeamId = "rojo" | "azul" | "verde" | "amarillo";

export interface Team {
  id: TeamId;
  name: string;
  shortName: string;
  color: string; // color de referencia (hex)
  emoji: string;
  roster: string[];
  traits: string[]; // rasgos de personalidad (resultado del test)
}

export const TEAMS: Record<TeamId, Team> = {
  rojo: {
    id: "rojo",
    name: "Equipo Rojo Inferno",
    shortName: "Rojo Inferno",
    color: "#ff3b3b",
    emoji: "🔥",
    roster: [
      "Brenda Song",
      "Nick Jonas",
      "Ashley Tisdale",
      "Jake T. Austin",
      "Mitchel Musso",
    ],
    traits: ["valiente", "intens@", "épic@", "sin freno"],
  },
  azul: {
    id: "azul",
    name: "Equipo Azul Ciclones",
    shortName: "Azul Ciclones",
    color: "#2e7bff",
    emoji: "🌀",
    roster: ["Demi Lovato", "Cole Sprouse", "Vanessa Hudgens", "Corbin Bleu"],
    traits: ["carismátic@", "sensible", "une al grupo"],
  },
  verde: {
    id: "verde",
    name: "Equipo Verde Comets",
    shortName: "Verde Comets",
    color: "#37d35a",
    emoji: "☄️",
    roster: ["David Henrie", "Dylan Sprouse", "Joe Jonas", "Jennifer Stone"],
    traits: ["estratega", "líder", "mente maestra"],
  },
  amarillo: {
    id: "amarillo",
    name: "Equipo Amarillo Thunderbolt",
    shortName: "Amarillo Thunderbolt",
    color: "#ffd23b",
    emoji: "⚡",
    roster: ["Selena Gomez", "Miley Cyrus", "Kevin Jonas", "Andrea Guasch"],
    traits: ["pura energía", "fiesta", "brilla"],
  },
};

export const TEAM_IDS: TeamId[] = ["rojo", "azul", "verde", "amarillo"];

export function getTeam(id: TeamId): Team {
  return TEAMS[id];
}

export function isTeamId(value: unknown): value is TeamId {
  return typeof value === "string" && (TEAM_IDS as string[]).includes(value);
}
