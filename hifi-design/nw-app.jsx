// nw-app.jsx — app shell for "noé's world": iPhone frame, top nav, state, tweaks.
// Depends on globals from nw-kit.jsx, nw-screens.jsx, ios-frame.jsx, tweaks-panel.jsx.

const NW_KEY = 'nw-state-v3';
function loadState() {
  try { return JSON.parse(localStorage.getItem(NW_KEY)) || {}; } catch (e) { return {}; }
}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "intensity": 1,
  "palette": ["#ff5fb0", "#a85cff"],
  "bg": "holo",
  "script": "Pacifico",
  "pixelCursor": true
}/*EDITMODE-END*/;

const BG_PRESETS = {
  holo: 'radial-gradient(120% 80% at 20% 0%, #ff8fd0 0%, rgba(255,143,208,0) 55%),'
      + 'radial-gradient(120% 90% at 95% 15%, #b18cff 0%, rgba(177,140,255,0) 50%),'
      + 'radial-gradient(130% 90% at 50% 110%, #ff5fb0 0%, rgba(255,95,176,0) 55%),'
      + 'linear-gradient(160deg,#ff63b6 0%,#c860ff 100%)',
  flat: 'linear-gradient(180deg,#ff4da6,#ff4da6)',
  grad: 'linear-gradient(165deg,#ff77c2 0%,#a05cff 100%)',
};

