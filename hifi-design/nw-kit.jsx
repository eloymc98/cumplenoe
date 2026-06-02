// nw-kit.jsx — Y2K visual kit for "noé's world"
// Decorative stickers, glitter/chrome text, UI atoms + global style injection.
// Exports to window. High-intensity 2000s Disney-Channel / MySpace aesthetic.

// ───────────────────────────────────────── global styles
const NW_STYLE = `
:root{
  --nw-pink:#ff3d9a; --nw-pink2:#ff8ad1; --nw-purple:#a85cff; --nw-violet:#7b3ff2;
  --nw-blue:#56d6ff; --nw-mint:#8affd6; --nw-yellow:#ffe14d;
  --nw-ink:#4a1d57; --nw-ink-soft:#8a5a8f;
  --nw-candy:linear-gradient(135deg,#ff5fb0 0%,#a85cff 100%);
  --nw-candy2:linear-gradient(135deg,#ffd24d 0%,#ff5fb0 100%);
  --nw-holo:linear-gradient(110deg,#ffd6f5 0%,#c5b3ff 16%,#9be7ff 34%,#b6ffd9 52%,#fff3a8 70%,#ffc6e6 88%,#ffd6f5 100%);
  --nw-chrome:linear-gradient(180deg,#ffffff 0%,#eaf0ff 26%,#b7c2e0 50%,#f1f4ff 60%,#c6d0ee 80%,#ffffff 100%);
  --nw-font-script:'Pacifico',cursive;
  --nw-font-bubble:'Baloo 2',system-ui,sans-serif;
  --nw-font-body:'Quicksand',system-ui,sans-serif;
  --nw-font-pixel:'VT323',monospace;
  --nw-glitter: 1;
}
.nw-app *{box-sizing:border-box}
.nw-app{font-family:var(--nw-font-body);color:var(--nw-ink);
  cursor:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M3 2l0 17 4.2-4.2 2.6 6 3-1.3-2.6-5.9 5.8 0z' fill='white' stroke='%237b3ff2' stroke-width='1.4' stroke-linejoin='round'/%3E%3C/svg%3E") 3 2, auto;}

/* holographic shimmer surface (app bg) */
.nw-bg{position:absolute;inset:0;overflow:hidden;z-index:0}
.nw-bg::before{content:"";position:absolute;inset:-20%;
  background:
   radial-gradient(120% 80% at 20% 0%, #ff8fd0 0%, rgba(255,143,208,0) 55%),
   radial-gradient(120% 90% at 95% 15%, #b18cff 0%, rgba(177,140,255,0) 50%),
   radial-gradient(130% 90% at 50% 110%, #ff5fb0 0%, rgba(255,95,176,0) 55%),
   linear-gradient(160deg,#ff63b6 0%,#c860ff 100%);}
.nw-bg::after{content:"";position:absolute;inset:0;mix-blend-mode:soft-light;opacity:calc(.5*var(--nw-glitter));
  background:var(--nw-holo);background-size:300% 300%;animation:nw-shimmer 9s ease-in-out infinite alternate;}
.nw-glint{position:absolute;inset:0;pointer-events:none;opacity:calc(.55*var(--nw-glitter));z-index:1;
  background-image:
   radial-gradient(rgba(255,255,255,.9) 1px, transparent 1.4px),
   radial-gradient(rgba(255,255,255,.6) 1px, transparent 1.4px);
  background-size:46px 46px, 78px 78px; background-position:0 0, 23px 31px;}

@keyframes nw-shimmer{0%{background-position:0% 50%}100%{background-position:100% 50%}}
@keyframes nw-twinkle{0%,100%{transform:scale(.6) rotate(0deg);opacity:.55}50%{transform:scale(1.05) rotate(20deg);opacity:1}}
@keyframes nw-float{0%{transform:translateY(0) translateX(0)}50%{transform:translateY(-12px) translateX(5px)}100%{transform:translateY(0) translateX(0)}}
@keyframes nw-bob{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-7px) rotate(3deg)}}
@keyframes nw-blob{0%{transform:translateY(8%) scale(1,.9);border-radius:50% 50% 46% 54%}
  50%{transform:translateY(-58%) scale(.86,1.18);border-radius:46% 54% 52% 48%}
  100%{transform:translateY(8%) scale(1.06,.86);border-radius:54% 46% 50% 50%}}
@keyframes nw-popin{0%{transform:scale(.6) translateY(14px);opacity:0}60%{transform:scale(1.05)}100%{transform:scale(1) translateY(0);opacity:1}}
@keyframes nw-spin{to{transform:rotate(360deg)}}
@keyframes nw-hue{to{filter:hue-rotate(360deg)}}

/* glitter/chrome text */
.nw-script{font-family:var(--nw-font-script);font-weight:400;line-height:1.05;
  -webkit-text-stroke:1.4px rgba(255,255,255,.9);
  paint-order:stroke fill;
  filter:drop-shadow(2px 3px 0 rgba(123,63,242,.45)) drop-shadow(0 2px 6px rgba(150,30,120,.3));}
.nw-holo-text{background:var(--nw-holo);background-size:240% auto;-webkit-background-clip:text;background-clip:text;
  color:transparent;animation:nw-shimmer 6s linear infinite alternate;}
.nw-chrome-text{background:var(--nw-chrome);-webkit-background-clip:text;background-clip:text;color:transparent;
  -webkit-text-stroke:1.2px rgba(90,70,160,.55);paint-order:stroke fill;
  filter:drop-shadow(1px 2px 0 rgba(123,63,242,.4));}
.nw-bubble-font{font-family:var(--nw-font-bubble);font-weight:800;letter-spacing:-.01em}
.nw-pixel{font-family:var(--nw-font-pixel);font-variant-numeric:tabular-nums;letter-spacing:.02em}

/* cards / surfaces */
.nw-card{background:rgba(255,255,255,.78);backdrop-filter:blur(9px);-webkit-backdrop-filter:blur(9px);
  border:1.6px solid #fff;border-radius:22px;
  box-shadow:0 10px 26px rgba(120,30,130,.20),inset 0 1px 0 rgba(255,255,255,.95);}
.nw-card.glossy::before{content:"";position:absolute;left:6px;right:6px;top:5px;height:34%;border-radius:18px 18px 40% 40%;
  background:linear-gradient(180deg,rgba(255,255,255,.55),rgba(255,255,255,0));pointer-events:none}

/* buttons */
.nw-btn{font-family:var(--nw-font-bubble);font-weight:800;font-size:17px;border:none;cursor:pointer;
  border-radius:999px;padding:13px 22px;color:#fff;position:relative;overflow:hidden;
  background:var(--nw-candy);box-shadow:0 6px 0 rgba(140,24,110,.40),0 12px 22px rgba(160,40,150,.34);
  transition:transform .12s ease, box-shadow .12s ease;text-shadow:0 1px 1px rgba(120,20,90,.35)}
.nw-btn::before{content:"";position:absolute;left:8px;right:8px;top:5px;height:42%;border-radius:999px;
  background:linear-gradient(180deg,rgba(255,255,255,.6),rgba(255,255,255,0));pointer-events:none}
.nw-btn:active{transform:translateY(4px);box-shadow:0 2px 0 rgba(140,24,110,.40),0 6px 12px rgba(160,40,150,.3)}
.nw-btn.ghost{background:rgba(255,255,255,.7);color:var(--nw-violet);box-shadow:0 5px 0 rgba(168,92,255,.32),0 10px 18px rgba(120,40,150,.18)}
.nw-btn.ghost:active{transform:translateY(3px);box-shadow:0 2px 0 rgba(168,92,255,.32)}
.nw-btn[disabled]{filter:grayscale(.35) brightness(.96);opacity:.8;cursor:not-allowed}

/* chips / pills */
.nw-chip{font-family:var(--nw-font-bubble);font-weight:700;font-size:13px;display:inline-flex;align-items:center;gap:5px;white-space:nowrap;
  padding:6px 12px;border-radius:999px;background:rgba(255,255,255,.85);color:var(--nw-violet);
  border:1.4px solid #fff;box-shadow:0 3px 8px rgba(120,40,150,.16)}
.nw-chip.on{background:var(--nw-candy);color:#fff}

/* tab bar (top, 2000s) */
.nw-tabbar{display:flex;gap:6px;align-items:center}
.nw-tab{font-family:var(--nw-font-bubble);font-weight:800;font-size:13px;color:#fff;opacity:.72;
  padding:7px 11px;border-radius:999px;cursor:pointer;white-space:nowrap;
  transition:opacity .15s, background .15s, transform .12s}
.nw-tab.on{opacity:1;background:rgba(255,255,255,.28);box-shadow:inset 0 0 0 1.4px rgba(255,255,255,.6)}
.nw-tab:active{transform:scale(.94)}

/* scrollbar */
.nw-scroll{scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.6) transparent}
.nw-scroll::-webkit-scrollbar{width:7px}
.nw-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,.6);border-radius:4px}

/* team color tokens */
.tm-red{--tm:#ff5a5f} .tm-blue{--tm:#3aa0ff} .tm-green{--tm:#28cc7a} .tm-yellow{--tm:#ffc23d}

/* bars */
.nw-bar{height:12px;border-radius:999px;background:rgba(255,255,255,.55);overflow:hidden;border:1.5px solid #fff}
.nw-bar>i{display:block;height:100%;border-radius:999px;background:var(--nw-candy)}
`;

