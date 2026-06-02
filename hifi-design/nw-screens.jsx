// nw-screens.jsx — screens for "noé's world" Y2K prototype
// Depends on globals from nw-kit.jsx. Exports screen components + data to window.

// ───────────────────────────────────────── data
const TEAMS = [
  { key: 'red',    name: 'Inferno',     sub: 'Rojo',    cls: 'tm-red',    color: '#ff5a5f', emoji: '🔥',
    members: ['Brenda Song', 'Nick Jonas', 'Ashley Tisdale', 'Jake T. Austin', 'Mitchel Musso'] },
  { key: 'blue',   name: 'Ciclones',    sub: 'Azul',    cls: 'tm-blue',   color: '#3aa0ff', emoji: '🌀',
    members: ['Demi Lovato', 'Cole Sprouse', 'Vanessa Hudgens', 'Corbin Bleu'] },
  { key: 'green',  name: 'Comets',      sub: 'Verde',   cls: 'tm-green',  color: '#28cc7a', emoji: '☄️',
    members: ['David Henrie', 'Dylan Sprouse', 'Joe Jonas', 'Jennifer Stone'] },
  { key: 'yellow', name: 'Thunderbolt', sub: 'Amarillo',cls: 'tm-yellow', color: '#ffc23d', emoji: '⚡',
    members: ['Selena Gomez', 'Miley Cyrus', 'Kevin Jonas', 'Andrea Guasch'] },
];

// personality test — each option weights a team
const TEST = [
  { q: 'En una fiesta, tú eres…', a: [
    ['quien lo organiza todo', 'green'], ['el alma de la pista', 'yellow'],
    ['quien busca la mejor charla', 'blue'], ['quien llega tarde y épico', 'red'] ] },
  { q: 'Tu peli Disney Channel favorita es más bien…', a: [
    ['drama con corazón', 'blue'], ['comedia gamberra', 'red'],
    ['musical para cantar', 'yellow'], ['aventura mágica', 'green'] ] },
  { q: 'Tu superpoder secreto sería…', a: [
    ['energía infinita', 'yellow'], ['carisma puro', 'blue'],
    ['estrategia maestra', 'green'], ['valentía sin freno', 'red'] ] },
  { q: 'Eliges un look para los Games…', a: [
    ['chándal con purpurina', 'yellow'], ['total black misterioso', 'red'],
    ['pastel y mariposas', 'blue'], ['deportivo técnico', 'green'] ] },
  { q: 'En una prueba por equipos prefieres…', a: [
    ['liderar el plan', 'green'], ['animar a gritos', 'yellow'],
    ['el cuerpo a cuerpo', 'red'], ['unir al grupo', 'blue'] ] },
  { q: 'Tu emoji de cabecera es…', a: [
    ['⚡', 'yellow'], ['🔥', 'red'], ['🌀', 'blue'], ['☄️', 'green'] ] },
  { q: 'Si ganas, lo celebras…', a: [
    ['llorando de la emoción', 'blue'], ['bailando encima de la mesa', 'yellow'],
    ['ya pensando en la próxima', 'green'], ['rugiendo como campeón', 'red'] ] },
];

// "¿Cuánto conoces a Noé?" — placeholder pool (tú las cambiarás)
const QUIZ = [
  { q: '¿Cuál es la peli favorita de Noé?', a: ['placeholder A', 'placeholder B', 'placeholder C', 'placeholder D'], c: 1 },
  { q: '¿Qué pediría Noé en un bar?', a: ['opción 1', 'opción 2', 'opción 3', 'opción 4'], c: 0 },
  { q: '¿Dónde nació Noé?', a: ['ciudad A', 'ciudad B', 'ciudad C', 'ciudad D'], c: 2 },
  { q: 'El mayor talento oculto de Noé es…', a: ['talento 1', 'talento 2', 'talento 3', 'talento 4'], c: 3 },
  { q: '¿Cuál es la serie que Noé ha visto 1000 veces?', a: ['serie A', 'serie B', 'serie C', 'serie D'], c: 0 },
  { q: 'Comida que Noé jamás rechazaría…', a: ['plato 1', 'plato 2', 'plato 3', 'plato 4'], c: 1 },
  { q: '¿Qué canción se sabe Noé de memoria?', a: ['tema A', 'tema B', 'tema C', 'tema D'], c: 2 },
  { q: 'El plan perfecto de finde para Noé es…', a: ['plan 1', 'plan 2', 'plan 3', 'plan 4'], c: 0 },
];