function TopBar({ screen, go, sealed }) {
  const tabs = [
    ['wall', 'muro'], ['test', sealed ? 'equipo' : 'test'], ['quiz', 'quiz'], ['rank', 'ranking'],
  ];
  const activeFor = (k) => (k === 'test' ? (screen === 'test' || screen === 'sealed') : screen === k);
  return (
    <div style={{ position: 'relative', zIndex: 6, paddingTop: 48 }}>
      <div style={{ background: 'var(--nw-candy)', boxShadow: '0 4px 14px rgba(150,30,120,.3)',
        padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div className="nw-script" style={{ fontSize: 21, color: '#fff', WebkitTextStroke: '0', filter: 'drop-shadow(1px 1px 0 rgba(120,20,90,.5))', whiteSpace: 'nowrap' }}>
          noé's world
        </div>
        <div className="nw-tabbar" style={{ marginLeft: 'auto', overflowX: 'auto' }}>
          {tabs.map(([k, label]) => (
            <div key={k} className={'nw-tab' + (activeFor(k) ? ' on' : '')}
              onClick={() => go(k === 'test' && sealed ? 'sealed' : k)}>{label}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StageDecor() {
  // decorative bits OUTSIDE the phone, on the studio backdrop
  return (
    <div aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
      <Sparkle size={40} style={{ top: '12%', left: '12%' }} />
      <Sparkle size={26} style={{ top: '70%', left: '18%' }} dur={2.8} delay={.4} />
      <Sparkle size={34} style={{ top: '22%', right: '13%' }} dur={3.6} delay={.2} />
      <Bubble size={56} style={{ top: '60%', right: '10%' }} dur={9} />
      <Bubble size={34} style={{ top: '14%', right: '24%' }} dur={7} delay={1} />
      <Heart size={30} style={{ top: '80%', right: '20%' }} />
      <Butterfly size={86} style={{ top: '6%', left: '28%' }} />
    </div>
  );
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const initial = loadState();
  const [st, setSt] = React.useState({
    screen: initial.name ? (initial.screen || 'wall') : 'login',
    name: initial.name || '', sealed: !!initial.sealed, team: initial.team || null, best: initial.best || 0,
  });
  const [scale, setScale] = React.useState(1);

  // persist
  React.useEffect(() => {
    const { screen, name, sealed, team, best } = st;
    localStorage.setItem(NW_KEY, JSON.stringify({ screen, name, sealed, team, best }));
  }, [st]);

  // apply tweaks to :root
  React.useEffect(() => {
    const r = document.documentElement.style;
    r.setProperty('--nw-glitter', String(t.intensity));
    const [p1, p2] = t.palette;
    r.setProperty('--nw-candy', `linear-gradient(135deg,${p1} 0%,${p2} 100%)`);
    r.setProperty('--nw-pink', p1); r.setProperty('--nw-purple', p2);
    r.setProperty('--nw-font-script', `'${t.script}',cursive`);
    document.querySelectorAll('.nw-bg').forEach((el) => { el.style.setProperty('--bgp', ''); });
  }, [t]);

  // device scaling to fit viewport
  React.useEffect(() => {
    const fit = () => {
      const s = Math.min((window.innerWidth - 36) / 402, (window.innerHeight - 36) / 874, 1.08);
      setScale(Math.max(0.3, s));
    };
    fit(); window.addEventListener('resize', fit); return () => window.removeEventListener('resize', fit);
  }, []);

  const go = (screen) => setSt((s) => ({ ...s, screen }));
  const set = (patch) => setSt((s) => ({ ...s, ...patch }));
  const ctx = { go, set, st };

  const Screen = {
    login: LoginScreen, wall: WallScreen, test: TestScreen,
    sealed: SealedScreen, quiz: QuizScreen, rank: RankScreen,
  }[st.screen] || WallScreen;

  const decorKind = (st.screen === 'wall') ? 'wall' : 'plain';
  const bgStyle = BG_PRESETS[t.bg] || BG_PRESETS.holo;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
      background: 'radial-gradient(80% 60% at 50% 0%, #6a2a86 0%, #3a1450 60%, #220a33 100%)' }}>
      <NWStyles />
      <StageDecor />
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'center', position: 'relative', zIndex: 2 }}>
        <IOSDevice dark>
          <div className="nw-app" style={{ height: '100%', position: 'relative', display: 'flex',
            flexDirection: 'column', overflow: 'hidden', cursor: t.pixelCursor ? undefined : 'auto' }}>
            <div className="nw-bg" style={{ background: undefined }}>
              <div style={{ position: 'absolute', inset: '-20%', background: bgStyle }} />
            </div>
            <div className="nw-glint" />
            <Decor kind={decorKind} />
            {st.screen !== 'login' && <TopBar screen={st.screen} go={go} sealed={st.sealed} />}
            <div className="nw-scroll" style={{ flex: 1, overflow: 'auto', position: 'relative', zIndex: 2,
              paddingTop: st.screen === 'login' ? 0 : 12 }}>
              <Screen ctx={ctx} />
            </div>
          </div>
        </IOSDevice>
      </div>

      <TweaksPanel>
        <TweakSection label="Y2K" />
        <TweakSlider label="Intensidad glitter" value={t.intensity} min={0} max={1} step={0.1}
          onChange={(v) => setTweak('intensity', v)} />
        <TweakColor label="Paleta" value={t.palette}
          options={[["#ff5fb0", "#a85cff"], ["#ff7a4d", "#ff3d9a"], ["#5fd0ff", "#a85cff"], ["#ff4da0", "#ffd24d"]]}
          onChange={(v) => setTweak('palette', v)} />
        <TweakRadio label="Fondo" value={t.bg} options={[{ value: 'holo', label: 'holo' }, { value: 'grad', label: 'degr.' }, { value: 'flat', label: 'plano' }]}
          onChange={(v) => setTweak('bg', v)} />
        <TweakSection label="Tipografía" />
        <TweakSelect label="Script título" value={t.script}
          options={['Pacifico', 'Satisfy', 'Yellowtail', 'Lobster Two', 'Sacramento']}
          onChange={(v) => setTweak('script', v)} />
        <TweakSection label="Detalles" />
        <TweakToggle label="Cursor pixel" value={t.pixelCursor} onChange={(v) => setTweak('pixelCursor', v)} />
        <TweakButton label="Reiniciar mi progreso" secondary onClick={() => {
          localStorage.removeItem(NW_KEY);
          setSt({ screen: 'login', name: '', sealed: false, team: null, best: 0 });
        }} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
