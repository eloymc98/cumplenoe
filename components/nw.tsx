import type { CSSProperties, ReactNode } from "react";

// Átomos decorativos Y2K "noe's world" (portados del design kit hi-fi).
// Presentacionales y sin estado: válidos en server y client components.

type S = CSSProperties;

export function Sparkle({
  size = 26,
  style = {},
  dur = 3.2,
  delay = 0,
}: {
  size?: number;
  style?: S;
  dur?: number;
  delay?: number;
}) {
  return (
    <span
      aria-hidden
      style={{
        position: "absolute",
        width: size,
        height: size,
        pointerEvents: "none",
        background:
          "conic-gradient(from 210deg,#fff,#bfe0ff,#ffd1ef,#c3c9ff,#fff,#ecd6ff,#fff)",
        clipPath:
          "polygon(50% 0%,58% 42%,100% 50%,58% 58%,50% 100%,42% 58%,0% 50%,42% 42%)",
        filter: "drop-shadow(0 1px 2px rgba(120,60,160,.5))",
        animation: `nw-twinkle ${dur}s ease-in-out ${delay}s infinite`,
        ...style,
      }}
    />
  );
}

export function Bubble({
  size = 34,
  style = {},
  dur = 7,
  delay = 0,
}: {
  size?: number;
  style?: S;
  dur?: number;
  delay?: number;
}) {
  return (
    <span
      aria-hidden
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        pointerEvents: "none",
        background:
          "radial-gradient(circle at 32% 26%, rgba(255,255,255,.95), rgba(255,255,255,0) 38%)," +
          "radial-gradient(circle at 72% 76%, rgba(255,150,220,.5), rgba(255,150,220,0) 52%)," +
          "radial-gradient(circle at 50% 55%, rgba(150,200,255,.5), rgba(180,255,235,.34) 72%, rgba(255,255,255,.1))",
        border: "1px solid rgba(255,255,255,.75)",
        boxShadow:
          "inset 0 0 10px rgba(255,255,255,.55), 0 2px 10px rgba(150,100,200,.22)",
        animation: `nw-float ${dur}s ease-in-out ${delay}s infinite`,
        ...style,
      }}
    />
  );
}

export function Heart({
  size = 22,
  style = {},
  color = "#ff4da0",
}: {
  size?: number;
  style?: S;
  color?: string;
}) {
  const gid = `hg${size}${String(style.top ?? "")}${String(style.left ?? "")}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden
      style={{
        position: "absolute",
        pointerEvents: "none",
        filter: "drop-shadow(0 2px 2px rgba(180,30,110,.4))",
        ...style,
      }}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".9" />
          <stop offset=".4" stopColor={color} />
          <stop offset="1" stopColor="#c81f7a" />
        </linearGradient>
      </defs>
      <path
        d="M12 21s-8-5.2-8-11.1C4 6.3 6.3 4 9.1 4c1.7 0 3 .9 2.9 2.5C12 4.9 13.3 4 15 4c2.8 0 5 2.3 5 5.9C20 15.8 12 21 12 21z"
        fill={`url(#${gid})`}
        stroke="#fff"
        strokeWidth="1.2"
      />
    </svg>
  );
}

export function Butterfly({
  size = 64,
  style = {},
  float = true,
}: {
  size?: number;
  style?: S;
  float?: boolean;
}) {
  const id = `bf${Math.round(size)}${String(style.top ?? "")}${String(style.left ?? "")}`;
  return (
    <svg
      width={size}
      height={size * 0.86}
      viewBox="0 0 100 86"
      aria-hidden
      style={{
        position: "absolute",
        pointerEvents: "none",
        filter: "drop-shadow(0 4px 6px rgba(120,40,150,.4))",
        animation: float ? "nw-bob 5s ease-in-out infinite" : "none",
        ...style,
      }}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd6f5" />
          <stop offset=".3" stopColor="#b9a8ff" />
          <stop offset=".55" stopColor="#8fe6ff" />
          <stop offset=".78" stopColor="#a8ffd8" />
          <stop offset="1" stopColor="#fff3a8" />
        </linearGradient>
      </defs>
      <g stroke="#fff" strokeWidth="2">
        <path d="M50 43C44 22 30 12 18 16C6 20 6 38 20 42C8 44 8 62 22 64C34 66 45 56 50 43Z" fill={`url(#${id})`} />
        <path d="M50 43C56 22 70 12 82 16C94 20 94 38 80 42C92 44 92 62 78 64C66 66 55 56 50 43Z" fill={`url(#${id})`} />
      </g>
      <ellipse cx="50" cy="44" rx="3.2" ry="16" fill="#7b3ff2" />
      <path d="M50 30C48 22 44 17 40 14M50 30C52 22 56 17 60 14" stroke="#7b3ff2" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="40" cy="13" r="2.4" fill="#ff4da0" />
      <circle cx="60" cy="13" r="2.4" fill="#ff4da0" />
    </svg>
  );
}

