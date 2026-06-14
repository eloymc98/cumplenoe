// Contenido estático de las pruebas del cumple y el material necesario.
// Sigue el patrón de config/quiz-questions.ts y config/team-test.ts.

export interface Game {
  id: string;
  emoji: string;
  name: string;
  hook: string; // frase de gancho
  participantes: string;
  comoSeJuega: string[];
  normas: string[];
  objetivo: string;
}

export const FIXED_GAMES = [
  {
    id: "toallas",
    emoji: "🏖",
    name: "Juego de las Toallas",
    hook: "¡La música suena y la carrera comienza!",
    participantes:
      "Todos, ambos equipos. Un árbitro por equipo controla la música y las normas.",
    comoSeJuega: [
      "Toallas en el suelo en círculo, siempre menos sitios que jugadores.",
      "Mientras suena la música, todos se mueven alrededor.",
      "Al parar la música, corre a ocupar una toalla (caben 1-2 personas).",
      "Quien no consigue sitio queda eliminado.",
      "Cada ronda se retira una toalla.",
    ],
    normas: [
      "No está permitido empujar PERO…, agarrar o bloquear a otros jugadores,¡sí!",
      "Los jugadores deben estar completamente sentados o dentro del espacio de la toalla.",
      "Los árbitros tienen la decisión final en caso de duda.",
    ],
    objetivo: "Ser de los últimos en pie y sumar puntos para tu equipo.",
  },
  {
    id: "trivial-splash",
    emoji: "💦",
    name: "Trivial Splash",
    hook: "¡Rapidez, conocimiento y puntería!",
    participantes:
      "Ambos equipos. Cada ronda, un jugador de cada equipo, cara a cara.",
    comoSeJuega: [
      "La persona del juego hace una pregunta de cultura general.",
      "El primero en acertar gana el duelo y sigue en juego.",
      "Quien falla o responde tarde queda eliminado y recibe un pistoletazo de agua.",
      "Un nuevo representante ocupa su lugar en la siguiente ronda.",
      "Sigue hasta que un equipo se quede sin jugadores.",
    ],
    normas: [
      "Las respuestas deben darse de forma clara y en voz alta.",
      "La persona encargada de las preguntas tendrá la decisión final sobre las respuestas válidas.",
      "Está permitido recibir ayuda desde fuera del área de juego pero, tened en cuenta, que las respuestas también las puede escuchar el rival.",
      "Con el fin de equilibrar los equipos, el equipo de la cumpleañera contará con una vida adicional. Cuando todos sus miembros hayan sido eliminados, uno de ellos podrá volver a entrar en juego para disputar una última ronda.",
    ],
    objetivo:
      "Ser el último equipo en pie y demostrar quién domina la cultura general.",
  },
  {
    id: "relevo-acuatico",
    emoji: "🥄🌊",
    name: "Relevo Acuático",
    hook: "¿Tienes buen pulso?",
    participantes: "Ambos equipos en fila recta, desde la arena hasta el agua.",
    comoSeJuega: [
      "Antes de empezar, cada equipo decide el orden de la fila (luego no se cambia).",
      "El jugador del extremo grita '¡Ya!' y corre a su posición.",
      "Se transporta una pelota de ping pong sobre una cuchara sujeta con la boca.",
      "La pelota pasa de jugador en jugador hasta el final del recorrido.",
    ],
    normas: [
      "La cuchara deberá sujetarse únicamente con la boca durante toda la prueba.",
      "No está permitido tocar la pelota ni sujetar la cuchara con las manos mientras se transporta.",
      "La pelota deberá mantenerse sobre la cuchara en todo momento.",
      "Si la pelota cae, el jugador deberá volver desde la persona anterior.",
      "Los jugadores deben permanecer en su posición durante el relevo.",
    ],
    objetivo: "Completar el recorrido antes que el rival sin que caiga la pelota.",
  },
  {
    id: "conexion",
    emoji: "🔗",
    name: "Conexión",
    hook: "¿Conectaréis vuestras ideas a tiempo?",
    participantes: "Por turno, 3 del mismo equipo: 2 dan pistas y 1 adivina.",
    comoSeJuega: [
      "El equipo elige una palabra secreta y se la enseña al rival para validarla.",
      "Los 2 que dan pistas construyen una frase, una palabra cada uno, alternándose.",
      "El que adivina puede responder en cualquier momento.",
      "3 turnos por equipo, cambiando participantes.",
    ],
    normas: [
      "Solo se puede decir una palabra por turno.",
      "Los jugadores que dan pistas deben alternarse obligatoriamente.",
      "No está permitido hacer gestos, sonidos o señalar objetos.",
      "No se puede decir la palabra secreta ni una parte de ella.",
      "La palabra elegida deberá mantenerse visible para el equipo rival durante toda la ronda.",
    ],
    objetivo: "Que el compañero adivine el mayor número de palabras.",
  },
  {
    id: "al-vaso",
    emoji: "🥤",
    name: "¡Al Vaso!",
    hook: "Simón dice… ¡y reflejos!",
    participantes:
      "3 rondas, 3 jugadores por equipo cada una (rotan). El resto, árbitros.",
    comoSeJuega: [
      "Los seis alrededor de un vaso en el centro.",
      "Se dan órdenes rápidas (tócate la cabeza, salta, izquierda…).",
      "Solo se obedece si va precedido de 'Simón dice…'.",
      "Si actúas sin 'Simón dice', quedas eliminado de la ronda.",
      "Al grito de 'Simón dice: ¡Al vaso!', coge el vaso lo más rápido posible.",
    ],
    normas: [
      "No está permitido empujar, agarrar o bloquear a otros jugadores.",
      "Los jugadores eliminados deberán abandonar inmediatamente la zona de juego.",
      "La decisión de los árbitros será final.",
    ],
    objetivo: "Ganar el mayor número de rondas con concentración y reflejos.",
  },
  {
    id: "tres-en-raya",
    emoji: "❌⭕",
    name: "Tres en Raya Relay",
    hook: "Velocidad, estrategia y trabajo en equipo.",
    participantes: "Todos, ambos equipos, en fila tras la línea de salida.",
    comoSeJuega: [
      "Tablero de tres en raya dibujado en la arena, a cierta distancia.",
      "Cada equipo tiene 3 petos que hacen de fichas.",
      "Por relevo (chocando la mano), cada jugador coloca una ficha en una casilla libre.",
      "Con las 3 fichas puestas, los siguientes mueven una ficha ya colocada.",
    ],
    normas: [
      "Solo puede haber un jugador de cada equipo en movimiento al mismo tiempo.",
      "Los jugadores de la fila deberán permanecer detrás de la línea de salida.",
      "No está permitido mover las piezas del equipo rival.",
      "Cada turno permite colocar o mover una única pieza.",
      "Las piezas deberán quedar completamente dentro de una casilla.",
      "El relevo solo será válido tras el choque de manos.",
      "Los últimos de la fila de cada equipo se encargarán de ser árbitros para controlar el juego.",
      "El equipo podrá ayudar al jugador que está en el tablero con indicaciones detrás de la línea de salida.",
    ],
    objetivo: "Formar una línea de tres antes que el rival.",
  },
] as const satisfies readonly Game[];

