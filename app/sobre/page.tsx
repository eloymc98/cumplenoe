import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentParticipant } from "@/lib/session";
import { getSettings } from "@/lib/settings";
import { isRevealed, REVEAL_DATE } from "@/lib/dates";
import { TEAMS, TEAM_IDS, getTeam } from "@/lib/teams";
import Countdown from "@/components/Countdown";
import TestResultCard from "@/components/TestResultCard";
import { Title, Sparkle, Bubble, BigEnvelope } from "@/components/nw";

export const dynamic = "force-dynamic";

export default async function SobrePage() {
  const participant = await getCurrentParticipant();
  if (!participant) redirect("/");
  // Basta con tener equipo final: el organizador puede asignarlo a mano sin test.
  if (!participant!.finalTeam) redirect("/test");

  const settings = await getSettings();
  const revealed = isRevealed(settings.revealOverride);

  if (!revealed) {
    return (
      <main className="nw-main nw-stack nw-center" style={{ alignItems: "center" }}>
        <Sparkle size={30} style={{ top: 30, left: 26 }} />
        <Sparkle size={20} style={{ top: 90, right: 30 }} dur={2.6} />
        <Bubble size={34} style={{ top: 60, right: 18 }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Title size={28}>tu equipo está</Title>
          <Title size={46} kind="chrome">
            SELLADO
          </Title>
        </div>
        <div className="nw-bubble-font nw-white" style={{ fontSize: 14 }}>
          nadie lo verá hasta el día de la revelación
        </div>
        <BigEnvelope />
        <div className="nw-card" style={{ padding: 14, width: "100%" }}>
          <div className="nw-bubble-font" style={{ fontSize: 15, color: "var(--nw-violet)", marginBottom: 9 }}>
            ⏳ se abre en…
          </div>
          <Countdown targetISO={REVEAL_DATE.toISOString()} />
          <div className="nw-bubble-font" style={{ fontSize: 12.5, color: "var(--nw-ink-soft)", marginTop: 9 }}>
            20 de junio · 18:00
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
          {TEAM_IDS.map((id) => (
            <span key={id} className="nw-chip">
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: TEAMS[id].color, border: "1.5px solid #fff" }} />
              {TEAMS[id].emoji} {TEAMS[id].shortName}
            </span>
          ))}
        </div>
        <Link href="/" className="nw-btn ghost">
          volver al muro
        </Link>
      </main>
    );
  }

  const team = getTeam(participant!.finalTeam);
  const suggested = participant!.suggestedTeam;

  return (
    <main className="nw-main nw-stack nw-center" style={{ alignItems: "center" }}>
      <Sparkle size={30} style={{ top: 24, left: 24 }} />
      <Bubble size={34} style={{ top: 50, right: 18 }} />
      <div className="nw-bubble-font nw-white" style={{ fontSize: 14 }}>
        redoble de tambores… 🥁
      </div>
      <div style={{ fontSize: 64, lineHeight: 1 }}>{team.emoji}</div>
      <Title size={40} style={{ color: team.color }}>
        {team.name}
      </Title>
      <div
        className="nw-card glossy"
        style={{ padding: 18, width: "100%", boxShadow: `0 0 0 3px ${team.color}, 0 10px 24px rgba(120,30,130,.25)` }}
      >
        <div className="nw-bubble-font" style={{ fontSize: 14, color: "var(--nw-ink-soft)" }}>
          ¡estas son tus estrellas de equipo!
        </div>
        <ul className="roster" style={{ alignItems: "center", display: "flex" }}>
          {team.roster.map((star) => (
            <li key={star} className="roster-item">
              ⭐ {star}
            </li>
          ))}
        </ul>
      </div>
      {suggested && (
        <TestResultCard team={getTeam(suggested)} matched={suggested === participant!.finalTeam} />
      )}
      <Link href="/" className="nw-btn ghost">
        volver al muro
      </Link>
    </main>
  );
}
