import { ImageResponse } from "next/og";

// Image metadata
export const alt = "noe's world · Disney Channel Games — la web del cumple de Noe";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Paleta tomada de app/globals.css (--nw-*)
const PINK = "#ff3d9a";
const PURPLE = "#a85cff";
const VIOLET = "#7b3ff2";
const BLUE = "#56d6ff";
const YELLOW = "#ffe14d";

// Image generation
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          backgroundColor: VIOLET,
          backgroundImage: `radial-gradient(circle at 80% 15%, ${BLUE} 0%, transparent 45%), linear-gradient(135deg, ${PINK} 0%, ${PURPLE} 100%)`,
          fontFamily: "sans-serif",
          color: "#ffffff",
        }}
      >
        {/* Etiqueta superior */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "12px 30px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.22)",
            border: "2px solid rgba(255,255,255,0.6)",
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Disney Channel Games
        </div>

        {/* Título principal */}
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 150,
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: -2,
            textShadow: "0 6px 0 rgba(74,29,87,0.35), 0 14px 30px rgba(74,29,87,0.4)",
          }}
        >
          noe&apos;s world
        </div>

        {/* Subtítulo */}
        <div
          style={{
            display: "flex",
            marginTop: 30,
            maxWidth: 880,
            textAlign: "center",
            fontSize: 38,
            fontWeight: 600,
            color: "rgba(255,255,255,0.95)",
          }}
        >
          Descubre tu equipo, juega al quiz y sigue las novedades
        </div>

        {/* Fecha */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginTop: 40,
            padding: "14px 38px",
            borderRadius: 999,
            background: YELLOW,
            color: "#4a1d57",
            fontSize: 40,
            fontWeight: 800,
          }}
        >
          27 · junio · 2026
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
