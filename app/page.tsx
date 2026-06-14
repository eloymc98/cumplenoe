import Link from "next/link";
import { loginAction, logoutAction } from "@/app/actions";
import { usingDevAuth } from "@/auth";
import { getCurrentParticipant } from "@/lib/session";
import { getPosts } from "@/lib/posts";
import { BIRTHDAY } from "@/lib/dates";
import { NOE_AGE, NOE_AVATAR, NOE_BIO } from "@/config/site";
import Countdown from "@/components/Countdown";
import {
  Title,
  Sparkle,
  Bubble,
  Butterfly,
  LavaLamp,
  Avatar,
  MiniEnvelope,
  IMac,
  ModuleHead,
} from "@/components/nw";

export const dynamic = "force-dynamic";

function LoginView() {
  return (
    <main
      className="nw-main nw-center"
      style={{ minHeight: "80vh", display: "flex", flexDirection: "column", justifyContent: "center", gap: 16, position: "relative" }}
    >
      <Butterfly size={78} style={{ top: 10, left: 8 }} />
      <Bubble size={40} style={{ top: 40, right: 12 }} dur={8} />
      <Sparkle size={26} style={{ bottom: 140, left: 18 }} />
      <LavaLamp h={120} style={{ bottom: 8, right: 6 }} />

      <div>
        <Title size={20} kind="chrome" style={{ marginBottom: -6 }}>
          welcome to
        </Title>
        <Title size={52}>noe&apos;s world</Title>
      </div>
      <div className="nw-bubble-font nw-white" style={{ fontSize: 15, marginTop: -2 }}>
        ✦ disney channel games ✦
        <br />
        el cumple · 27 junio
      </div>

      <div
        className="nw-card glossy"
        style={{ width: "100%", maxWidth: 320, margin: "8px auto 0", padding: 18, display: "flex", flexDirection: "column", gap: 11 }}
      >
        <form action={loginAction} style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          {usingDevAuth ? (
            <>
              <div className="nw-bubble-font" style={{ fontSize: 12, color: "var(--nw-ink-soft)" }}>
                modo dev · dinos quién eres
              </div>
              <input className="nw-input" name="name" placeholder="tu nombre ♥" required />
              <button className="nw-btn block" type="submit">
                entrar al muro ✦
              </button>
            </>
          ) : (
            <button className="nw-btn ghost block" type="submit">
              <span
                style={{
                  fontFamily: "Arial",
                  fontWeight: 900,
                  fontSize: 18,
                  background: "conic-gradient(from -45deg,#ea4335,#fbbc05,#34a853,#4285f4,#ea4335)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                G
              </span>
              Entrar con Google
            </button>
          )}
        </form>
      </div>
    </main>
  );
}

export default async function Home() {
  const participant = await getCurrentParticipant();
  if (!participant) return <LoginView />;

  const posts = await getPosts();
  const sealed = Boolean(participant.testCompletedAt);

  return (
    <main className="nw-main nw-stack">
      {/* profile header */}
      <div className="nw-card glossy" style={{ padding: 16 }}>
        <form action={logoutAction} style={{ position: "absolute", top: 10, right: 12, zIndex: 3 }}>
          <button type="submit" className="nw-chip" style={{ fontSize: 11, padding: "4px 10px" }}>
            salir ✦
          </button>
        </form>
        <div style={{ display: "flex", gap: 13, alignItems: "center" }}>
          <Avatar size={56} src={NOE_AVATAR} />
          <Title size={27} style={{ textAlign: "left" }}>
            noe&apos;s world
          </Title>
        </div>
        <div className="nw-bubble-font" style={{ fontSize: 13, color: "var(--nw-ink-soft)", marginTop: 10 }}>
          ♥ {NOE_AGE} años · &quot;{NOE_BIO}&quot;
        </div>
        <div className="nw-pixel" style={{ fontSize: 17, color: "var(--nw-violet)", marginTop: 5 }}>
          hola, {participant.name} ✦
        </div>
      </div>

      {/* party countdown */}
      <div className="nw-card" style={{ padding: 14 }}>
        <ModuleHead icon="⏳">faltan para el cumple</ModuleHead>
        <Countdown targetISO={BIRTHDAY.toISOString()} />
      </div>

      {/* tu equipo */}
      <div className="nw-card" style={{ padding: 14 }}>
        <Sparkle size={20} style={{ top: 10, right: 12 }} />
        <ModuleHead icon="✦">tu equipo</ModuleHead>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <MiniEnvelope />
          <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: 1, minWidth: 0 }}>
            {sealed ? (
              <>
                <div className="nw-bubble-font" style={{ fontSize: 16, color: "var(--nw-pink)" }}>
                  ¡SELLADO! 🔒
                </div>
                <div className="nw-bubble-font" style={{ fontSize: 12.5, color: "var(--nw-ink-soft)" }}>
                  se revela el 20 de junio
                </div>
                <Link href="/sobre" className="nw-btn ghost" style={{ fontSize: 13, padding: "7px 14px", alignSelf: "flex-start" }}>
                  ver sobre →
                </Link>
              </>
            ) : (
              <>
                <div className="nw-bubble-font" style={{ fontSize: 15 }}>aún no sabes tu equipo</div>
                <div className="nw-bubble-font" style={{ fontSize: 12.5, color: "var(--nw-ink-soft)" }}>
                  haz el test para sellarlo
                </div>
                <Link href="/test" className="nw-btn" style={{ fontSize: 14, padding: "8px 16px", alignSelf: "flex-start" }}>
                  hacer el test ✦
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* quiz cta */}
      <div className="nw-card" style={{ padding: 14, display: "flex", gap: 12, alignItems: "center" }}>
        <IMac w={62} />
        <div style={{ flex: 1 }}>
          <div className="nw-bubble-font" style={{ fontSize: 15, color: "var(--nw-violet)" }}>
            ¿cuánto conoces a Noe?
          </div>
          <div className="nw-bubble-font" style={{ fontSize: 12.5, color: "var(--nw-ink-soft)" }}>
            compite en el ranking
          </div>
        </div>
        <Link href="/quiz" className="nw-btn" style={{ fontSize: 14, padding: "9px 16px" }}>
          jugar
        </Link>
      </div>

      {/* feed */}
      <ModuleHead icon="📰">novedades</ModuleHead>
      <Link
        href="/juegos"
        className="nw-card glossy"
        style={{ padding: 14, display: "block", textDecoration: "none" }}
      >
        <div className="nw-bubble-font" style={{ fontSize: 11, color: "var(--nw-pink)", marginBottom: 6 }}>
          📌 nuevo
        </div>
        <div className="nw-pixel" style={{ fontSize: 18, color: "var(--nw-violet)" }}>
          ✦ ¡los juegos del cumple! ✦
        </div>
        <div className="nw-bubble-font" style={{ fontSize: 13, color: "var(--nw-ink-soft)", marginTop: 4 }}>
          descubre las pruebas y vota tu favorita →
        </div>
      </Link>
      {posts.map((post, i) => (
        <article key={post.slug} className="nw-card" style={{ padding: 14 }}>
          {i === 0 && (
            <div className="nw-bubble-font" style={{ fontSize: 11, color: "var(--nw-pink)", marginBottom: 6 }}>
              📌 fijado por Noe
            </div>
          )}
          <div style={{ display: "flex", gap: 9, alignItems: "center", marginBottom: 8 }}>
            <Avatar size={38} src={post.avatar ?? NOE_AVATAR} />
            <div style={{ lineHeight: 1.15 }}>
              <div className="tweet-meta-name">
                Noe <span style={{ color: "var(--nw-pink)" }}>✦</span>
              </div>
              <div className="tweet-meta-handle">{post.handle} · novedad</div>
            </div>
          </div>
          <div className="tweet-body" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
        </article>
      ))}
    </main>
  );
}
