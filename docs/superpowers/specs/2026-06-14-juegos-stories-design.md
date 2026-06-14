# Novedades: stories de los juegos + votación + material

**Fecha:** 2026-06-14
**Estado:** Aprobado para planificación

## Objetivo

Añadir a la app de Noe's World una experiencia tipo *stories* (tap-through, estética
Y2K) que presenta las pruebas del cumple. Dentro de las stories hay una votación entre
los dos juegos "a elegir". Por separado, una pantalla de material lista lo necesario;
para el material común la gente puede apuntarse como voluntaria a traerlo.

## Decisiones tomadas

- **Formato:** stories a pantalla completa, tap derecha = siguiente / izquierda = atrás,
  barra de progreso arriba (estilo Instagram). No auto-avance.
- **Votación:** entre `roba-vidas` y `operacion-esponja`. Resultados **en vivo** tras
  votar (barras de % + nº de votos). El voto se puede cambiar.
- **Material:** solo el material **común/general** es apuntable. El material por juego se
  muestra como información de solo lectura.
- **Apuntarse:** lista abierta — varias personas pueden apuntarse al mismo ítem.
  Toggle (apuntarme / quitarme).
- **Acceso:** integrado en "novedades" — una tarjeta fijada en la home abre las stories.
  El material está **siempre accesible** (sin gating tras las stories).
- **Sesión:** requiere participante autenticado, igual que el resto de la app.

## Arquitectura

Ruta dedicada `/juegos` (stories a pantalla completa) + ruta `/material`. Tarjeta fijada
dentro del feed "novedades" de la home que enlaza a `/juegos`. Contenido en
`config/games.ts` siguiendo el patrón de `config/quiz-questions.ts` y `config/team-test.ts`.
Persistencia en Redis usando **solo** las operaciones existentes de la interfaz `DB`
(`sadd`/`srem`/`smembers`) — no se modifica `lib/redis.ts`.

### Componentes / unidades

1. **`config/games.ts`** — datos estáticos del contenido.
   - `FIXED_GAMES`: 6 juegos. Cada uno `{ id, emoji, name, hook, summary }`.
     - `toallas` 🏖 Juego de las Toallas — sillas musicales con toallas; cada ronda
       desaparece una y alguien queda eliminado.
     - `trivial-splash` 💦 Trivial Splash — duelos 1vs1 de cultura general; quien falla
       acaba empapado.
     - `relevo-acuatico` 🥄🌊 Relevo Acuático — pelota de ping pong sobre cuchara (con la
       boca) de la arena al agua, en fila/relevo.
     - `conexion` 🔗 Conexión — adivinar la palabra secreta construyendo una frase palabra
       a palabra, alternándose.
     - `al-vaso` 🥤 ¡Al Vaso! — Simón dice + reflejos; coger el vaso al "Simón dice: ¡Al
       vaso!".
     - `tres-en-raya` ❌⭕ Tres en Raya Relay — relevo para colocar petos en un tablero
       gigante dibujado en la arena.
   - `VOTE_GAMES`: 2 opciones `{ id, emoji, name, hook, summary }`.
     - `roba-vidas` 🎽 Roba Vidas — cada jugador tiene 2 vidas (cintas); roba las del
       rival y protege las tuyas.
     - `operacion-esponja` 🧽 Operación Esponja — transportar agua con una esponja para
       llenar el cubo antes que el rival.
   - `MATERIAL`:
     - `general` (común, apuntable): `{ id, emoji, label }[]`
       - `altavoz` 🔊 1 altavoz portátil
       - `movil` 📱 1 móvil con música y cronómetro
       - `libreta` 📒 1 libreta
       - `bolis` 🖊 2 bolígrafos
       - `silbato` 📣 1 silbato (opcional)
       - `conos` 🚩 4 conos o marcas
     - `perGame` (solo lectura): material por juego.
       - Toallas: 6-8 toallas
       - Trivial Splash: 1-2 pistolas de agua · 50-100 preguntas preparadas · 2 toallas
         para los duelistas
       - Relevo Acuático: 14 cucharas (+1-2 extra) · 2 pelotas de ping pong (+2 reserva)
       - Conexión: 30-40 papelitos/tarjetas · 1 rotulador
       - ¡Al Vaso!: 1 vaso resistente
       - Tres en Raya Relay: 6 petos (3 por equipo)
       - Roba Vidas (si sale elegido): 28 cintas o pañuelos (14 por equipo)
       - Operación Esponja (si sale elegido): 4 cubos · 2 esponjas grandes

