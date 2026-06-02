"use client";

import { useState, useTransition } from "react";
import { TEAM_TEST } from "@/config/team-test";
import { submitTestAction } from "@/app/actions";
import { Sparkle } from "@/components/nw";

export default function TeamTest() {
  const [answers, setAnswers] = useState<number[]>([]);
  const [step, setStep] = useState(0);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const total = TEAM_TEST.length;
  const q = TEAM_TEST[step];
  const isLast = step === total - 1;

  function choose(optionIndex: number) {
    const next = [...answers];
    next[step] = optionIndex;
    setAnswers(next);
    if (isLast) {
      startTransition(async () => {
        const res = await submitTestAction(next);
        if (res && !res.ok) setError(res.error);
      });
    } else {
      setStep(step + 1);
    }
  }

  return (
    <main className="nw-main nw-stack">
      <div className="nw-card" style={{ padding: 16 }}>
        <Sparkle size={22} style={{ top: 10, right: 12 }} />
        <div className="nw-bubble-font" style={{ fontSize: 12.5, color: "var(--nw-ink-soft)", marginBottom: 6 }}>
          pregunta {step + 1} de {total}
        </div>
        <div className="nw-bar" style={{ marginBottom: 14 }}>
          <i style={{ width: `${(step / total) * 100}%`, transition: "width .3s" }} />
        </div>
        <div className="nw-bubble-font" style={{ fontSize: 22, color: "var(--nw-violet)", lineHeight: 1.15, marginBottom: 12 }}>
          {q.question}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {q.options.map((opt, k) => (
            <button
              key={k}
              type="button"
              className="nw-btn ghost"
              disabled={pending}
              style={{ textAlign: "left", justifyContent: "flex-start", fontSize: 15.5 }}
              onClick={() => choose(k)}
            >
              <span style={{ marginRight: 8, color: "var(--nw-pink)" }}>{"ABCD"[k]}</span>
              {opt.text}
            </button>
          ))}
        </div>
      </div>
      <div className="nw-bubble-font nw-center nw-white" style={{ fontSize: 12.5 }}>
        {pending
          ? "sellando tu sobre… ✦"
          : "psst: tu resultado quedará sellado hasta el 20 de junio ✦"}
      </div>
      {error && <p className="form-error nw-center">{error}</p>}
    </main>
  );
}