const LEADERS = [
  { n: 'Marta', p: 320, t: 'blue' }, { n: 'Pau', p: 295, t: 'yellow' },
  { n: 'Júlia', p: 270, t: 'red' }, { n: 'Sergi', p: 240, t: 'green' },
  { n: 'Aina', p: 215, t: 'blue' }, { n: 'Bruno', p: 180, t: 'yellow' },
  { n: 'Laia', p: 165, t: 'red' },
];

const REVEAL_DATE = '2026-06-20T18:00:00';
const PARTY_DATE  = '2026-06-27T18:00:00';

// ───────────────────────────────────────── helpers
function useCountdown(targetISO) {
  const calc = () => {
    const diff = Math.max(0, new Date(targetISO).getTime() - Date.now());
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { d, h, m, s, done: diff === 0 };
  };
  const [t, setT] = React.useState(calc);
  React.useEffect(() => { const id = setInterval(() => setT(calc()), 1000); return () => clearInterval(id); }, [targetISO]);
  return t;
}

function CountCells({ cells }) {
  return (
    <div style={{ display: 'flex', gap: 7, justifyContent: 'center' }}>
      {cells.map(([v, l]) => (
        <div key={l} style={{ minWidth: 52, padding: '7px 4px 5px', borderRadius: 14, textAlign: 'center',
          background: 'rgba(255,255,255,.9)', border: '1.5px solid #fff', boxShadow: '0 4px 10px rgba(120,40,150,.18)' }}>
          <div className="nw-pixel" style={{ fontSize: 30, lineHeight: 1, color: 'var(--nw-pink)' }}>{String(v).padStart(2, '0')}</div>
          <div className="nw-bubble-font" style={{ fontSize: 10, color: 'var(--nw-ink-soft)', textTransform: 'uppercase', letterSpacing: '.04em' }}>{l}</div>
        </div>
      ))}
    </div>
  );
}

function Avatar({ size = 52, ring = true }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0, position: 'relative',
      background: 'radial-gradient(circle at 34% 30%, #fff, #ffd0ec 40%, #c79bff 100%)',
      border: ring ? '2.5px solid #fff' : 'none', boxShadow: '0 4px 10px rgba(120,40,150,.25)' }}>
      <Sparkle size={size * 0.34} style={{ top: -4, right: -4 }} dur={2.6} />
    </div>
  );
}

const card = { position: 'relative', overflow: 'hidden' };
const wrapPad = { padding: '0 16px 26px', display: 'flex', flexDirection: 'column', gap: 14 };

// ───────────────────────────────────────── LOGIN
function LoginScreen({ ctx }) {
  const [name, setName] = React.useState(ctx.st.name || '');
  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '40px 26px', gap: 16, position: 'relative', textAlign: 'center' }}>
      <Butterfly size={78} style={{ top: 30, left: 18 }} />
      <Bubble size={40} style={{ top: 70, right: 22 }} dur={8} />
      <Sparkle size={26} style={{ bottom: 120, left: 34 }} />
      <LavaLamp h={120} style={{ bottom: 24, right: 14 }} />

      <Title size={20} kind="chrome" style={{ marginBottom: -6 }}>welcome to</Title>
      <Title size={52}>noé's world</Title>
      <div className="nw-bubble-font" style={{ color: '#fff', fontSize: 15, textShadow: '0 1px 3px rgba(120,20,90,.4)', marginTop: -2 }}>
        ✦ disney channel games ✦<br />el cumple · 27 junio
      </div>

      <div className="nw-card glossy" style={{ ...card, width: '100%', maxWidth: 320, padding: 18, marginTop: 8,
        display: 'flex', flexDirection: 'column', gap: 11 }}>
        <button className="nw-btn ghost" onClick={() => ctx.go('wall')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9 }}>
          <span style={{ fontFamily: 'Arial', fontWeight: 900, fontSize: 18,
            background: 'conic-gradient(from -45deg,#ea4335,#fbbc05,#34a853,#4285f4,#ea4335)',
            WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>G</span>
          Entrar con Google
        </button>
        <div className="nw-bubble-font" style={{ fontSize: 12, color: 'var(--nw-ink-soft)' }}>…y dinos quién eres</div>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="tu nombre ♥"
          className="nw-bubble-font" style={{ border: '2px solid #ffd0ec', borderRadius: 999, padding: '12px 18px',
            fontSize: 16, outline: 'none', textAlign: 'center', color: 'var(--nw-ink)', background: '#fff' }} />
        <button className="nw-btn" disabled={!name.trim()} onClick={() => { ctx.set({ name: name.trim() }); ctx.go('wall'); }}>
          entrar al muro ✦
        </button>
      </div>
    </div>
  );
}