2. **`components/Stories.tsx`** (client) — máquina de estados de slides.
   - Reutiliza decoraciones de `components/nw.tsx` para mantener la estética Y2K.
   - Barra de progreso arriba con un segmento por slide.
   - Tap/click en la mitad derecha = siguiente, mitad izquierda = anterior. (Swipe táctil
     opcional, no obligatorio para v1.)
   - Secuencia de slides: `intro → 6 juegos fijos → voto → cierre`.
   - Slide de **voto** (interactivo): dos botones grandes (los `VOTE_GAMES`). Al votar
     llama a la server action y muestra barras de % en vivo + nº total de votos. Permite
     cambiar el voto. Recibe como props el estado inicial (voto del usuario + recuentos).
   - Slide de **cierre**: enlace/botón a `/material`.

3. **`app/juegos/page.tsx`** (server) — carga el estado inicial de la votación
   (`getVoteState`) y el participante actual; renderiza `Stories`. `export const dynamic =
   "force-dynamic"`. Redirige a `/` si no hay sesión.

4. **`app/material/page.tsx`** (server) + **`components/MaterialList.tsx`** (client).
   - Server: carga voluntarios por ítem (`getMaterialState`) resolviendo nombres vía
     `lib/participants`, más el material por juego desde config.
   - Client: por cada ítem común, muestra la lista de apuntados y un botón toggle
     (apuntarme / quitarme) que llama a la server action. Material por juego en una sección
     de solo lectura, con Roba Vidas / Op. Esponja marcados como "si sale elegido".

5. **`app/page.tsx`** (home) — añadir una tarjeta fijada al principio del bloque
   "novedades": `📌 ¡Los juegos del cumple!` con botón "abrir stories" → `/juegos`. El
   muro de posts existente permanece debajo sin cambios.

### Datos en Redis (sin cambios en la interfaz `DB`)

- **Votos:** dos sets, `vote:roba-vidas` y `vote:operacion-esponja`; miembros =
  `participantId`.
  - Votar `X`: `srem` del otro set + `sadd` en el set de `X` (un participante cuenta una
    sola vez; cambiar voto lo mueve de set).
  - Recuento de cada opción: longitud de `smembers`.
  - Voto actual del usuario: derivado de la pertenencia a los sets.
- **Voluntarios:** un set por ítem común, `material:{itemId}`; miembros = `participantId`.
  - Apuntarse: `sadd`. Quitarse: `srem`.
  - Nombres mostrados: resueltos a partir de los `participantId` vía `lib/participants`.

### Lógica nueva

- **`lib/votes.ts`**: `getVoteState(participantId)` → `{ counts: Record<id, number>,
  myVote: id | null }`; `castVote(participantId, gameId)`.
- **`lib/material.ts`**: `getMaterialState()` → voluntarios por ítem con nombres;
  `toggleVolunteer(participantId, itemId)`.
- **`app/actions.ts`**: `castVoteAction(gameId)` y `toggleVolunteerAction(itemId)` (ambas
  obtienen el participante de la sesión; rechazan si no hay sesión; validan que el id
  pertenezca a la config).

## Flujo de datos

1. Home → tarjeta fijada → `/juegos`.
2. `/juegos` carga estado inicial de voto + renderiza stories. El usuario navega slides;
   en el slide de voto, votar dispara `castVoteAction` → actualiza sets → devuelve
   recuentos → UI muestra % en vivo.
3. Slide de cierre → `/material`.
4. `/material` muestra material; apuntarse/quitarse dispara `toggleVolunteerAction` →
   `sadd`/`srem` → revalida.

## Errores y casos límite

- Sin sesión: `/juegos` y `/material` redirigen a `/`; las actions rechazan.
- `gameId` / `itemId` no válido (no está en config): la action no hace nada.
- Cambio de voto: mover de set es idempotente; recuentos siempre = tamaño de los sets.
- Doble apuntarse al mismo ítem: `sadd` es idempotente (no duplica).
- Mock DB en desarrollo (`usingMockDB`): funciona igual con sets en memoria; los datos no
  persisten entre reinicios (aceptable en dev).

## Pruebas

- `lib/votes.ts`: votar incrementa recuento; cambiar voto mueve de set sin duplicar;
  `myVote` refleja el set correcto.
- `lib/material.ts`: apuntarse añade, quitarse elimina, doble apuntarse no duplica;
  resolución de nombres correcta.
- Validación de ids en las actions (id inexistente = no-op).
- Comprobación manual del tap-through de stories y de las barras de % en vivo.

## Fuera de alcance (YAGNI)

- Cierre/bloqueo de la votación por fecha (se puede votar y cambiar siempre).
- Gating del material tras ver las stories.
- Edición de contenido por admin (el contenido vive en `config/games.ts`).
- Apuntarse con cantidades/cupos por ítem (lista abierta simple).
- Auto-avance de slides y animaciones tipo Spotify Wrapped.