export function LavaLamp({ h = 116, style = {} }: { h?: number; style?: S }) {
  const w = h * 0.42;
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        width: w,
        height: h,
        pointerEvents: "none",
        filter: "drop-shadow(0 6px 8px rgba(120,40,150,.35))",
        animation: "nw-bob 6s ease-in-out infinite",
        ...style,
      }}
    >
      <div style={{ position: "absolute", top: 0, left: "18%", width: "64%", height: h * 0.1, background: "linear-gradient(180deg,#fff,#b9c2dd)", borderRadius: "6px 6px 2px 2px" }} />
      <div
        style={{
          position: "absolute",
          top: h * 0.09,
          left: "8%",
          width: "84%",
          height: h * 0.72,
          overflow: "hidden",
          borderRadius: "40% 40% 18% 18%",
          background: "linear-gradient(180deg, rgba(255,120,200,.55), rgba(120,90,255,.6))",
          border: "1.5px solid rgba(255,255,255,.75)",
          boxShadow: "inset 0 0 12px rgba(255,255,255,.5)",
        }}
      >
        <div style={{ position: "absolute", left: "24%", bottom: 0, width: "46%", height: "46%", background: "radial-gradient(circle at 35% 30%, #fff7a8, #ff8a3d)", animation: "nw-blob 5s ease-in-out infinite" }} />
        <div style={{ position: "absolute", left: "12%", bottom: 0, width: "34%", height: "34%", background: "radial-gradient(circle at 35% 30%, #fff7a8, #ff5fae)", animation: "nw-blob 6.6s ease-in-out .8s infinite" }} />
        <div style={{ position: "absolute", left: "52%", bottom: 0, width: "30%", height: "30%", background: "radial-gradient(circle at 35% 30%, #d8fff0, #56d6ff)", animation: "nw-blob 7.8s ease-in-out 1.6s infinite" }} />
      </div>
      <div style={{ position: "absolute", bottom: 0, left: "4%", width: "92%", height: h * 0.16, background: "linear-gradient(180deg,#eef2ff,#9aa6c8)", borderRadius: "8px 8px 9px 9px", clipPath: "polygon(16% 0,84% 0,100% 100%,0 100%)" }} />
    </div>
  );
}

export function IMac({ w = 92, style = {} }: { w?: number; style?: S }) {
  return (
    <svg
      width={w}
      height={w}
      viewBox="0 0 100 100"
      aria-hidden
      style={{
        pointerEvents: "none",
        filter: "drop-shadow(0 5px 8px rgba(120,40,150,.35))",
        animation: "nw-bob 7s ease-in-out infinite",
        ...style,
      }}
    >
      <defs>
        <linearGradient id="imacbody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#bff3ff" />
          <stop offset="1" stopColor="#3fb8d6" />
        </linearGradient>
        <linearGradient id="imacscr" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset=".5" stopColor="#bfe9ff" />
          <stop offset="1" stopColor="#7fd0ff" />
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

export function Title({
  children,
  size = 34,
  kind = "holo",
  style = {},
}: {
  children: ReactNode;
  size?: number;
  kind?: "holo" | "chrome";
  style?: S;
}) {
  const cls = kind === "chrome" ? "nw-script nw-chrome-text" : "nw-script nw-holo-text";
  return (
    <div className={cls} style={{ fontSize: size, lineHeight: 1.3, paddingBottom: "0.18em", ...style }}>
      {children}
    </div>
  );
}

export function Avatar({
  size = 52,
  ring = true,
  src,
}: {
  size?: number;
  ring?: boolean;
  src?: string;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        flexShrink: 0,
        position: "relative",
        overflow: "hidden",
        background: src
          ? undefined
          : "radial-gradient(circle at 34% 30%, #fff, #ffd0ec 40%, #c79bff 100%)",
        border: ring ? "2.5px solid #fff" : "none",
        boxShadow: "0 4px 10px rgba(120,40,150,.25)",
      }}
    >
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      )}
    </div>
  );
}