// ───────────────────────────────────────── WALL
function ModuleHead({ children, icon }) {
  return (
    <div className="nw-bubble-font" style={{ fontSize: 15, color: 'var(--nw-violet)', marginBottom: 9, whiteSpace: 'nowrap' }}>
      <span style={{ fontSize: 17, marginRight: 7 }}>{icon}</span>{children}
    </div>
  );
}

function Tweet({ pinned, body, likes = 12, rt = 3, rep = 5, children }) {
  return (
    <div className="nw-card" style={{ ...card, padding: 14 }}>
      {pinned && <div className="nw-bubble-font" style={{ fontSize: 11, color: 'var(--nw-pink)', marginBottom: 6 }}>📌 fijado por Noé</div>}
      <div style={{ display: 'flex', gap: 9, alignItems: 'center', marginBottom: 8 }}>
        <Avatar size={38} />
        <div style={{ lineHeight: 1.15 }}>
          <div className="nw-bubble-font" style={{ fontSize: 15 }}>Noé <span style={{ color: 'var(--nw-pink)' }}>✦</span></div>
          <div className="nw-pixel" style={{ fontSize: 14, color: 'var(--nw-ink-soft)' }}>@noe · hoy</div>
        </div>
      </div>
      {body && <div style={{ fontSize: 14.5, lineHeight: 1.55, color: 'var(--nw-ink)' }}>{body}</div>}
      {children}
      <div className="nw-bubble-font" style={{ display: 'flex', gap: 18, marginTop: 10, color: 'var(--nw-ink-soft)', fontSize: 13 }}>
        <span>♥ {likes}</span><span>↺ {rt}</span><span>💬 {rep}</span>
      </div>
    </div>
  );
}

