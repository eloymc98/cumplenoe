"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import {
  QUIZ_QUESTIONS,
  QUIZ_QUESTIONS_PER_GAME,
  type QuizQuestion,
} from "@/config/quiz-questions";
import { recordQuizAction } from "@/app/actions";
import { Title, Sparkle, Bubble, IMac } from "@/components/nw";

const QUESTION_TIME = 12;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Quiz({ best }: { best: number }) {
  const [phase, setPhase] = useState<"intro" | "play" | "done">("intro");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [time, setTime] = useState(QUESTION_TIME);
  const [bestSoFar, setBestSoFar] = useState(best);
  const [, startTransition] = useTransition();
  const advancing = useRef(false);

  const start = () => {
    setQuestions(shuffle(QUIZ_QUESTIONS).slice(0, QUIZ_QUESTIONS_PER_GAME));
    setPhase("play");
    setI(0);
    setScore(0);
    setPicked(null);
    setTime(QUESTION_TIME);
  };

  const lockIn = (k: number) => {
    if (advancing.current) return;
    advancing.current = true;
    setPicked(k);
    const correct = k === questions[i].correct;
    const gained = correct ? 10 + Math.max(0, time) : 0;
    const newScore = score + gained;
    if (correct) setScore(newScore);
    setTimeout(() => {
      advancing.current = false;
      if (i + 1 >= questions.length) {
        setPhase("done");
        const finalBest = Math.max(bestSoFar, newScore);
        setBestSoFar(finalBest);
        startTransition(async () => {
          await recordQuizAction(newScore);
        });
      } else {
        setI(i + 1);
        setPicked(null);
        setTime(QUESTION_TIME);
      }
    }, 950);
  };

  // temporizador por pregunta
  useEffect(() => {
    if (phase !== "play" || picked !== null) return;
    if (time <= 0) {
      lockIn(-1);
      return;
    }
    const id = setTimeout(() => setTime((s) => s - 1), 1000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, time, picked]);

  if (phase === "intro") {
    return (
      <main className="nw-main nw-stack nw-center" style={{ alignItems: "center" }}>
        <IMac w={108} style={{ marginTop: 8 }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Title size={32}>¿cuánto conoces</Title>
          <Title size={40}>a Noe?</Title>
        </div>
        <div className="nw-bubble-font nw-white" style={{ fontSize: 14.5, maxWidth: 280 }}>
          responde rápido para más puntos · sube en el ranking
        </div>
        <div className="nw-chip on">
          <span className="nw-pixel" style={{ fontSize: 17 }}>tu mejor: {bestSoFar} pts</span>
        </div>
        <button className="nw-btn" onClick={start}>
          empezar ✦
        </button>
        <Link href="/ranking" className="nw-btn ghost">
          ver ranking
        </Link>
      </main>
    );
  }

  if (phase === "done") {
    return (
      <main className="nw-main nw-stack nw-center" style={{ alignItems: "center" }}>
        <Sparkle size={30} style={{ top: 30, left: 30 }} />
        <Bubble size={34} style={{ top: 50, right: 22 }} />
        <Title size={32}>¡bien hecho!</Title>
        <div className="nw-card glossy" style={{ padding: 22, width: "100%" }}>
          <div className="nw-bubble-font" style={{ fontSize: 14, color: "var(--nw-ink-soft)" }}>
            has conseguido
          </div>
          <div className="nw-pixel nw-holo-text" style={{ fontSize: 64, lineHeight: 1 }}>
            {score}
          </div>
          <div className="nw-bubble-font" style={{ fontSize: 16, color: "var(--nw-violet)" }}>
            puntos ✦
          </div>
        </div>
        <div className="nw-chip on" style={{ fontSize: 14 }}>
          mejor marca: {bestSoFar} pts
        </div>
        <button className="nw-btn" onClick={start}>
          jugar otra vez
        </button>
        <Link href="/ranking" className="nw-btn ghost">
          ver ranking →
        </Link>
      </main>
    );
  }

  const q = questions[i];
  return (
    <main className="nw-main nw-stack">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="nw-chip">
          {i + 1}/{questions.length}
        </span>
        <span
          className="nw-chip"
          style={{
            color: time <= 4 ? "#fff" : "var(--nw-violet)",
            background: time <= 4 ? "var(--nw-candy)" : "rgba(255,255,255,.85)",
          }}
        >
          <span className="nw-pixel" style={{ fontSize: 16 }}>⏱ {String(time).padStart(2, "0")}</span>
        </span>
        <span className="nw-chip on">
          <span className="nw-pixel" style={{ fontSize: 16 }}>{score} pts</span>
        </span>
      </div>
      <div className="nw-card glossy nw-center" style={{ padding: 18 }}>
        <Sparkle size={18} style={{ top: 8, left: 10 }} />
        <div className="nw-bubble-font" style={{ fontSize: 21, color: "var(--nw-violet)", lineHeight: 1.2 }}>
          {q.question}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {q.options.map((label, k) => {
          let extra: React.CSSProperties = {};
          if (picked !== null) {
            if (k === q.correct) extra = { background: "linear-gradient(135deg,#28cc7a,#8affd6)", color: "#fff" };
            else if (k === picked) extra = { background: "linear-gradient(135deg,#ff5a5f,#ff8ad1)", color: "#fff" };
            else extra = { opacity: 0.6 };
          }
          return (
            <button
              key={k}
              type="button"
              className="nw-btn ghost"
              disabled={picked !== null}
              style={{ textAlign: "left", justifyContent: "flex-start", fontSize: 15.5, ...extra }}
              onClick={() => lockIn(k)}
            >
              <span style={{ marginRight: 8, color: "var(--nw-pink)" }}>{"ABCD"[k]}</span>
              {label}
            </button>
          );
        })}
      </div>
    </main>
  );
}