export function MiniEnvelope() {
  return (
    <div style={{ width: 78, height: 54, position: "relative", flexShrink: 0, borderRadius: 8, background: "linear-gradient(180deg,#fff,#ffe6f5)", border: "2px solid #fff", boxShadow: "0 5px 12px rgba(120,40,150,.22)" }}>
      <div style={{ position: "absolute", inset: 0, clipPath: "polygon(0 0,100% 0,50% 56%)", background: "linear-gradient(180deg,#ffd0ec,#ff8ad1)", borderRadius: "8px 8px 0 0" }} />
      <div style={{ position: "absolute", left: "50%", top: "46%", transform: "translate(-50%,-50%)", width: 26, height: 26, borderRadius: "50%", background: "var(--nw-candy)", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, zIndex: 2 }}>🔒</div>
    </div>
  );
}

export function BigEnvelope() {
  return (
    <div style={{ width: 200, height: 134, position: "relative", margin: "6px auto" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 12, background: "linear-gradient(180deg,#fff,#ffe6f5)", border: "3px solid #fff", boxShadow: "0 14px 30px rgba(120,40,150,.3)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: "64%", clipPath: "polygon(0 0,100% 0,50% 96%)", background: "linear-gradient(180deg,#ffd0ec,#ff5fb0)", borderRadius: "12px 12px 0 0" }} />
      <div style={{ position: "absolute", left: "50%", top: "52%", transform: "translate(-50%,-50%)", width: 52, height: 52, borderRadius: "50%", background: "var(--nw-candy)", border: "3px solid #fff", zIndex: 3, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, boxShadow: "0 6px 14px rgba(160,40,150,.4)" }}>🔒</div>
      <Sparkle size={20} style={{ top: -6, right: 8, zIndex: 4 }} />
    </div>
  );
}

// ───────── stickers extra Y2K (decorativos) ─────────

export function Star({ size = 28, style = {}, dur = 4, delay = 0 }: { size?: number; style?: S; dur?: number; delay?: number }) {
  const id = `st${size}${String(style.top ?? "")}${String(style.left ?? "")}`;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden style={{ position: "absolute", pointerEvents: "none", filter: "drop-shadow(0 2px 3px rgba(120,40,150,.4))", animation: `nw-bob ${dur}s ease-in-out ${delay}s infinite`, ...style }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff7a8" />
          <stop offset=".5" stopColor="#ffd24d" />
          <stop offset="1" stopColor="#ff8ad1" />
        </linearGradient>
      </defs>
      <path d="M12 1.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 16.9 6.1 19.3l1.3-6.5L2.5 8.3l6.6-.8z" fill={`url(#${id})`} stroke="#fff" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

export function CD({ size = 46, style = {}, dur = 8, delay = 0 }: { size?: number; style?: S; dur?: number; delay?: number }) {
  return (
    <div aria-hidden style={{ position: "absolute", width: size, height: size, borderRadius: "50%", pointerEvents: "none", background: "conic-gradient(from 0deg,#ff8fd0,#9be7ff,#b6ffd9,#fff3a8,#ffc6e6,#c5b3ff,#ff8fd0)", border: "1.5px solid rgba(255,255,255,.8)", boxShadow: "0 4px 12px rgba(120,40,150,.3), inset 0 0 8px rgba(255,255,255,.5)", display: "flex", alignItems: "center", justifyContent: "center", animation: `nw-float ${dur}s ease-in-out ${delay}s infinite`, ...style }}>
      <div style={{ width: "34%", height: "34%", borderRadius: "50%", background: "rgba(255,255,255,.85)", border: "2px solid rgba(255,255,255,.95)", boxShadow: "inset 0 0 0 3px rgba(168,92,255,.25)" }} />
    </div>
  );
}

export function Daisy({ size = 40, style = {}, dur = 6, delay = 0, petal = "#fff" }: { size?: number; style?: S; dur?: number; delay?: number; petal?: string }) {
  const petals = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <div aria-hidden style={{ position: "absolute", width: size, height: size, pointerEvents: "none", filter: "drop-shadow(0 2px 3px rgba(120,40,150,.35))", animation: `nw-bob ${dur}s ease-in-out ${delay}s infinite`, ...style }}>
      {petals.map((deg) => (
        <span key={deg} style={{ position: "absolute", left: "50%", top: "50%", width: "34%", height: "44%", background: petal, borderRadius: "50%", border: "1px solid rgba(255,170,220,.6)", transform: `translate(-50%,-90%) rotate(${deg}deg)`, transformOrigin: "50% 90%" }} />
      ))}
      <span style={{ position: "absolute", left: "50%", top: "50%", width: "34%", height: "34%", borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #ffe14d, #ff9e2c)", transform: "translate(-50%,-50%)", border: "1.5px solid #fff" }} />
    </div>
  );
}

export function Rainbow({ size = 54, style = {}, dur = 7, delay = 0 }: { size?: number; style?: S; dur?: number; delay?: number }) {
  const bands = ["#ff5a5f", "#ffc23d", "#28cc7a", "#3aa0ff", "#a85cff"];
  return (
    <div aria-hidden style={{ position: "absolute", width: size, height: size / 2, pointerEvents: "none", overflow: "hidden", filter: "drop-shadow(0 2px 3px rgba(120,40,150,.3))", animation: `nw-float ${dur}s ease-in-out ${delay}s infinite`, ...style }}>
      {bands.map((c, i) => {
        const inset = i * (size * 0.08);
        return (
          <div key={c} style={{ position: "absolute", left: inset, right: inset, top: inset, height: size, borderRadius: "50%", border: `${size * 0.06}px solid ${c}`, borderBottom: "none", boxSizing: "border-box" }} />
        );
      })}
    </div>
  );
}

export function Smiley({ size = 34, style = {}, dur = 5, delay = 0 }: { size?: number; style?: S; dur?: number; delay?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden style={{ position: "absolute", pointerEvents: "none", filter: "drop-shadow(0 2px 3px rgba(120,40,150,.35))", animation: `nw-bob ${dur}s ease-in-out ${delay}s infinite`, ...style }}>
      <defs>
        <radialGradient id={`sm${size}${String(style.top ?? "")}`} cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#fff7a8" />
          <stop offset="1" stopColor="#ffc23d" />
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="10.5" fill={`url(#sm${size}${String(style.top ?? "")})`} stroke="#fff" strokeWidth="1.2" />
      <circle cx="8.5" cy="10" r="1.3" fill="#7b3ff2" />
      <circle cx="15.5" cy="10" r="1.3" fill="#7b3ff2" />
      <path d="M7.5 14c1.2 2 7.8 2 9 0" stroke="#7b3ff2" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// Sticker de imagen recortada (PNG con transparencia) flotando en el fondo.
export function ImageSticker({
  src,
  size = 160,
  style = {},
  dur = 7,
  delay = 0,
  rot = 0,
  alt = "",
}: {
  src: string;
  size?: number;
  style?: S;
  dur?: number;
  delay?: number;
  rot?: number;
  alt?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      aria-hidden={alt === ""}
      style={{
        position: "absolute",
        width: size,
        height: "auto",
        pointerEvents: "none",
        transform: `rotate(${rot}deg)`,
        filter:
          "drop-shadow(0 6px 10px rgba(120,40,150,.4)) drop-shadow(0 0 2px rgba(255,255,255,.9))",
        animation: `nw-bob ${dur}s ease-in-out ${delay}s infinite`,
        ...style,
      }}
    />
  );
}

export function ModuleHead({ children, icon }: { children: ReactNode; icon?: string }) {
  return (
    <div className="module-head">
      {icon && <span className="ic">{icon}</span>}
      {children}
    </div>
  );
}