function NWStyles() { return <style dangerouslySetInnerHTML={{ __html: NW_STYLE }} />; }

// ───────────────────────────────────────── decorative atoms
function Sparkle({ size = 26, style = {}, dur = 3.2, delay = 0 }) {
  return (
    <span aria-hidden="true" style={{
      position: 'absolute', width: size, height: size, pointerEvents: 'none',
      background: 'conic-gradient(from 210deg,#fff,#bfe0ff,#ffd1ef,#c3c9ff,#fff,#ecd6ff,#fff)',
      clipPath: 'polygon(50% 0%,58% 42%,100% 50%,58% 58%,50% 100%,42% 58%,0% 50%,42% 42%)',
      filter: 'drop-shadow(0 1px 2px rgba(120,60,160,.5))',
      animation: `nw-twinkle ${dur}s ease-in-out ${delay}s infinite`, ...style,
    }} />
  );
}

function Bubble({ size = 34, style = {}, dur = 7, delay = 0 }) {
  return (
    <span aria-hidden="true" style={{
      position: 'absolute', width: size, height: size, borderRadius: '50%', pointerEvents: 'none',
      background: 'radial-gradient(circle at 32% 26%, rgba(255,255,255,.95), rgba(255,255,255,0) 38%),'
        + 'radial-gradient(circle at 72% 76%, rgba(255,150,220,.5), rgba(255,150,220,0) 52%),'
        + 'radial-gradient(circle at 50% 55%, rgba(150,200,255,.5), rgba(180,255,235,.34) 72%, rgba(255,255,255,.1))',
      border: '1px solid rgba(255,255,255,.75)',
      boxShadow: 'inset 0 0 10px rgba(255,255,255,.55), 0 2px 10px rgba(150,100,200,.22)',
      animation: `nw-float ${dur}s ease-in-out ${delay}s infinite`, ...style,
    }} />
  );
}