function WallScreen({ ctx }) {
  const party = useCountdown(PARTY_DATE);
  const reveal = useCountdown(REVEAL_DATE);
  return (
    <div style={wrapPad}>
      {/* profile header */}
      <div className="nw-card glossy" style={{ ...card, padding: 16 }}>
        <Sparkle size={18} style={{ top: 12, right: 14 }} />
        <div style={{ display: 'flex', gap: 13, alignItems: 'center' }}>
          <Avatar size={56} />
          <Title size={27} style={{ textAlign: 'left' }}>noé's world</Title>
        </div>
        <div className="nw-bubble-font" style={{ fontSize: 13, color: 'var(--nw-ink-soft)', marginTop: 10, lineHeight: 1.4 }}>
          ♥ 19 años · "welcome to my cumple"
        </div>
        <div className="nw-pixel" style={{ fontSize: 17, color: 'var(--nw-violet)', marginTop: 5, lineHeight: 1.25 }}>hola, {ctx.st.name || 'invitad@'} ✦</div>
      </div>

      {/* party countdown */}
      <div className="nw-card" style={{ ...card, padding: 14 }}>
        <ModuleHead icon="⏳">faltan para el cumple</ModuleHead>
        <CountCells cells={[[party.d, 'días'], [party.h, 'hrs'], [party.m, 'min'], [party.s, 'seg']]} />
      </div>

      {/* tu equipo */}
      <div className="nw-card" style={{ ...card, padding: 14 }}>
        <Sparkle size={20} style={{ top: 10, right: 12 }} />
        <ModuleHead icon="✦">tu equipo</ModuleHead>
        {ctx.st.sealed ? (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <MiniEnvelope />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1, minWidth: 0 }}>
              <div className="nw-bubble-font" style={{ fontSize: 16, color: 'var(--nw-pink)' }}>¡SELLADO! 🔒</div>
              <div className="nw-bubble-font" style={{ fontSize: 12.5, color: 'var(--nw-ink-soft)' }}>se revela el 20 de junio</div>
              <button className="nw-btn ghost" style={{ fontSize: 13, padding: '7px 14px', alignSelf: 'flex-start' }} onClick={() => ctx.go('sealed')}>ver sobre →</button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <MiniEnvelope />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1, minWidth: 0 }}>
              <div className="nw-bubble-font" style={{ fontSize: 15, color: 'var(--nw-ink)' }}>aún no sabes tu equipo</div>
              <div className="nw-bubble-font" style={{ fontSize: 12.5, color: 'var(--nw-ink-soft)' }}>haz el test para sellarlo</div>
              <button className="nw-btn" style={{ fontSize: 14, padding: '8px 16px', alignSelf: 'flex-start' }} onClick={() => ctx.go('test')}>hacer el test ✦</button>
            </div>
          </div>
        )}
      </div>

      {/* quiz cta */}
      <div className="nw-card" style={{ ...card, padding: 14, display: 'flex', gap: 12, alignItems: 'center' }}>
        <IMac w={62} style={{ position: 'static' }} />
        <div style={{ flex: 1 }}>
          <div className="nw-bubble-font" style={{ fontSize: 15, color: 'var(--nw-violet)' }}>¿cuánto conoces a Noé?</div>
          <div className="nw-bubble-font" style={{ fontSize: 12.5, color: 'var(--nw-ink-soft)' }}>compite en el ranking</div>
        </div>
        <button className="nw-btn" style={{ fontSize: 14, padding: '9px 16px' }} onClick={() => ctx.go('quiz')}>jugar</button>
      </div>

      {/* feed */}
      <ModuleHead icon="📰">novedades</ModuleHead>
      <Tweet pinned likes={24} rt={6} rep={9}
        body={<>Los <b>Disney Channel Games</b> fueron unos juegos de verano donde las estrellas del canal competían por equipos de colores… y este cumple es nuestro homenaje. Prepárate: habrá pruebas, equipos y mucha purpurina. El sobre con tu equipo se abre el 20 ✦</>} />
      <Tweet likes={11} rt={2} rep={4}
        body={<>spoiler: este finde subo las primeras pruebas. id calentando 👀</>} />
    </div>
  );
}

function MiniEnvelope() {
  return (
    <div style={{ width: 78, height: 54, position: 'relative', flexShrink: 0, borderRadius: 8,
      background: 'linear-gradient(180deg,#fff,#ffe6f5)', border: '2px solid #fff',
      boxShadow: '0 5px 12px rgba(120,40,150,.22)' }}>
      <div style={{ position: 'absolute', inset: 0, clipPath: 'polygon(0 0,100% 0,50% 56%)',
        background: 'linear-gradient(180deg,#ffd0ec,#ff8ad1)', borderRadius: '8px 8px 0 0' }} />
      <div style={{ position: 'absolute', left: '50%', top: '46%', transform: 'translate(-50%,-50%)', width: 26, height: 26,
        borderRadius: '50%', background: 'var(--nw-candy)', border: '2px solid #fff', display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontSize: 12, zIndex: 2 }}>🔒</div>
    </div>
  );
}

// ───────────────────────────────────────── TEST
function TestScreen({ ctx }) {
  const [i, setI] = React.useState(0);
  const [scores, setScores] = React.useState({ red: 0, blue: 0, green: 0, yellow: 0 });
  const total = TEST.length;
  const choose = (teamKey) => {
    const next = { ...scores, [teamKey]: scores[teamKey] + 1 };
    if (i + 1 >= total) {
      // pick winner (hidden from user)
      const win = Object.entries(next).sort((a, b) => b[1] - a[1])[0][0];
      ctx.set({ sealed: true, team: win });
      ctx.go('sealed');
    } else { setScores(next); setI(i + 1); }
  };
  const q = TEST[i];
  return (
    <div style={{ ...wrapPad, paddingTop: 6 }}>
      <div className="nw-card" style={{ ...card, padding: 16 }}>
        <Sparkle size={22} style={{ top: 10, right: 12 }} />
        <div className="nw-bubble-font" style={{ fontSize: 12.5, color: 'var(--nw-ink-soft)', marginBottom: 6 }}>
          pregunta {i + 1} de {total}
        </div>
        <div className="nw-bar" style={{ marginBottom: 14 }}><i style={{ width: `${((i) / total) * 100}%`, transition: 'width .3s' }} /></div>
        <div className="nw-bubble-font" style={{ fontSize: 22, color: 'var(--nw-violet)', lineHeight: 1.15, marginBottom: 12 }}>{q.q}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {q.a.map(([label, team], k) => (
            <button key={k} className="nw-btn ghost" style={{ textAlign: 'left', justifyContent: 'flex-start', fontSize: 15.5 }}
              onClick={() => choose(team)}>
              <span style={{ marginRight: 8, color: 'var(--nw-pink)' }}>{'ABCD'[k]}</span>{label}
            </button>
          ))}
        </div>
      </div>
      <div className="nw-bubble-font" style={{ textAlign: 'center', fontSize: 12.5, color: '#fff', textShadow: '0 1px 2px rgba(120,20,90,.4)' }}>
        psst: tu resultado quedará sellado hasta el 20 de junio ✦
      </div>
    </div>
  );
}