export const VOTE_GAMES = [
  {
    id: "roba-vidas",
    emoji: "🎽",
    name: "Roba Vidas",
    hook: "Protege tus vidas… y roba las del rival.",
    participantes: "Todos, ambos equipos a la vez.",
    comoSeJuega: [
      "Cada jugador empieza con 2 vidas visibles (cintas o pañuelos).",
      "Roba las vidas del rival mientras proteges las tuyas.",
      "Al perder una vida, se la das a quien te la quita.",
      "Con 2 vidas perdidas, quedas eliminado.",
      "Acaba a los 5 minutos o cuando un equipo se quede sin jugadores.",
    ],
    normas: [
      "No está permitido empujar, agarrar la ropa o bloquear físicamente a otros jugadores.",
      "Las vidas deben permanecer visibles y accesibles en todo momento.",
      "Los jugadores eliminados deberán abandonar la zona de juego.",
    ],
    objetivo: "Conservar más vidas que el equipo rival.",
  },
  {
    id: "operacion-esponja",
    emoji: "🧽",
    name: "Operación Esponja",
    hook: "Velocidad, coordinación y mucha agua.",
    participantes:
      "Todos, ambos equipos, en fila entre el cubo lleno y el vacío.",
    comoSeJuega: [
      "Cada equipo tiene 2 cubos: uno con agua y uno vacío.",
      "Empapa la esponja, corre al cubo vacío y escúrrela.",
      "Vuelve y da el relevo chocando la mano.",
      "Al acabar el tiempo se mide el agua de cada cubo.",
    ],
    normas: [
      "El agua solo podrá transportarse mediante la esponja.",
      "No está permitido mover los cubos de su posición original.",
      "Los jugadores deberán permanecer detrás de la línea de salida hasta recibir el relevo.",
      "El relevo solo será válido tras el choque de manos.",
      "No está permitido verter agua directamente con las manos o cualquier otro objeto.",
      "El juego limpio y el buen ambiente son obligatorios.",
    ],
    objetivo: "Llenar tu cubo con más agua que el rival.",
  },
] as const satisfies readonly Game[];