function Heart({ size = 22, style = {}, color = '#ff4da0' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"
      style={{ position: 'absolute', pointerEvents: 'none', filter: 'drop-shadow(0 2px 2px rgba(180,30,110,.4))', ...style }}>
      <defs>
        <linearGradient id={'hg' + size + (style.top || '') } x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".9" />
          <stop offset=".4" stopColor={color} />
          <stop offset="1" stopColor="#c81f7a" />
        </linearGradient>
      </defs>
      <path d="M12 21s-8-5.2-8-11.1C4 6.3 6.3 4 9.1 4c1.7 0 3 .9 2.9 2.5C12 4.9 13.3 4 15 4c2.8 0 5 2.3 5 5.9C20 15.8 12 21 12 21z"
        fill={`url(#hg${size}${style.top || ''})`} stroke="#fff" strokeWidth="1.2" />
    </svg>
  );
}

function Butterfly({ size = 64, style = {}, float = true }) {
  const id = 'bf' + Math.round(size) + (style.top || '') + (style.left || '');
  return (
    <svg width={size} height={size * 0.86} viewBox="0 0 100 86" aria-hidden="true"
      style={{ position: 'absolute', pointerEvents: 'none',
        filter: 'drop-shadow(0 4px 6px rgba(120,40,150,.4))',
        animation: float ? 'nw-bob 5s ease-in-out infinite' : 'none', ...style }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd6f5" /><stop offset=".3" stopColor="#b9a8ff" />
          <stop offset=".55" stopColor="#8fe6ff" /><stop offset=".78" stopColor="#a8ffd8" />
          <stop offset="1" stopColor="#fff3a8" />
        </linearGradient>
      </defs>
      <g stroke="#fff" strokeWidth="2">
        <path d="M50 43C44 22 30 12 18 16C6 20 6 38 20 42C8 44 8 62 22 64C34 66 45 56 50 43Z" fill={`url(#${id})`} />
        <path d="M50 43C56 22 70 12 82 16C94 20 94 38 80 42C92 44 92 62 78 64C66 66 55 56 50 43Z" fill={`url(#${id})`} />
      </g>
      <ellipse cx="50" cy="44" rx="3.2" ry="16" fill="#7b3ff2" />
      <path d="M50 30C48 22 44 17 40 14M50 30C52 22 56 17 60 14" stroke="#7b3ff2" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="40" cy="13" r="2.4" fill="#ff4da0" /><circle cx="60" cy="13" r="2.4" fill="#ff4da0" />
    </svg>
  );
}

function LavaLamp({ h = 116, style = {} }) {
  const w = h * 0.42;
  return (
    <div aria-hidden="true" style={{ position: 'absolute', width: w, height: h, pointerEvents: 'none',
      filter: 'drop-shadow(0 6px 8px rgba(120,40,150,.35))', animation: 'nw-bob 6s ease-in-out infinite', ...style }}>
      {/* cap */}
      <div style={{ position: 'absolute', top: 0, left: '18%', width: '64%', height: h * 0.1,
        background: 'linear-gradient(180deg,#fff,#b9c2dd)', borderRadius: '6px 6px 2px 2px' }} />
      {/* glass body */}
      <div style={{ position: 'absolute', top: h * 0.09, left: '8%', width: '84%', height: h * 0.72, overflow: 'hidden',
        borderRadius: '40% 40% 18% 18%',
        background: 'linear-gradient(180deg, rgba(255,120,200,.55), rgba(120,90,255,.6))',
        border: '1.5px solid rgba(255,255,255,.75)', boxShadow: 'inset 0 0 12px rgba(255,255,255,.5)' }}>
        <div style={{ position: 'absolute', left: '24%', bottom: 0, width: '46%', height: '46%',
          background: 'radial-gradient(circle at 35% 30%, #fff7a8, #ff8a3d)', animation: 'nw-blob 5s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', left: '12%', bottom: 0, width: '34%', height: '34%',
          background: 'radial-gradient(circle at 35% 30%, #fff7a8, #ff5fae)', animation: 'nw-blob 6.6s ease-in-out .8s infinite' }} />
        <div style={{ position: 'absolute', left: '52%', bottom: 0, width: '30%', height: '30%',
          background: 'radial-gradient(circle at 35% 30%, #d8fff0, #56d6ff)', animation: 'nw-blob 7.8s ease-in-out 1.6s infinite' }} />
      </div>
      {/* base */}
      <div style={{ position: 'absolute', bottom: 0, left: '4%', width: '92%', height: h * 0.16,
        background: 'linear-gradient(180deg,#eef2ff,#9aa6c8)', borderRadius: '8px 8px 9px 9px',
        clipPath: 'polygon(16% 0,84% 0,100% 100%,0 100%)' }} />
    </div>
  );
}

function IMac({ w = 92, style = {} }) {
  return (
    <svg width={w} height={w} viewBox="0 0 100 100" aria-hidden="true"
      style={{ position: 'absolute', pointerEvents: 'none', filter: 'drop-shadow(0 5px 8px rgba(120,40,150,.35))',
        animation: 'nw-bob 7s ease-in-out infinite', ...style }}>
      <defs>
        <linearGradient id="imacbody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#bff3ff" /><stop offset="1" stopColor="#3fb8d6" />
        </linearGradient>
        <linearGradient id="imacscr" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" /><stop offset=".5" stopColor="#bfe9ff" /><stop offset="1" stopColor="#7fd0ff" />
        </linearGradient>
      </defs>
      <path d="M16 14h68c5 0 9 4 9 9v44c0 5-4 9-9 9H16c-5 0-9-4-9-9V23c0-5 4-9 9-9Z" fill="url(#imacbody)" stroke="#fff" strokeWidth="2.5" />
      <rect x="20" y="22" width="60" height="42" rx="6" fill="url(#imacscr)" stroke="#2a8fb0" strokeWidth="1.5" />
      <path d="M24 26c10 6 28 8 40 2" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".8" />
      <ellipse cx="50" cy="80" rx="12" ry="4" fill="#7fd0ff" opacity=".5" />
      <rect x="40" y="74" width="20" height="9" rx="3" fill="url(#imacbody)" stroke="#fff" strokeWidth="2" />
      <circle cx="50" cy="70" r="2" fill="#fff" />
    </svg>
  );
}

function PixelCursor({ size = 22, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"
      style={{ position: 'absolute', pointerEvents: 'none', filter: 'drop-shadow(1px 2px 0 rgba(120,40,150,.4))', ...style }}>
      <path d="M3 2l0 17 4.2-4.2 2.6 6 3-1.3-2.6-5.9 5.8 0z" fill="#fff" stroke="#7b3ff2" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

// Decorative scatter behind a screen's content. intensity 0..1 scales count/opacity.
function Decor({ kind = 'wall' }) {
  const sets = {
    wall: (
      <>
        <Sparkle size={30} style={{ top: 18, left: 14 }} delay={.2} />
        <Sparkle size={18} style={{ top: 120, right: 22 }} dur={2.6} delay={.6} />
        <Bubble size={40} style={{ top: 60, right: 10 }} dur={8} />
        <Bubble size={22} style={{ top: 250, left: 8 }} dur={6} delay={1} />
        <Heart size={20} style={{ top: 200, right: 30 }} />
        <Sparkle size={22} style={{ bottom: 80, left: 24 }} dur={3.4} delay={.3} />
        <Bubble size={30} style={{ bottom: 40, right: 18 }} dur={7.5} delay={.5} />
        <Heart size={16} style={{ bottom: 150, left: 16 }} color="#ff8ad1" />
      </>
    ),
    plain: (
      <>
        <Sparkle size={26} style={{ top: 30, left: 18 }} delay={.2} />
        <Bubble size={34} style={{ top: 90, right: 14 }} dur={8} />
        <Sparkle size={18} style={{ bottom: 120, right: 26 }} dur={2.8} delay={.5} />
        <Heart size={18} style={{ bottom: 60, left: 20 }} />
        <Bubble size={22} style={{ bottom: 200, left: 12 }} dur={6.5} delay={.8} />
      </>
    ),
  };
  return (
    <div className="nw-decor" aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
      opacity: 'var(--nw-glitter)' }}>
      {sets[kind] || sets.plain}
    </div>
  );
}

// holographic/script title helper
function Title({ children, size = 34, kind = 'holo', style = {} }) {
  const cls = kind === 'chrome' ? 'nw-script nw-chrome-text' : 'nw-script nw-holo-text';
  return <div className={cls} style={{ fontSize: size, lineHeight: 1.3, paddingBottom: '0.18em', ...style }}>{children}</div>;
}

Object.assign(window, {
  NWStyles, Sparkle, Bubble, Heart, Butterfly, LavaLamp, IMac, PixelCursor, Decor, Title,
});
