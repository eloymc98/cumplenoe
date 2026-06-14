// Contenido estático de las pruebas del cumple y el material necesario.
// Sigue el patrón de config/quiz-questions.ts y config/team-test.ts.
// Los textos de cada juego son literales del documento de reglas.

export interface GameExtra {
  title: string;
  body?: string;
  items?: string[];
}

export interface Game {
  id: string;
  emoji: string;
  name: string;
  hook: string; // párrafo de introducción
  participantes: string;
  comoSeJuega: string[];
  normas: string[];
  extras?: GameExtra[];
  objetivo: string;
}

export const FIXED_GAMES = [
  {
    id: "toallas",
    emoji: "🏖",
    name: "Juego de las Toallas",
    hook:
      "¡La música suena y la carrera comienza! Cuando la música se detenga, todos los jugadores deberán correr para conseguir una toalla antes que los demás. Pero cuidado: en cada ronda desaparecerá una toalla y alguien quedará eliminado.",
    participantes:
      "Participan todos los miembros de ambos equipos. Un jugador de cada equipo actuará inicialmente como árbitro y se encargará de controlar la música y vigilar que se cumplan las normas.",
    comoSeJuega: [
      "Se colocan las toallas en el suelo formando un círculo o una zona central.",
      "Habrá siempre menos espacio disponible que jugadores en juego.",
      "Mientras suena la música, los jugadores se mueven alrededor de las toallas.",
      "Cuando la música se detiene, todos deben intentar ocupar una toalla.",
      "Dependiendo del tamaño de la toalla, podrán sentarse una o dos personas.",
      "El jugador que no consiga un sitio queda eliminado.",
      "Después de cada ronda se retira una toalla y el juego continúa.",
    ],
    normas: [
      "No está permitido empujar PERO…, agarrar o bloquear a otros jugadores,¡sí!",
      "Los jugadores deben estar completamente sentados o dentro del espacio de la toalla.",
      "Los árbitros tienen la decisión final en caso de duda.",
    ],
    extras: [
      {
        title: "Regla especial (opcional): ¡Entran los árbitros!",
        body: "Tras la eliminación del primer jugador de cada equipo, los árbitros podrán incorporarse a la competición. Esta regla es opcional y se decidirá antes del inicio de la partida.",
      },
    ],
    objetivo:
      "Ser uno de los últimos jugadores en permanecer en juego y sumar puntos para tu equipo.",
  },
  {
    id: "trivial-splash",
    emoji: "💦",
    name: "Trivial Splash",
    hook:
      "¡Rapidez, conocimiento y puntería! Dos jugadores se enfrentan cara a cara en un duelo de cultura general donde solo uno podrá seguir en juego. El perdedor… ¡acabará empapado!",
    participantes:
      "Participan ambos equipos. En cada ronda, un jugador de cada equipo se sienta frente a frente para responder a las preguntas.",
    comoSeJuega: [
      "La persona encargada del juego formulará una pregunta de cultura general.",
      "El primer jugador en responder correctamente gana el duelo y continúa en juego.",
      "El jugador que falle o responda más tarde queda eliminado y recibe un pistoletazo de agua.",
      "Un nuevo representante ocupará su lugar en la siguiente ronda.",
      "El juego continúa hasta que todos los miembros de un equipo hayan sido eliminados.",
    ],
    normas: [
      "Las respuestas deben darse de forma clara y en voz alta.",
      "La persona encargada de las preguntas tendrá la decisión final sobre las respuestas válidas.",
      "Está permitido recibir ayuda desde fuera del área de juego pero, tened en cuenta, que las respuestas también las puede escuchar el rival.",
      "Con el fin de equilibrar los equipos, el equipo de la cumpleañera contará con una vida adicional. Cuando todos sus miembros hayan sido eliminados, uno de ellos podrá volver a entrar en juego para disputar una última ronda.",
    ],
    extras: [
      {
        title: "Preguntas de cultura general",
        body: "La cumpleañera será la encargada de preparar y custodiar las preguntas antes del evento. Para garantizar la igualdad, las preguntas permanecerán en secreto hasta el momento del juego.",
      },
    ],
    objetivo:
      "Ser el último equipo con jugadores en pie y demostrar quién domina la cultura general.",
  },
  {
    id: "relevo-acuatico",
    emoji: "🥄🌊",
    name: "Relevo Acuático",
    hook:
      "¿Tienes buen pulso? En este desafío, los equipos deberán transportar una pelota de ping pong sobre una cuchara a través de un recorrido que termina en el agua. ¡La coordinación, la estrategia y el equilibrio serán clave para ganar!",
    participantes:
      "Participan ambos equipos. Todos los jugadores formarán una fila recta desde la arena hasta dentro del agua.",
    comoSeJuega: [
      "Antes de comenzar la prueba, cada equipo dispondrá de unos segundos para decidir estratégicamente el orden de sus jugadores en la fila.",
      "Una vez iniciado el juego, no se podrán cambiar las posiciones.",
      "Cada equipo formará una fila en línea recta que vaya desde la arena hasta el agua.",
      "Los jugadores situados en el extremo más alejado serán los encargados de dar la salida gritando “¡Ya!” y correr rápidamente para ocupar su posición en la fila.",
      "El primer jugador comenzará el recorrido transportando una pelota de ping pong sobre una cuchara sostenida con la boca.",
      "La pelota deberá avanzar de jugador en jugador hasta llegar al final del recorrido.",
      "Gana el equipo que complete el relevo correctamente en el menor tiempo posible.",
    ],
    normas: [
      "La cuchara deberá sujetarse únicamente con la boca durante toda la prueba.",
      "No está permitido tocar la pelota ni sujetar la cuchara con las manos mientras se transporta.",
      "La pelota deberá mantenerse sobre la cuchara en todo momento.",
      "Si la pelota cae, el jugador deberá volver desde la persona anterior.",
      "Los jugadores deben permanecer en su posición durante el relevo.",
    ],
    objetivo:
      "Completar el recorrido antes que el equipo rival sin dejar caer la pelota.",
  },
  {
    id: "conexion",
    emoji: "🔗",
    name: "Conexión",
    hook:
      "¿Seréis capaces de conectar vuestras ideas para descubrir la palabra secreta? La comunicación, la rapidez y el trabajo en equipo serán la clave para ganar.",
    participantes:
      "En cada turno participan tres jugadores del mismo equipo. Dos de ellos conocerán la palabra secreta y deberán ayudar al tercer jugador a adivinarla. El resto del equipo colaborará seleccionando la palabra del turno.",
    comoSeJuega: [
      "El equipo elegirá una palabra secreta para el turno.",
      "La palabra se escribirá en un papel o pizarra y se mostrará al equipo rival para verificar que cumple las normas.",
      "Los dos jugadores encargados de dar pistas conocerán la palabra, mientras que el tercer jugador no podrá verla.",
      "Los jugadores que dan pistas deberán construir una frase de manera conjunta, diciendo una sola palabra cada vez y alternándose por turnos.",
      "El jugador que intenta adivinar podrá responder en cualquier momento.",
      "Se jugarán tres turnos por equipo, cambiando los participantes en cada uno de ellos.",
    ],
    normas: [
      "Solo se puede decir una palabra por turno.",
      "Los jugadores que dan pistas deben alternarse obligatoriamente.",
      "No está permitido hacer gestos, sonidos o señalar objetos.",
      "No se puede decir la palabra secreta ni una parte de ella.",
      "La palabra elegida deberá mantenerse visible para el equipo rival durante toda la ronda.",
    ],
    objetivo:
      "Conseguir que el compañero adivine el mayor número posible de palabras y sumar puntos para el equipo.",
  },
  {
    id: "al-vaso",
    emoji: "🥤",
    name: "¡Al Vaso!",
    hook:
      "Una combinación entre Simón dice y un juego de reflejos. Los jugadores deberán reproducir correctamente las acciones indicadas, evitando las trampas y manteniéndose atentos al momento en que se dé la señal para coger el vaso antes que el equipo contrario.",
    participantes:
      "El juego se disputará en tres rondas. En cada ronda participarán tres jugadores de cada equipo (seis jugadores en total). Los participantes podrán ir rotando entre rondas para que juegue el mayor número posible de personas. Los jugadores que no estén participando en una ronda actuarán como árbitros.",
    comoSeJuega: [
      "Los seis jugadores se colocarán alrededor de un vaso situado en el centro.",
      "La persona encargada del juego irá dando instrucciones rápidas, como “tocad la cabeza”, “levantad una mano”, “saltad”, “izquierda” o “derecha”.",
      "Los jugadores solo deberán realizar la acción si la instrucción va precedida por la frase “Simón dice…”.",
      "Si un jugador realiza una acción cuando no se ha dicho “Simón dice”, quedará eliminado de la ronda.",
      "En cualquier momento, la persona encargada podrá gritar: “Simón dice: ¡Al vaso!”.",
      "Los jugadores que continúen en juego deberán intentar coger el vaso lo más rápido posible.",
      "El equipo cuyo jugador coja primero el vaso ganará la ronda.",
    ],
    normas: [
      "No está permitido empujar, agarrar o bloquear a otros jugadores.",
      "Los jugadores eliminados deberán abandonar inmediatamente la zona de juego.",
      "La decisión de los árbitros será final.",
    ],
    extras: [
      {
        title: "Árbitros",
        items: [
          "Los jugadores que no estén participando actuarán como árbitros.",
          "Su función será comprobar que las acciones se realizan correctamente y decidir qué jugadores quedan eliminados.",
          "También ayudarán a determinar qué jugador ha cogido primero el vaso en caso de duda.",
        ],
      },
      {
        title: "Ubicación recomendada",
        body: "Se recomienda jugar en la orilla o sobre arena húmeda para evitar resbalones y facilitar el movimiento de los jugadores.",
      },
    ],
    objetivo:
      "Ganar el mayor número de rondas demostrando concentración, rapidez y reflejos.",
  },
  {
    id: "tres-en-raya",
    emoji: "❌⭕",
    name: "Tres en Raya Relay",
    hook:
      "Velocidad, estrategia y trabajo en equipo se unen en este desafío. Los equipos deberán correr por turnos para colocar sus piezas en un tablero gigante dibujado en la arena y conseguir una línea de tres antes que el rival.",
    participantes:
      "Participan todos los miembros de ambos equipos. Los jugadores se colocarán en fila detrás de una línea de salida.",
    comoSeJuega: [
      "Se dibujará un tablero de tres en raya en la arena a cierta distancia de la línea de salida.",
      "Cada equipo dispondrá de tres petos o prendas del mismo color que harán de piezas.",
      "Los tres primeros jugadores de cada equipo comenzarán con un peto en la mano.",
      "Cuando se dé la señal de salida, el primer jugador de cada equipo correrá hasta el tablero y colocará una de las piezas en una casilla libre.",
      "Para que el siguiente jugador pueda salir, el participante deberá regresar a la fila y chocar la mano con su compañero.",
      "Los jugadores deberán permanecer detrás de la línea de salida hasta recibir el relevo.",
      "Una vez colocadas las tres piezas de un equipo en el tablero, los siguientes jugadores ya no colocarán piezas nuevas, sino que moverán una de las ya existentes a una casilla libre.",
      "El juego continuará hasta que un equipo consiga formar una línea de tres piezas en horizontal, vertical o diagonal.",
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
    objetivo:
      "Conseguir una línea de tres piezas antes que el equipo rival combinando velocidad, coordinación y estrategia.",
  },
] as const satisfies readonly Game[];

export const VOTE_GAMES = [
  {
    id: "roba-vidas",
    emoji: "🎽",
    name: "Roba Vidas",
    hook:
      "Cada jugador comienza la partida con dos vidas en forma de petos, pañuelos o cintas visibles. El objetivo será proteger las propias vidas mientras intentas robar las del equipo rival. El equipo que conserve más vidas al final de la partida se alzará con la victoria.",
    participantes: "Participan todos los miembros de ambos equipos al mismo tiempo.",
    comoSeJuega: [
      "Cada jugador comenzará con dos vidas colocadas de forma visible.",
      "Al inicio de la partida, todos los jugadores podrán desplazarse libremente por la zona de juego.",
      "Los participantes deberán intentar robar las vidas del equipo rival mientras protegen las suyas.",
      "Cada vez que un jugador pierda una vida, deberá entregarla al jugador que la haya capturado.",
      "Un jugador que pierda sus dos vidas quedará eliminado.",
      "La partida finalizará cuando se agoten los 5 minutos establecidos o cuando un equipo se quede sin jugadores.",
    ],
    normas: [
      "No está permitido empujar, agarrar la ropa o bloquear físicamente a otros jugadores.",
      "Las vidas deben permanecer visibles y accesibles en todo momento.",
      "Los jugadores eliminados deberán abandonar la zona de juego.",
    ],
    objetivo:
      "Conservar el mayor número posible de vidas y conseguir más que el equipo rival.",
  },
  {
    id: "operacion-esponja",
    emoji: "🧽",
    name: "Operación Esponja",
    hook:
      "Velocidad, coordinación y trabajo en equipo serán clave en este desafío. Los equipos deberán transportar la mayor cantidad de agua posible usando únicamente una esponja para llenar su cubo antes que el equipo rival.",
    participantes:
      "Participan todos los miembros de ambos equipos. Los jugadores se colocarán en fila entre el cubo de agua y el cubo vacío de su equipo.",
    comoSeJuega: [
      "Cada equipo dispondrá de dos cubos: uno lleno de agua y otro vacío.",
      "Los jugadores formarán una fila entre ambos cubos.",
      "Cuando se dé la señal de salida, el primer jugador empapará la esponja en el cubo de agua y correrá hacia el cubo vacío para escurrirla.",
      "Tras vaciar la esponja, regresará a la fila y dará el relevo al siguiente jugador chocándole la mano.",
      "Los jugadores irán turnándose hasta que finalice el tiempo establecido.",
      "Al terminar la partida, se medirá el agua acumulada en cada cubo para determinar el equipo ganador.",
    ],
    normas: [
      "El agua solo podrá transportarse mediante la esponja.",
      "No está permitido mover los cubos de su posición original.",
      "Los jugadores deberán permanecer detrás de la línea de salida hasta recibir el relevo.",
      "El relevo solo será válido tras el choque de manos.",
      "No está permitido verter agua directamente con las manos o cualquier otro objeto.",
      "El juego limpio y el buen ambiente son obligatorios.",
    ],
    objetivo:
      "Conseguir transportar la mayor cantidad de agua posible y llenar el cubo del equipo antes que el rival.",
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
];

// Lista plana de todos los ítems, para iterar y validar.
export const MATERIAL_ITEMS: readonly MaterialItem[] = MATERIAL_GROUPS.flatMap(
  (g) => g.items,
);

// Los ids se validan en runtime con isMaterialItemId, así que basta con string.
export type MaterialItemId = string;
