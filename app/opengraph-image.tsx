import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Image metadata
export const alt = "noe's world · Disney Channel Games — la web del cumple de Noe";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Paleta tomada de app/globals.css (--nw-*)
const PINK = "#ff3d9a";
const YELLOW = "#ffe14d";
const INK = "#4a1d57";

async function dataUri(relPath: string, mime: string) {
  const buf = await readFile(join(process.cwd(), relPath));
  return `data:${mime};base64,${buf.toString("base64")}`;
}

// Image generation
export default async function Image() {
  const [pacifico, baloo, demi, selena] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/Pacifico-Regular.ttf")),
    readFile(join(process.cwd(), "assets/fonts/Baloo2-800.ttf")),
    dataUri("public/stickers/demi.png", "image/png"),
    dataUri("public/stickers/selena.png", "image/png"),
  ]);

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
          // Fondo holográfico — réplica de body::before en globals.css
          backgroundColor: "#c860ff",
          backgroundImage:
            "radial-gradient(120% 80% at 20% 0%, #ff8fd0 0%, rgba(255,143,208,0) 55%)," +
            "radial-gradient(120% 90% at 95% 15%, #b18cff 0%, rgba(177,140,255,0) 50%)," +
            "radial-gradient(130% 90% at 50% 110%, #ff5fb0 0%, rgba(255,95,176,0) 55%)," +
            "linear-gradient(160deg, #ff63b6 0%, #c860ff 100%)",
          fontFamily: "Baloo",
          color: "#ffffff",
        }}
      >
        {/* Stickers Y2K */}
        <img
          src={demi}
          width={300}
          height={300}
          style={{
            position: "absolute",
            top: -28,
            left: -34,
            transform: "rotate(-12deg)",
          }}
        />
        <img
          src={selena}
          width={300}
          height={300}
          style={{
            position: "absolute",
            bottom: -40,
            right: -30,
            transform: "rotate(11deg)",
          }}
        />

        {/* Etiqueta superior */}
        <div
          style={{
            display: "flex",
            padding: "10px 30px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.28)",
            border: "3px solid rgba(255,255,255,0.85)",
            fontSize: 30,
            fontWeight: 800,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#fff",
            textShadow: "0 2px 0 rgba(123,63,242,0.4)",
          }}
        >
          Disney Channel Games
        </div>

        {/* Título principal — Pacifico, como .nw-script */}
        <div
          style={{
            display: "flex",
            marginTop: 18,
            fontFamily: "Pacifico",
            fontSize: 168,
            lineHeight: 1.05,
            color: "#ffffff",
            // Aproxima el contorno blanco + sombra de .nw-script / .nw-holo-text
            textShadow:
              "3px 4px 0 rgba(123,63,242,0.55), -2px -2px 0 rgba(255,255,255,0.9), 2px -2px 0 rgba(255,255,255,0.9), -2px 2px 0 rgba(255,255,255,0.9), 0 6px 14px rgba(150,30,120,0.35)",
          }}
        >
          noe&apos;s world
        </div>

        {/* Subtítulo */}
        <div
          style={{
            display: "flex",
            marginTop: 22,
            maxWidth: 760,
            textAlign: "center",
            fontSize: 36,
            fontWeight: 800,
            color: "#fff",
            textShadow: "0 2px 0 rgba(123,63,242,0.4)",
          }}
        >
          Descubre tu equipo, juega al quiz y sigue las novedades
        </div>

        {/* Fecha */}
        <div
          style={{
            display: "flex",
            marginTop: 30,
            padding: "12px 40px",
            borderRadius: 999,
            background: YELLOW,
            color: INK,
            fontSize: 42,
            fontWeight: 800,
            border: `4px solid ${PINK}`,
          }}
        >
          27 · junio · 2026
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Pacifico", data: pacifico, weight: 400, style: "normal" },
        { name: "Baloo", data: baloo, weight: 800, style: "normal" },
      ],
    }
  );
}
