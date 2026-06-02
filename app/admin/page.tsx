import { isAdmin } from "@/lib/admin-auth";
import { listParticipants } from "@/lib/participants";
import { getSettings } from "@/lib/settings";
import { getLeaderboard } from "@/lib/quiz";
import { TEAMS, TEAM_IDS, getTeam } from "@/lib/teams";
import { isRevealed, REVEAL_DATE } from "@/lib/dates";
import {
  adminLoginAction,
  adminLogoutAction,
  setFinalTeamAction,
  setRevealOverrideAction,
} from "@/app/actions";
import { Title } from "@/components/nw";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const authed = await isAdmin();
  const { error } = await searchParams;

  if (!authed) {
    return (
      <main className="nw-main nw-stack nw-center" style={{ alignItems: "center", paddingTop: 40 }}>
        <Title size={30}>panel</Title>
        <div className="nw-card glossy" style={{ padding: 18, width: "100%", maxWidth: 320, display: "flex", flexDirection: "column", gap: 11 }}>
          <form action={adminLoginAction} style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            <input className="nw-input" type="password" name="password" placeholder="contraseña 🔐" required />
            <button type="submit" className="nw-btn block">
              entrar
            </button>
            {error && <p className="form-error">contraseña incorrecta</p>}
          </form>
        </div>
      </main>
    );
  }

  const [participants, settings] = await Promise.all([
    listParticipants(),
    getSettings(),
  ]);
  const byId = new Map(participants.map((p) => [p.id, p]));
  const leaderboard = await getLeaderboard(async (id) => {
    const p = byId.get(id);
    return { name: p?.name ?? id, finalTeam: p?.finalTeam };
  });
  const revealed = isRevealed(settings.revealOverride);

  const counts: Record<string, number> = {};
  for (const p of participants) {
    if (p.finalTeam) counts[p.finalTeam] = (counts[p.finalTeam] ?? 0) + 1;
  }

  return (
    <main className="nw-main nw-stack">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Title size={28}>panel</Title>
        <form action={adminLogoutAction}>
          <button type="submit" className="nw-chip">salir</button>
        </form>
      </div>

      {/* revelación */}
      <div className="nw-card" style={{ padding: 14 }}>
        <div className="module-head">Revelación del sobre</div>
        <p className="nw-bubble-font" style={{ fontSize: 13, marginBottom: 10 }}>
          Estado: <strong>{revealed ? "ABIERTO ✅" : "SELLADO 🔒"}</strong> · automático el{" "}
          {REVEAL_DATE.toLocaleDateString("es-ES")}
        </p>
        <form action={setRevealOverrideAction} className="admin-inline">
          <input type="hidden" name="value" value={settings.revealOverride ? "off" : "on"} />
          <button type="submit" className="nw-btn ghost" style={{ fontSize: 14, padding: "8px 16px" }}>
            {settings.revealOverride ? "Desactivar apertura manual" : "Abrir sobres ahora (override)"}
          </button>
        </form>
      </div>

      {/* equipos */}
      <div className="nw-card" style={{ padding: 14 }}>
        <div className="module-head">Equipos · {participants.length} participantes</div>
        <div className="admin-counts">
          {TEAM_IDS.map((id) => (
            <span key={id} className="nw-chip">
              {TEAMS[id].emoji} {TEAMS[id].shortName}: <strong>{counts[id] ?? 0}</strong>
            </span>
          ))}
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Participante</th>
              <th>Sugerido</th>
              <th>Final (editable)</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="nw-bubble-font">{p.name}</div>
                  <div style={{ fontSize: 11, color: "var(--nw-ink-soft)" }}>
                    {p.email}
                    {!p.testCompletedAt && " · sin test"}
                  </div>
                </td>
                <td>{p.suggestedTeam ? getTeam(p.suggestedTeam).shortName : "—"}</td>
                <td>
                  {p.finalTeam ? (
                    <form action={setFinalTeamAction} className="admin-inline">
                      <input type="hidden" name="id" value={p.id} />
                      <select name="team" defaultValue={p.finalTeam} className="nw-select">
                        {TEAM_IDS.map((id) => (
                          <option key={id} value={id}>
                            {TEAMS[id].shortName}
                          </option>
                        ))}
                      </select>
                      <button type="submit" className="nw-chip on">
                        Guardar
                      </button>
                    </form>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ranking */}
      <div className="nw-card" style={{ padding: 14 }}>
        <div className="module-head">Ranking del quiz</div>
        {leaderboard.map((e, idx) => (
          <div key={e.participantId} className="rank-row">
            <span className={"rank-pos" + (idx < 3 ? " top" : "")}>{idx + 1}</span>
            <span className="rank-name">{e.name}</span>
            <span className="rank-pts">{e.points}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
