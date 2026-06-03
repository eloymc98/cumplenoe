// Pool de preguntas del minijuego "¿Cuánto conoces a Noe?".
// En cada partida se sirve un subconjunto aleatorio (QUIZ_QUESTIONS_PER_GAME).
//
// Formato: pregunta + opciones + índice de la respuesta correcta (correct).

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number; // índice de la opción correcta
}

// Cuántas preguntas se juegan por partida (subconjunto aleatorio del pool).
export const QUIZ_QUESTIONS_PER_GAME = 10;

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: "noe-1", question: "¿Cómo me iba a llamar mi madre realmente?", options: ["Leire", "Ariadna", "Martina", "Mar"], correct: 1 },
  { id: "noe-2", question: "¿Cuál es mi color favorito?", options: ["Beige", "Verde", "Rojo", "Azul"], correct: 1 },
  { id: "noe-3", question: "¿Quién es mi estrella Disney favorita?", options: ["Demi Lovato", "Selena Gómez", "Miley Cyrus", "Zendaya"], correct: 0 },
  { id: "noe-4", question: "¿Cómo se llaman mis perros?", options: ["Rufo y Dobby", "Pizza y Sopa", "Luna y Willy", "Oto y Nina"], correct: 0 },
  { id: "noe-5", question: "¿Qué fui a ver en Londres?", options: ["La obra de Wicked", "Los estudios de Harry Potter", "Show Drag", "Museo de la Guerra Imperial"], correct: 1 },
  { id: "noe-6", question: "¿Cómo se llama el proyecto más chulo que grabé en la carrera?", options: ["Fast love", "Love messages", "Two destinations", "Love is in the air"], correct: 0 },
  { id: "noe-7", question: "¿Cuál fue mi serie favorita de Disney Channel?", options: ["Zack y Cody todos a bordo", "Hannah Montana", "Raven", "Jessie"], correct: 1 },
  { id: "noe-8", question: "¿Cuál fue mi asignatura favorita de bachillerato?", options: ["Biología", "Cultura audiovisual", "Historia", "Filosofía"], correct: 3 },
  { id: "noe-9", question: "¿Qué deporte NO he practicado como extraescolar nunca?", options: ["Fútbol", "Korfball", "Natación", "Karate"], correct: 3 },
  { id: "noe-10", question: "¿Cuál es mi película Disney favorita?", options: ["Camp Rock", "High School Musical 2", "Lemonade Mouth", "The Cheetah Girls"], correct: 0 },
];
