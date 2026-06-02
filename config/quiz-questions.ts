// Pool de preguntas del minijuego "¿Cuánto conoces a Noe?".
// PLACEHOLDER: sustituye por preguntas reales sobre Noe. Cuantas más, mejor:
// en cada partida se sirve un subconjunto aleatorio (QUIZ_QUESTIONS_PER_GAME).
//
// Formato: pregunta + opciones + índice de la respuesta correcta (correct).

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number; // índice de la opción correcta
}

// Cuántas preguntas se juegan por partida (subconjunto aleatorio del pool).
export const QUIZ_QUESTIONS_PER_GAME = 8;

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: "noe-1", question: "¿Cuál es la peli favorita de Noe?", options: ["placeholder A", "placeholder B", "placeholder C", "placeholder D"], correct: 1 },
  { id: "noe-2", question: "¿Qué pediría Noe en un bar?", options: ["opción 1", "opción 2", "opción 3", "opción 4"], correct: 0 },
  { id: "noe-3", question: "¿Dónde nació Noe?", options: ["ciudad A", "ciudad B", "ciudad C", "ciudad D"], correct: 2 },
  { id: "noe-4", question: "El mayor talento oculto de Noe es…", options: ["talento 1", "talento 2", "talento 3", "talento 4"], correct: 3 },
  { id: "noe-5", question: "¿Cuál es la serie que Noe ha visto 1000 veces?", options: ["serie A", "serie B", "serie C", "serie D"], correct: 0 },
  { id: "noe-6", question: "Comida que Noe jamás rechazaría…", options: ["plato 1", "plato 2", "plato 3", "plato 4"], correct: 1 },
  { id: "noe-7", question: "¿Qué canción se sabe Noe de memoria?", options: ["tema A", "tema B", "tema C", "tema D"], correct: 2 },
  { id: "noe-8", question: "El plan perfecto de finde para Noe es…", options: ["plan 1", "plan 2", "plan 3", "plan 4"], correct: 0 },
  // 👉 Añade aquí muchas más preguntas reales sobre Noe.
];
