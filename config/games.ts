// Contenido estático de las pruebas del cumple y el material necesario.
// Sigue el patrón de config/quiz-questions.ts y config/team-test.ts.

export interface Game {
  id: string;
  emoji: string;
  name: string;
  hook: string; // frase de gancho
  summary: string; // cómo se juega, en breve
}

export const FIXED_GAMES = [
  {
    id: "toallas",
    emoji: "🏖",
    name: "Juego de las Toallas",
    hook: "¡La música suena y la carrera comienza!",
    summary:
      "Sillas musicales con toallas: cuando para la música, corre a por una. Cada ronda desaparece una toalla y alguien queda eliminado.",
  },
  {
    id: "trivial-splash",
    emoji: "💦",
    name: "Trivial Splash",
    hook: "Rapidez, conocimiento y puntería.",
    summary:
      "Duelos 1 vs 1 de cultura general cara a cara. Quien falla o responde tarde queda eliminado… ¡y acaba empapado!",
  },
  {
    id: "relevo-acuatico",
    emoji: "🥄🌊",
    name: "Relevo Acuático",
    hook: "¿Tienes buen pulso?",
    summary:
      "En fila, de la arena al agua, pasa una pelota de ping pong sobre una cuchara sujeta con la boca, sin tocarla con las manos.",
  },
  {
    id: "conexion",
    emoji: "🔗",
    name: "Conexión",
    hook: "¿Conectaréis vuestras ideas a tiempo?",
    summary:
      "Dos compañeros construyen una frase diciendo una palabra cada uno, por turnos, para que un tercero adivine la palabra secreta.",
  },
  {
    id: "al-vaso",
    emoji: "🥤",
    name: "¡Al Vaso!",
    hook: "Simón dice… ¡y reflejos!",
    summary:
      "Haz solo lo que diga 'Simón dice'. Cuando grite 'Simón dice: ¡Al vaso!', coge el vaso del centro antes que el rival.",
  },
  {
    id: "tres-en-raya",
    emoji: "❌⭕",
    name: "Tres en Raya Relay",
    hook: "Velocidad, estrategia y trabajo en equipo.",
    summary:
      "Relevo a un tablero gigante en la arena: coloca y mueve tus petos para formar una línea de tres antes que el equipo rival.",
  },
] as const satisfies readonly Game[];

export const VOTE_GAMES = [
  {
    id: "roba-vidas",
    emoji: "🎽",
    name: "Roba Vidas",
    hook: "Protege tus vidas… y roba las del rival.",
    summary:
      "Cada jugador lleva dos vidas (cintas). Róbale las suyas al equipo contrario mientras proteges las tuyas. Gana quien conserve más.",
  },
  {
    id: "operacion-esponja",
    emoji: "🧽",
    name: "Operación Esponja",
    hook: "Velocidad, coordinación y mucha agua.",
    summary:
      "Relevo transportando agua solo con una esponja para llenar el cubo de tu equipo antes que el rival.",
  },
] as const satisfies readonly Game[];

export type FixedGameId = (typeof FIXED_GAMES)[number]["id"];
export type VoteGameId = (typeof VOTE_GAMES)[number]["id"];

export interface MaterialItem {
  id: string;
  emoji: string;
  label: string;
}

// Material común: la gente puede apuntarse a traerlo.
export const MATERIAL_GENERAL = [
  { id: "altavoz", emoji: "🔊", label: "1 altavoz portátil" },
  { id: "movil", emoji: "📱", label: "1 móvil con música y cronómetro" },
  { id: "libreta", emoji: "📒", label: "1 libreta" },
  { id: "bolis", emoji: "🖊", label: "2 bolígrafos" },
  { id: "silbato", emoji: "📣", label: "1 silbato (opcional)" },
  { id: "conos", emoji: "🚩", label: "4 conos o marcas" },
] as const satisfies readonly MaterialItem[];

export type MaterialItemId = (typeof MATERIAL_GENERAL)[number]["id"];

// Material por juego: solo informativo (lo trae la organización).
export interface MaterialPerGame {
  gameId: FixedGameId | VoteGameId;
  items: string[];
  note?: string;
}

export const MATERIAL_PER_GAME: readonly MaterialPerGame[] = [
  { gameId: "toallas", items: ["6-8 toallas"] },
  {
    gameId: "trivial-splash",
    items: ["1-2 pistolas de agua", "50-100 preguntas preparadas", "2 toallas para los duelistas"],
  },
  {
    gameId: "relevo-acuatico",
    items: ["14 cucharas (+1-2 extra)", "2 pelotas de ping pong (+2 de reserva)"],
  },
  { gameId: "conexion", items: ["30-40 papelitos o tarjetas", "1 rotulador"] },
  { gameId: "al-vaso", items: ["1 vaso resistente"] },
  { gameId: "tres-en-raya", items: ["6 petos (3 por equipo)"] },
  { gameId: "roba-vidas", items: ["28 cintas o pañuelos (14 por equipo)"], note: "si sale elegido" },
  { gameId: "operacion-esponja", items: ["4 cubos", "2 esponjas grandes"], note: "si sale elegido" },
];
