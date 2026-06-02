import {
  Sparkle,
  Bubble,
  Heart,
  Butterfly,
  Star,
  CD,
  Daisy,
  Rainbow,
  Smiley,
  ImageSticker,
} from "@/components/nw";

/*
  Decoración flotante de fondo (fija, detrás del contenido).

  CÓMO AÑADIR MÁS STICKERS:
  1) Copia cualquier línea de abajo y cambia los valores.
  2) `style={{ top/bottom/left/right: "NN%" }}` coloca el sticker (en % de la pantalla).
  3) `size` cambia el tamaño; `dur` la velocidad de la animación; `delay` la desfasa.
  4) Stickers disponibles: <Sparkle/> <Bubble/> <Heart/> <Butterfly/> <Star/>
     <CD/> <Daisy/> <Rainbow/> <Smiley/>  (definidos en components/nw.tsx)
  Consejo: mantenlos cerca de los bordes para no tapar el contenido del centro.
*/
export default function StageDecor() {
  return (
    <div
      aria-hidden
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}
    >
      {/* esquina superior izquierda */}
      <Butterfly size={70} style={{ top: "4%", left: "5%" }} />
      <Sparkle size={34} style={{ top: "14%", left: "12%" }} />
      <Daisy size={36} style={{ top: "24%", left: "4%" }} dur={6.5} />
      <Star size={24} style={{ top: "34%", left: "9%" }} delay={0.5} />

      {/* esquina superior derecha */}
      <Bubble size={44} style={{ top: "8%", right: "7%" }} dur={8} />
      <CD size={42} style={{ top: "18%", right: "4%" }} dur={9} />
      <Sparkle size={22} style={{ top: "28%", right: "12%" }} dur={2.8} delay={0.4} />
      <Smiley size={30} style={{ top: "38%", right: "6%" }} dur={5.5} />

      {/* franja media (pegada a bordes) */}
      <Rainbow size={52} style={{ top: "48%", left: "3%" }} />
      <Heart size={24} style={{ top: "52%", right: "4%" }} />
      <Star size={20} style={{ top: "44%", left: "16%" }} dur={3.6} delay={0.2} />

      {/* esquina inferior izquierda */}
      <Sparkle size={26} style={{ bottom: "16%", left: "8%" }} dur={3.2} />
      <Bubble size={30} style={{ bottom: "8%", left: "14%" }} dur={7.5} delay={0.6} />
      <Daisy size={30} style={{ bottom: "24%", left: "5%" }} dur={6} delay={1} petal="#ffe6f5" />

      {/* esquina inferior derecha */}
      <CD size={34} style={{ bottom: "10%", right: "8%" }} dur={8.5} delay={0.8} />
      <Heart size={28} style={{ bottom: "22%", right: "12%" }} color="#ff8ad1" />
      <Star size={26} style={{ bottom: "32%", right: "5%" }} dur={4.2} delay={0.3} />
      <Sparkle size={18} style={{ bottom: "6%", right: "16%" }} dur={2.6} delay={0.5} />

      {/* stickers de estrellas Disney (recortes) — asomando por el medio de cada lateral */}
      <ImageSticker src="/stickers/demi.png" size={150} style={{ top: "39%", left: "12%" }} rot={-7} dur={7.5} alt="" />
      <ImageSticker src="/stickers/selena.png" size={120} style={{ top: "56%", right: "10%" }} rot={6} dur={8} delay={0.6} alt="" />
    </div>
  );
}