export type FixedGameId = (typeof FIXED_GAMES)[number]["id"];
export type VoteGameId = (typeof VOTE_GAMES)[number]["id"];

export interface MaterialItem {
  id: string;
  emoji: string;
  label: string;
}

export interface MaterialGroup {
  title: string;
  emoji: string;
  note?: string;
  items: readonly MaterialItem[];
}

// Todo el material es común: cualquiera puede apuntarse a traerlo.
// Se agrupa solo para leerlo mejor.
export const MATERIAL_GROUPS: readonly MaterialGroup[] = [
  {
    title: "General",
    emoji: "🎒",
    items: [
      { id: "altavoz", emoji: "🔊", label: "1 altavoz portátil" },
      { id: "movil", emoji: "📱", label: "1 móvil con música y cronómetro" },
      { id: "libreta", emoji: "📒", label: "1 libreta" },
      { id: "bolis", emoji: "🖊", label: "2 bolígrafos" },
      { id: "silbato", emoji: "📣", label: "1 silbato (opcional)" },
      { id: "conos", emoji: "🚩", label: "4 conos o marcas" },
    ],
  },
  {
    title: "Juego de las Toallas",
    emoji: "🏖",
    items: [{ id: "toallas", emoji: "🏖", label: "6-8 toallas" }],
  },
  {
    title: "Trivial Splash",
    emoji: "💦",
    items: [
      { id: "pistolas", emoji: "🔫", label: "1-2 pistolas de agua" },
      { id: "toallas-duelistas", emoji: "🏖", label: "2 toallas para los duelistas" },
    ],
  },
  {
    title: "Relevo Acuático",
    emoji: "🥄🌊",
    items: [
      { id: "cucharas", emoji: "🥄", label: "14 cucharas + 1 o 2 extra" },
      { id: "pelotas", emoji: "⚪", label: "2 pelotas de ping pong + 2 de reserva" },
    ],
  },
  {
    title: "Conexión",
    emoji: "🔗",
    items: [
      { id: "papelitos", emoji: "📄", label: "30-40 papelitos o tarjetas" },
      { id: "rotulador", emoji: "✏", label: "1 rotulador" },
    ],
  },
  {
    title: "¡Al Vaso!",
    emoji: "🥤",
    items: [{ id: "vaso", emoji: "🥤", label: "1 vaso resistente" }],
  },
  {
    title: "Tres en Raya Relay",
    emoji: "❌⭕",
    items: [{ id: "petos", emoji: "🎽", label: "6 petos (3 por equipo)" }],
  },
  {
    title: "Roba Vidas",
    emoji: "🎽",
    note: "si sale elegido",
    items: [{ id: "cintas", emoji: "🎀", label: "28 cintas o pañuelos (14 por equipo)" }],
  },
  {
    title: "Operación Esponja",
    emoji: "🧽",
    note: "si sale elegido",
    items: [
      { id: "cubos", emoji: "🪣", label: "4 cubos" },
      { id: "esponjas", emoji: "🧽", label: "2 esponjas grandes" },
    ],
  },
] as const satisfies readonly MaterialGroup[];

// Lista plana de todos los ítems, para iterar y validar.
export const MATERIAL_ITEMS: readonly MaterialItem[] = MATERIAL_GROUPS.flatMap(
  (g) => g.items,
);

// Los ids se validan en runtime con isMaterialItemId, así que basta con string.
export type MaterialItemId = string;
