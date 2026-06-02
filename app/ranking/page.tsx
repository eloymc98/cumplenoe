import { redirect } from "next/navigation";
import { getCurrentParticipant, } from "@/lib/session";
import { listParticipants } from "@/lib/participants";
import { getLeaderboard } from "@/lib/quiz";
import { getSettings } from "@/lib/settings";
import { isRevealed } from "@/lib/dates";
import { TEAMS, TEAM_IDS, type TeamId } from "@/lib/teams";
import { Title, Sparkle, Avatar, ModuleHead } from "@/components/nw";

export const dynamic = "force-dynamic";

export default async function RankingPage() {
  const me = await getCurrentParticipant();
  if (!me) redirect("/");

  const [participants, settings] = await Promise.all([
    listParticipants(),
    getSettings(),
  ]);
  const revealed = isRevealed(settings.revealOverride);

  const byId = new Map(participants.map((p) => [p.id, p]));
  const leaderboard = await getLeaderboard(async (id) => {
    const p = byId.get(id);
    return { name: p?.name ?? "Invitado", finalTeam: p?.finalTeam };
  });

  // Standings por equipo (solo si está revelado, para no filtrar el secreto).
  const sums: Record<TeamId, number> = { rojo: 0, azul: 0, verde: 0, amarillo: 0 };
  if (revealed) {
    for (const e of leaderboard) {
      if (e.finalTeam && e.finalTeam in sums) sums[e.finalTeam as TeamId] += e.points;
    }
  }
  const maxSum = Math.max(1, ...Object.values(sums));
  const standings = TEAM_IDS.map((id) => ({ ...TEAMS[id], sum: sums[id] })).sort(
    (a, b) => b.sum - a.sum,
  );

  const myRank = leaderboard.findIndex((e) => e.participantId === me.id) + 1;
  const myPoints = leaderboard.find((e) => e.participantId === me.id)?.points ?? 0;

  return (
    <main className="nw-main nw-stack">
      <Title size={34} style={{ textAlign: "center", marginTop: 4 }}>
        marcador
      </Title>

      {/* por equipos */}
      <div className="nw-card" style={{ padding: 14 }}>
        <Sparkle size={18} style={{ top: 10, right: 12 }} />
        <ModuleHead icon="✦">por equipos</ModuleHead>
        {revealed ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {standings.map((t) => (
              <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <span style={{ width: 24, textAlign: "center", fontSize: 16 }}>{t.emoji}</span>
                <div className="nw-bar" style={{ flex: 1 }}>
                  <i style={{ width: `${(t.sum / maxSum) * 100}%`, background: t.color }} />
                </div>
                <span className="nw-pixel" style={{ fontSize: 16, color: "var(--nw-violet)", minWidth: 38, textAlign: "right" }}>
                  {t.sum}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="nw-bubble-font" style={{ fontSize: 13, color: "var(--nw-ink-soft)" }}>
            🔒 los equipos se desvelan el 20 de junio. ¡De momento, a sumar puntos!
          </div>
        )}
      </div>

      {/* individual */}
      <ModuleHead icon="🏆">individual</ModuleHead>
      <div className="nw-card" style={{ padding: "6px 14px" }}>
        {leaderboard.length === 0 && (
          <div className="nw-bubble-font" style={{ padding: "12px 0", color: "var(--nw-ink-soft)" }}>
            todavía nadie ha jugado. ¡sé el primero!
          </div>
        )}
        {leaderboard.slice(0, 20).map((e, idx) => {
          const team = e.finalTeam && revealed ? TEAMS[e.finalTeam as TeamId] : null;
          const isMe = e.participantId === me.id;
          return (
            <div key={e.participantId} className="rank-row">
              <span className={"rank-pos" + (idx < 3 ? " top" : "")}>{idx + 1}</span>
              <Avatar size={28} ring={false} />
              <span className="rank-name" style={{ color: isMe ? "var(--nw-pink)" : undefined }}>
                {e.name}
                {isMe && " (tú)"}
              </span>
              {team && <span className="rank-dot" style={{ background: team.color }} />}
              <span className="rank-pts">{e.points}</span>
            </div>
          );
        })}
      </div>

      {/* tu posición */}
      <div
        className="nw-card glossy"
        style={{ padding: 14, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 0 0 3px var(--nw-pink), 0 10px 24px rgba(120,30,130,.25)" }}
      >
        <span className="nw-bubble-font" style={{ fontSize: 18, color: "var(--nw-pink)" }}>
          #{myRank > 0 ? myRank : "—"}
        </span>
        <Avatar size={34} src={me.image} />
        <div style={{ flex: 1 }}>
          <div className="nw-bubble-font" style={{ fontSize: 15 }}>{me.name}</div>
          <div className="nw-bubble-font" style={{ fontSize: 12, color: "var(--nw-ink-soft)" }}>
            tu posición
          </div>
        </div>
        <span className="nw-pixel" style={{ fontSize: 22, color: "var(--nw-violet)" }}>
          {myPoints}
        </span>
      </div>
    </main>
  );
}
