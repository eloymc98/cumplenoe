import type { Metadata } from "next";
import { Pacifico, Baloo_2, Quicksand, VT323 } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/TopBar";
import StageDecor from "@/components/StageDecor";
import { getCurrentParticipant } from "@/lib/session";

const pacifico = Pacifico({ weight: "400", subsets: ["latin"], variable: "--nw-f-script" });
const baloo = Baloo_2({ weight: ["500", "700", "800"], subsets: ["latin"], variable: "--nw-f-bubble" });
const quicksand = Quicksand({ weight: ["400", "500", "600", "700"], subsets: ["latin"], variable: "--nw-f-body" });
const vt323 = VT323({ weight: "400", subsets: ["latin"], variable: "--nw-f-pixel" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cumplenoe-sigma.vercel.app";
const SITE_TITLE = "noe's world · Disney Channel Games";
const SITE_DESCRIPTION =
  "La web del cumple de Noe: descubre tu equipo, juega al quiz y sigue las novedades.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: "noe's world",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const participant = await getCurrentParticipant();
  const fontVars = `${pacifico.variable} ${baloo.variable} ${quicksand.variable} ${vt323.variable}`;

  return (
    <html lang="es" className={fontVars}>
      <body>
        <StageDecor />
        {participant && <TopBar sealed={Boolean(participant.testCompletedAt)} />}
        {children}
      </body>
    </html>
  );
}