// ───────────────────────────────────────── SEALED
function SealedScreen({ ctx }) {
  const reveal = useCountdown(REVEAL_DATE);
  return (
    <div style={{ ...wrapPad, paddingTop: 12, alignItems: 'center', textAlign: 'center' }}>
      <Sparkle size={30} style={{ top: 30, left: 26 }} />
      <Sparkle size={20} style={{ top: 90, right: 30 }} dur={2.6} />
      <Bubble size={34} style={{ top: 60, right: 18 }} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Title size={28}>tu equipo está</Title>
        <Title size={46} kind="chrome">SELLADO</Title>
      </div>
      <div className="nw-bubble-font" style={{ color: '#fff', fontSize: 14, textShadow: '0 1px 3px rgba(120,20,90,.4)' }}>
        nadie lo verá hasta el día de la revelación
      </div>
      <BigEnvelope />
      <div className="nw-card" style={{ ...card, padding: 14, width: '100%' }}>
        <div className="nw-bubble-font" style={{ fontSize: 15, color: 'var(--nw-violet)', textAlign: 'center', marginBottom: 9 }}>⏳ se abre en…</div>
        <CountCells cells={[[reveal.d, 'días'], [reveal.h, 'hrs'], [reveal.m, 'min'], [reveal.s, 'seg']]} />
        <div className="nw-bubble-font" style={{ fontSize: 12.5, color: 'var(--nw-ink-soft)', marginTop: 9 }}>20 de junio · 18:00</div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
        {TEAMS.map((t) => (
          <span key={t.key} className="nw-chip">
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: t.color, border: '1.5px solid #fff' }} />
            {t.emoji} {t.name}
          </span>
        ))}
      </div>
      <button className="nw-btn ghost" onClick={() => ctx.go('wall')}>volver al muro</button>
    </div>
  );
}

function BigEnvelope() {
  return (
    <div style={{ width: 200, height: 134, position: 'relative', margin: '6px auto' }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 12, background: 'linear-gradient(180deg,#fff,#ffe6f5)',
        border: '3px solid #fff', boxShadow: '0 14px 30px rgba(120,40,150,.3)' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '64%', clipPath: 'polygon(0 0,100% 0,50% 96%)',
        background: 'linear-gradient(180deg,#ffd0ec,#ff5fb0)', borderRadius: '12px 12px 0 0' }} />
      <div style={{ position: 'absolute', left: '50%', top: '52%', transform: 'translate(-50%,-50%)', width: 52, height: 52,
        borderRadius: '50%', background: 'var(--nw-candy)', border: '3px solid #fff', zIndex: 3,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
        boxShadow: '0 6px 14px rgba(160,40,150,.4)' }}>🔒</div>
      <Sparkle size={20} style={{ top: -6, right: 8, zIndex: 4 }} />
    </div>
  );
}

// ───────────────────────────────────────── QUIZ
function QuizScreen({ ctx }) {
  const [phase, setPhase] = React.useState('intro'); // intro | play | done
  const [i, setI] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [picked, setPicked] = React.useState(null);
  const [time, setTime] = React.useState(12);

  React.useEffect(() => {
    if (phase !== 'play' || picked !== null) return;
    if (time <= 0) { lockIn(-1); return; }
    const id = setTimeout(() => setTime((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, time, picked]);

  const start = () => { setPhase('play'); setI(0); setScore(0); setPicked(null); setTime(12); };
  const lockIn = (k) => {
    setPicked(k);
    const correct = k === QUIZ[i].c;
    const gained = correct ? 10 + Math.max(0, time) : 0;
    if (correct) setScore((s) => s + gained);
    setTimeout(() => {
      if (i + 1 >= QUIZ.length) { setPhase('done'); }
      else { setI(i + 1); setPicked(null); setTime(12); }
    }, 950);
  };

  if (phase === 'intro') {
    return (
      <div style={{ ...wrapPad, paddingTop: 16, alignItems: 'center', textAlign: 'center' }}>
        <IMac w={108} style={{ position: 'static', marginTop: 8 }} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <Title size={32}>¿cuánto conoces</Title>
          <Title size={40}>a Noé?</Title>
        </div>
        <div className="nw-bubble-font" style={{ color: '#fff', fontSize: 14.5, textShadow: '0 1px 3px rgba(120,20,90,.4)', maxWidth: 280 }}>
          {QUIZ.length} preguntas · responde rápido para más puntos · sube en el ranking
        </div>
        <div className="nw-chip on"><span className="nw-pixel" style={{ fontSize: 17 }}>tu mejor: {ctx.st.best || 0} pts</span></div>
        <button className="nw-btn" onClick={start}>empezar ✦</button>
        <button className="nw-btn ghost" onClick={() => ctx.go('rank')}>ver ranking</button>
      </div>
    );
  }

  if (phase === 'done') {
    const best = Math.max(ctx.st.best || 0, score);
    if (best !== (ctx.st.best || 0)) ctx.set({ best });
    return (
      <div style={{ ...wrapPad, paddingTop: 24, alignItems: 'center', textAlign: 'center' }}>
        <Sparkle size={30} style={{ top: 30, left: 30 }} /><Bubble size={34} style={{ top: 50, right: 22 }} />
        <Title size={32}>¡bien hecho!</Title>
        <div className="nw-card glossy" style={{ ...card, padding: 22, width: '100%' }}>
          <div className="nw-bubble-font" style={{ fontSize: 14, color: 'var(--nw-ink-soft)' }}>has conseguido</div>
          <div className="nw-pixel nw-holo-text" style={{ fontSize: 64, lineHeight: 1 }}>{score}</div>
          <div className="nw-bubble-font" style={{ fontSize: 16, color: 'var(--nw-violet)' }}>puntos ✦</div>
        </div>
        <div className="nw-chip on" style={{ fontSize: 14 }}>mejor marca: {best} pts</div>
        <button className="nw-btn" onClick={start}>jugar otra vez</button>
        <button className="nw-btn ghost" onClick={() => ctx.go('rank')}>ver ranking →</button>
      </div>
    );
  }

  const q = QUIZ[i];
  return (
    <div style={{ ...wrapPad, paddingTop: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="nw-chip">{i + 1}/{QUIZ.length}</span>
        <span className="nw-chip" style={{ color: time <= 4 ? '#fff' : 'var(--nw-violet)', background: time <= 4 ? 'var(--nw-candy)' : 'rgba(255,255,255,.85)' }}>
          <span className="nw-pixel" style={{ fontSize: 16 }}>⏱ {String(time).padStart(2, '0')}</span>
        </span>
        <span className="nw-chip on"><span className="nw-pixel" style={{ fontSize: 16 }}>{score} pts</span></span>
      </div>
      <div className="nw-card glossy" style={{ ...card, padding: 18, textAlign: 'center' }}>
        <Sparkle size={18} style={{ top: 8, left: 10 }} />
        <div className="nw-bubble-font" style={{ fontSize: 21, color: 'var(--nw-violet)', lineHeight: 1.2 }}>{q.q}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {q.a.map((label, k) => {
          let extra = {};
          if (picked !== null) {
            if (k === q.c) extra = { background: 'linear-gradient(135deg,#28cc7a,#8affd6)', color: '#fff' };
            else if (k === picked) extra = { background: 'linear-gradient(135deg,#ff5a5f,#ff8ad1)', color: '#fff' };
            else extra = { opacity: .6 };
          }
          return (
            <button key={k} className="nw-btn ghost" disabled={picked !== null}
              style={{ textAlign: 'left', justifyContent: 'flex-start', fontSize: 15.5, ...extra }}
              onClick={() => lockIn(k)}>
              <span style={{ marginRight: 8, color: 'var(--nw-pink)' }}>{'ABCD'[k]}</span>{label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ───────────────────────────────────────── RANK
function RankScreen({ ctx }) {
  const me = { n: ctx.st.name || 'Tú', p: ctx.st.best || 0, t: ctx.st.team || 'blue' };
  const all = [...LEADERS, me].sort((a, b) => b.p - a.p);
  const myRank = all.findIndex((x) => x === me) + 1;
  // team standings (sum)
  const sums = {};
  all.forEach((x) => { sums[x.t] = (sums[x.t] || 0) + x.p; });
  const maxSum = Math.max(1, ...Object.values(sums));
  const standings = TEAMS.map((t) => ({ ...t, sum: sums[t.key] || 0 })).sort((a, b) => b.sum - a.sum);

  return (
    <div style={wrapPad}>
      <Title size={34} style={{ textAlign: 'center', marginTop: 4 }}>marcador</Title>

      <div className="nw-card" style={{ ...card, padding: 14 }}>
        <Sparkle size={18} style={{ top: 10, right: 12 }} />
        <ModuleHead icon="✦">por equipos</ModuleHead>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {standings.map((t) => (
            <div key={t.key} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <span style={{ width: 24, textAlign: 'center', fontSize: 16 }}>{t.emoji}</span>
              <div className="nw-bar" style={{ flex: 1 }}>
                <i style={{ width: `${(t.sum / maxSum) * 100}%`, background: t.color }} />
              </div>
              <span className="nw-pixel" style={{ fontSize: 16, color: 'var(--nw-violet)', minWidth: 38, textAlign: 'right' }}>{t.sum}</span>
            </div>
          ))}
        </div>
      </div>

      <ModuleHead icon="🏆">individual</ModuleHead>
      <div className="nw-card" style={{ ...card, padding: '6px 14px' }}>
        {all.slice(0, 7).map((x, idx) => {
          const team = TEAMS.find((t) => t.key === x.t);
          const isMe = x === me;
          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0',
              borderBottom: idx < 6 ? '1.5px dashed rgba(168,92,255,.2)' : 'none' }}>
              <span className="nw-bubble-font" style={{ width: 22, fontSize: 16, color: idx < 3 ? 'var(--nw-pink)' : 'var(--nw-ink-soft)' }}>{idx + 1}</span>
              <Avatar size={28} ring={false} />
              <span className="nw-bubble-font" style={{ flex: 1, fontSize: 15, color: isMe ? 'var(--nw-pink)' : 'var(--nw-ink)' }}>{x.n}{isMe && ' (tú)'}</span>
              <span style={{ width: 11, height: 11, borderRadius: '50%', background: team ? team.color : '#ccc' }} />
              <span className="nw-pixel" style={{ fontSize: 16, color: 'var(--nw-violet)', minWidth: 36, textAlign: 'right' }}>{x.p}</span>
            </div>
          );
        })}
      </div>

      <div className="nw-card glossy" style={{ ...card, padding: 14, display: 'flex', alignItems: 'center', gap: 10,
        outline: '2px solid #fff', boxShadow: '0 0 0 3px var(--nw-pink), 0 10px 24px rgba(120,30,130,.25)' }}>
        <span className="nw-bubble-font" style={{ fontSize: 18, color: 'var(--nw-pink)' }}>#{myRank}</span>
        <Avatar size={34} />
        <div style={{ flex: 1 }}>
          <div className="nw-bubble-font" style={{ fontSize: 15 }}>{me.n}</div>
          <div className="nw-bubble-font" style={{ fontSize: 12, color: 'var(--nw-ink-soft)' }}>tu posición</div>
        </div>
        <span className="nw-pixel" style={{ fontSize: 22, color: 'var(--nw-violet)' }}>{me.p}</span>
      </div>
      <button className="nw-btn" onClick={() => ctx.go('quiz')}>subir puntos ✦</button>
    </div>
  );
}

Object.assign(window, {
  TEAMS, TEST, QUIZ, LEADERS, REVEAL_DATE, PARTY_DATE,
  LoginScreen, WallScreen, TestScreen, SealedScreen, QuizScreen, RankScreen,
});
