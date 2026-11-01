// Original, hand-built SVG illustration kit for the "A Little More You" story.
// Everything here is plain SVG (no images, no external requests).
import * as React from "react";

export const W = 1600;
export const H = 900;

function hex(c: string) {
  const n = parseInt(c.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
export function mix(a: string, b: string, t: number) {
  const [r1, g1, b1] = hex(a);
  const [r2, g2, b2] = hex(b);
  const f = (x: number, y: number) => Math.round(x + (y - x) * t).toString(16).padStart(2, "0");
  return `#${f(r1, r2)}${f(g1, g2)}${f(b1, b2)}`;
}

/* ---------- sky, light, weather ---------- */

export function Sky({ id, stops }: { id: string; stops: [number, string][] }) {
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          {stops.map(([o, c]) => (
            <stop key={o} offset={o} stopColor={c} />
          ))}
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id})`} />
    </>
  );
}

export function Sun({ id, cx, cy, r = 80, glow = "#ffb48a" }: { id: string; cx: number; cy: number; r?: number; glow?: string }) {
  return (
    <>
      <defs>
        <radialGradient id={id}>
          <stop offset="0" stopColor={glow} stopOpacity="0.85" />
          <stop offset="0.35" stopColor={glow} stopOpacity="0.32" />
          <stop offset="1" stopColor={glow} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r * 6} fill={`url(#${id})`} />
      <circle cx={cx} cy={cy} r={r} fill="#fff1d6" />
      <circle cx={cx} cy={cy} r={r * 1.25} fill="#ffe2bd" opacity="0.35" />
    </>
  );
}

export function Cloud({ x, y, w = 300, lit = "#ffc8a0", shade = "#9c5a8c", o = 0.9 }: { x: number; y: number; w?: number; lit?: string; shade?: string; o?: number }) {
  const h = w * 0.16;
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      <path d={`M0,${h} Q${w * 0.1},${-h * 0.4} ${w * 0.3},${h * 0.2} Q${w * 0.45},${-h * 0.9} ${w * 0.65},${h * 0.1} Q${w * 0.85},${-h * 0.3} ${w},${h} Z`} fill={shade} />
      <path d={`M${w * 0.04},${h * 0.8} Q${w * 0.12},${-h * 0.2} ${w * 0.3},${h * 0.1} Q${w * 0.45},${-h * 0.7} ${w * 0.65},${h * 0.05} Q${w * 0.8},${-h * 0.1} ${w * 0.92},${h * 0.55} Q${w * 0.5},${h * 0.3} ${w * 0.04},${h * 0.8} Z`} fill={lit} />
    </g>
  );
}

export function Rays({ id, x, y, color = "#ffd7a8", o = 0.16 }: { id: string; x: number; y: number; color?: string; o?: number }) {
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={color} stopOpacity={o} />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map((i) => (
        <polygon key={i} points={`${x},${y} ${x + 200 + i * 90},${H} ${x + 330 + i * 90},${H}`} fill={`url(#${id})`} />
      ))}
    </>
  );
}

export function Stars({ n = 40 }: { n?: number }) {
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i * 9301 + 49297) % 233280;
    const b = (i * 1103 + 7919) % 233280;
    return { x: (a / 233280) * W, y: (b / 233280) * 380, r: 0.8 + ((i * 7) % 5) * 0.35 };
  });
  return (
    <g fill="#fff1e6">
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} opacity={0.35 + ((i * 13) % 6) * 0.1} />
      ))}
    </g>
  );
}

const PETALS = Array.from({ length: 16 }, (_, i) => ({
  x: ((i * 211) % 1500) + 40,
  d: 9 + ((i * 5) % 7),
  delay: -((i * 1.7) % 12),
  s: 0.7 + ((i * 3) % 5) * 0.18,
}));

export function Petals({ color = "#ffb7a0", color2 = "#ffd9c4" }: { color?: string; color2?: string }) {
  return (
    <g>
      {PETALS.map((p, i) => (
        <g key={i} transform={`translate(${p.x} 0)`}>
          <ellipse
            className="story-petal"
            rx={7 * p.s}
            ry={4 * p.s}
            fill={i % 3 === 0 ? color2 : color}
            style={{ animationDuration: `${p.d}s`, animationDelay: `${p.delay}s` }}
          />
        </g>
      ))}
    </g>
  );
}

export function Bokeh({ items }: { items: [number, number, number, string][] }) {
  return (
    <g>
      {items.map(([x, y, r, c], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={c} opacity="0.22" />
      ))}
    </g>
  );
}

/* ---------- architecture & nature ---------- */

export function Windows({ x, y, w, h, cols, rows, lit = "#ffd9a6", dark = "#3a2147", seed = 1, gap = 0.45 }: { x: number; y: number; w: number; h: number; cols: number; rows: number; lit?: string; dark?: string; seed?: number; gap?: number }) {
  const cw = w / cols;
  const rh = h / rows;
  const out: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const on = ((r * 7 + c * 13 + seed * 5) % 5) < 2;
      out.push(<rect key={`${r}-${c}`} x={x + c * cw + cw * gap * 0.5} y={y + r * rh + rh * 0.2} width={cw * (1 - gap)} height={rh * 0.6} rx="2" fill={on ? lit : dark} opacity={on ? 0.95 : 0.7} />);
    }
  }
  return <g>{out}</g>;
}

export function Building({ x, y, w, h, color, roof, cols = 5, rows = 4, seed = 1, lit, dark, arch = false }: { x: number; y: number; w: number; h: number; color: string; roof?: string; cols?: number; rows?: number; seed?: number; lit?: string; dark?: string; arch?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={color} />
      <rect x={x} y={y} width={w} height={h * 0.05} fill={mix(color, "#ffd7b0", 0.25)} opacity="0.7" />
      {roof ? <polygon points={`${x - 10},${y} ${x + w / 2},${y - h * 0.12} ${x + w + 10},${y}`} fill={roof} /> : null}
      <Windows x={x + w * 0.06} y={y + h * 0.1} w={w * 0.88} h={h * (arch ? 0.5 : 0.8)} cols={cols} rows={rows} seed={seed} lit={lit} dark={dark} />
      {arch ? (
        <g fill={mix(color, "#1a0b22", 0.5)}>
          {Array.from({ length: Math.max(2, Math.floor(cols / 1.5)) }, (_, i) => {
            const aw = (w * 0.8) / Math.max(2, Math.floor(cols / 1.5));
            const ax = x + w * 0.1 + i * aw;
            return <path key={i} d={`M${ax + 6},${y + h} L${ax + 6},${y + h * 0.78} Q${ax + aw / 2},${y + h * 0.62} ${ax + aw - 6},${y + h * 0.78} L${ax + aw - 6},${y + h} Z`} />;
          })}
        </g>
      ) : null}
    </g>
  );
}

export function ClockTower({ x, y, color = "#5b3068", lit = "#ffd9a6" }: { x: number; y: number; color?: string; lit?: string }) {
  return (
    <g>
      <rect x={x} y={y} width="110" height="330" fill={color} />
      <rect x={x - 10} y={y + 60} width="130" height="14" fill={mix(color, "#ffd7b0", 0.2)} />
      <polygon points={`${x - 14},${y} ${x + 55},${y - 120} ${x + 124},${y}`} fill={mix(color, "#1a0b22", 0.35)} />
      <rect x={x + 54} y={y - 150} width="2.5" height="34" fill={mix(color, "#1a0b22", 0.35)} />
      <circle cx={x + 55} cy={y + 110} r="34" fill="#fff1dc" />
      <circle cx={x + 55} cy={y + 110} r="30" fill="none" stroke="#c98d72" strokeWidth="2" />
      <path d={`M${x + 55},${y + 110} L${x + 55},${y + 88} M${x + 55},${y + 110} L${x + 70},${y + 118}`} stroke="#5b3068" strokeWidth="3.5" strokeLinecap="round" />
      <Windows x={x + 16} y={y + 170} w={78} h={110} cols={2} rows={3} lit={lit} dark={mix(color, "#1a0b22", 0.45)} seed={3} gap={0.4} />
    </g>
  );
}

export function Tree({ x, y, s = 1, trunk = "#3a2147", leaf = "#7a3f7e", leafLit = "#d9728a", blossom = "#ffb7a0", seed = 1 }: { x: number; y: number; s?: number; trunk?: string; leaf?: string; leafLit?: string; blossom?: string; seed?: number }) {
  const blobs = [
    [-90, -330, 95], [-20, -400, 110], [80, -340, 100], [-150, -270, 70], [150, -270, 72], [10, -300, 90],
  ];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-14,0 L-8,-250 Q-4,-300 -30,-330 L-10,-320 Q10,-290 6,-250 L16,0 Z" fill={trunk} />
      <path d="M0,-200 Q50,-250 90,-300 L84,-306 Q40,-262 -4,-214 Z" fill={trunk} />
      {blobs.map(([bx, by, br], i) => (
        <circle key={`d${i}`} cx={bx} cy={by} r={br} fill={leaf} />
      ))}
      {blobs.map(([bx, by, br], i) => (
        <circle key={`l${i}`} cx={bx + br * 0.22} cy={by - br * 0.2} r={br * 0.72} fill={leafLit} opacity="0.85" />
      ))}
      {Array.from({ length: 22 }, (_, i) => {
        const a = ((i + seed) * 53) % 360;
        const rr = 60 + ((i * 29) % 150);
        // Rounded so server and browser always produce identical markup (avoids hydration mismatches).
        const cx = Math.round(Math.cos((a * Math.PI) / 180) * rr * 1.1);
        const cy = Math.round(-320 + Math.sin((a * Math.PI) / 180) * rr * 0.7);
        return <circle key={i} cx={cx} cy={cy} r={4 + (i % 3) * 2} fill={blossom} opacity="0.85" />;
      })}
    </g>
  );
}

export function Lamp({ x, y, s = 1, glow = "#ffd6a0" }: { x: number; y: number; s?: number; glow?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-3" y="-190" width="6" height="190" fill="#2a1632" />
      <path d="M-14,-196 Q0,-216 14,-196 L10,-176 L-10,-176 Z" fill="#2a1632" />
      <circle cx="0" cy="-184" r="70" fill="url(#glowW)" />
      <circle cx="0" cy="-184" r="9" fill={glow} />
    </g>
  );
}

export function Hill({ y, color, amp = 30, o = 1 }: { y: number; color: string; amp?: number; o?: number }) {
  return <path d={`M0,${y} Q${W * 0.2},${y - amp} ${W * 0.4},${y} T${W * 0.8},${y} T${W},${y - amp * 0.4} L${W},${H} L0,${H} Z`} fill={color} opacity={o} />;
}

export function Ground({ id, y, top, bottom }: { id: string; y: number; top: string; bottom: string }) {
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={bottom} />
        </linearGradient>
      </defs>
      <rect x="0" y={y} width={W} height={H - y} fill={`url(#${id})`} />
    </>
  );
}

/* ---------- people ---------- */

type Pose = "stand" | "walk" | "strap" | "speak" | "raise" | "book" | "rest";

const ARMS: Record<Pose, { back: number[]; front: number[] }> = {
  stand: { back: [-26, -226, -38, -180, -36, -144], front: [26, -226, 36, -180, 34, -142] },
  walk: { back: [-26, -226, -42, -184, -50, -150], front: [26, -226, 40, -182, 52, -148] },
  strap: { back: [-26, -226, -38, -180, -36, -144], front: [24, -226, 42, -182, 16, -214] },
  speak: { back: [-26, -226, -38, -180, -36, -144], front: [26, -226, 48, -198, 64, -234] },
  raise: { back: [-26, -226, -38, -180, -36, -144], front: [26, -228, 50, -250, 50, -300] },
  book: { back: [-26, -226, -34, -182, -6, -184], front: [26, -226, 40, -180, 10, -186] },
  rest: { back: [-26, -226, -38, -180, -30, -140], front: [26, -226, 40, -186, 24, -150] },
};

export type PersonProps = {
  x: number;
  y: number;
  s?: number;
  flip?: boolean;
  jacket?: string;
  pants?: string;
  hair?: string;
  hairHi?: string;
  skin?: string;
  look?: "side" | "back";
  pose?: Pose;
  seated?: boolean;
  hero?: boolean; // ahoge, coral clip, tote bag
  rim?: string;
  dim?: number; // 0..1 darkness overlay for background people
  opacity?: number;
  face?: "calm" | "smile" | "open";
};

export function Person({ x, y, s = 1, flip = false, jacket = "#ff8066", pants = "#43305a", hair = "#2b1838", hairHi = "#6c4aa6", skin = "#f6d2bc", look = "side", pose = "stand", seated = false, hero = false, rim = "#ffc9a3", dim = 0, opacity = 1, face = "calm" }: PersonProps) {
  if (dim > 0) {
    jacket = mix(jacket, "#2a1236", dim);
    pants = mix(pants, "#1a0b22", dim);
    skin = mix(skin, "#6a4a6e", dim);
    hair = mix(hair, "#12081a", dim);
    rim = mix(rim, "#2a1236", dim * 0.6);
  }
  const jShade = mix(jacket, "#1a0b22", 0.38);
  const jLit = mix(jacket, "#fff1e6", 0.12);
  const skinShade = mix(skin, "#8a5a7a", 0.35);
  const pShade = mix(pants, "#120818", 0.3);
  const arms = ARMS[pose];
  const sx = (flip ? -1 : 1) * s;
  const upper = seated ? 26 : 0;

  const arm = (a: number[], color: string, hand: string) => (
    <g>
      <path d={`M${a[0]},${a[1]} L${a[2]},${a[3]} L${a[4]},${a[5]}`} stroke={color} strokeWidth="17" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx={a[4]} cy={a[5]} r="8.5" fill={hand} />
    </g>
  );

  return (
    <g transform={`translate(${x} ${y}) scale(${sx} ${s})`} opacity={opacity}>
      {/* legs */}
      {seated ? (
        <g>
          <path d="M-22,-102 L90,-102 L90,-78 L-22,-78 Z" fill={pants} />
          <path d="M-22,-102 L90,-102 L90,-96 L-22,-96 Z" fill={rim} opacity="0.35" />
          <path d="M70,-100 L92,-100 L92,-14 L72,-14 Z" fill={pants} />
          <path d="M66,-14 L98,-14 L102,-3 Q102,0 98,0 L68,0 Q64,0 66,-4 Z" fill="#fff3ea" />
          <path d="M66,-5 L100,-5" stroke="#ff8066" strokeWidth="2" />
        </g>
      ) : pose === "walk" ? (
        <g>
          <path d="M-22,-135 L-4,-135 L-26,-14 L-42,-14 Z" fill={pShade} />
          <path d="M-46,-14 L-24,-14 L-22,-3 Q-22,0 -26,0 L-50,0 Q-52,0 -50,-4 Z" fill="#e9dccf" />
          <path d="M-2,-135 L18,-135 L36,-14 L20,-14 Z" fill={pants} />
          <path d="M16,-14 L44,-14 L48,-3 Q48,0 44,0 L18,0 Q14,0 16,-4 Z" fill="#fff3ea" />
          <path d="M16,-5 L46,-5" stroke="#ff8066" strokeWidth="2" />
        </g>
      ) : (
        <g>
          <path d="M-24,-135 L-6,-135 L-10,-14 L-26,-14 Z" fill={pShade} />
          <path d="M-32,-14 L-8,-14 L-6,-3 Q-6,0 -10,0 L-34,0 Q-36,0 -34,-4 Z" fill="#e9dccf" />
          <path d="M-4,-135 L16,-135 L14,-14 L-2,-14 Z" fill={pants} />
          <path d="M-6,-14 L18,-14 L22,-3 Q22,0 18,0 L-8,0 Q-12,0 -8,-4 Z" fill="#fff3ea" />
          <path d="M-6,-5 L20,-5" stroke="#ff8066" strokeWidth="2" />
        </g>
      )}

      <g transform={`translate(0 ${upper})`}>
        {/* back arm + bag */}
        {arm(arms.back, jShade, skinShade)}
        {hero ? (
          <g>
            <path d="M-34,-226 Q-60,-170 -58,-120" stroke="#cdb7a6" strokeWidth="3" fill="none" />
            <rect x="-86" y="-132" width="56" height="62" rx="6" fill="#fff0e4" />
            <rect x="-86" y="-132" width="56" height="62" rx="6" fill="#8a5a7a" opacity="0.18" />
            <path d="M-78,-110 L-38,-110" stroke="#ff8066" strokeWidth="3" />
            <circle cx="-58" cy="-92" r="7" fill="#ffb59c" />
          </g>
        ) : null}

        {/* torso */}
        <path d="M-38,-236 Q-46,-182 -48,-118 L40,-116 Q44,-184 36,-236 Q0,-252 -38,-236 Z" fill={jShade} />
        <path d="M-6,-244 Q22,-248 36,-236 Q44,-184 40,-116 L-14,-117 Q-4,-180 -6,-244 Z" fill={jacket} />
        <path d="M14,-240 Q30,-236 36,-226 Q40,-180 36,-130" fill="none" stroke={jLit} strokeWidth="6" opacity="0.5" />
        <path d="M33,-232 Q43,-184 39,-122" fill="none" stroke={rim} strokeWidth="3.5" opacity="0.9" />
        <path d="M-48,-118 L40,-116 L40,-102 L-48,-104 Z" fill={jShade} opacity="0.9" />
        <path d="M-20,-241 Q0,-222 22,-241 Q16,-256 0,-256 Q-16,-256 -20,-241 Z" fill={mix(jacket, "#fff1e6", 0.25)} />
        <path d="M-4,-232 L-6,-196 M8,-232 L10,-198" stroke="#fff1e6" strokeWidth="2" opacity="0.7" />

        {/* front arm */}
        {arm(arms.front, jacket, skin)}
        {pose === "book" ? (
          <g transform="translate(-2 -192) rotate(-8)">
            <rect x="-4" y="-16" width="34" height="42" rx="3" fill="#fff0e4" />
            <rect x="-4" y="-16" width="6" height="42" fill="#c98d72" />
          </g>
        ) : null}

        {/* neck + head */}
        <path d="M-8,-252 L8,-252 L8,-232 L-8,-232 Z" fill={skinShade} />
        {look === "side" ? (
          <g>
            <path d="M-28,-286 Q-30,-258 -14,-246 Q6,-238 24,-250 Q34,-262 30,-286 Q16,-314 -10,-314 Q-26,-306 -28,-286 Z" fill={skin} />
            <path d="M-28,-286 Q-30,-258 -14,-246 Q-2,-242 6,-246 Q-14,-258 -14,-290 Z" fill={skinShade} opacity="0.55" />
            <path d="M28,-282 Q31,-266 22,-252" fill="none" stroke={rim} strokeWidth="2.5" opacity="0.85" />
            {/* eyes */}
            <ellipse cx="14" cy="-276" rx="4.6" ry="6.8" fill="#2a1633" />
            <ellipse cx="14.4" cy="-275" rx="3.2" ry="5.2" fill={hero ? "#8a5bd9" : "#5f7fd1"} />
            <circle cx="12.6" cy="-278" r="1.9" fill="#fff" />
            <ellipse cx="-3" cy="-277" rx="3.8" ry="6.3" fill="#2a1633" />
            <ellipse cx="-2.6" cy="-276" rx="2.6" ry="4.8" fill={hero ? "#8a5bd9" : "#5f7fd1"} />
            <circle cx="-4.2" cy="-279" r="1.6" fill="#fff" />
            <path d="M8,-285 Q15,-289 21,-283 M-9,-284 Q-3,-288 2,-284" stroke="#2b1838" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M8,-291 Q15,-294 21,-289 M-9,-289 Q-3,-293 2,-290" stroke={hair} strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.8" />
            <path d="M26,-268 L28,-264 L25,-263" stroke={skinShade} strokeWidth="1.6" fill="none" strokeLinecap="round" />
            {face === "smile" ? (
              <path d="M10,-260 Q17,-254 24,-260" stroke="#a5505c" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            ) : face === "open" ? (
              <ellipse cx="17" cy="-258" rx="4" ry="3.4" fill="#a5505c" />
            ) : (
              <path d="M12,-259 Q17,-257 22,-259" stroke="#a5505c" strokeWidth="2" fill="none" strokeLinecap="round" />
            )}
            <ellipse cx="6" cy="-262" rx="6" ry="3" fill="#ff8f86" opacity={face === "smile" ? 0.35 : 0.2} />
            {/* hair */}
            <path d="M-34,-290 Q-38,-318 -12,-324 Q18,-330 34,-308 Q40,-286 30,-262 Q27,-282 20,-286 Q12,-300 -4,-296 Q-20,-296 -28,-262 Q-38,-262 -34,-290 Z" fill={hair} />
            <path d="M-30,-292 Q-8,-320 24,-302 Q8,-294 4,-276 Q-4,-298 -14,-292 Q-20,-282 -26,-266 Q-34,-278 -30,-292 Z" fill={hair} />
            <path d="M-22,-306 Q0,-320 22,-306" stroke={hairHi} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8" />
            <path d="M-14,-292 Q-18,-278 -22,-268" stroke={hairHi} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
            <path d="M-36,-270 Q-38,-258 -30,-250" stroke={hairHi} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.55" />
            {hero ? (
              <g>
                <path d="M0,-324 Q-8,-340 6,-346 Q-2,-336 5,-326" fill="none" stroke={hair} strokeWidth="3" strokeLinecap="round" />
                <path d="M-27,-292 L-17,-297 L-15,-291 L-25,-286 Z" fill="#ff8066" />
              </g>
            ) : null}
          </g>
        ) : (
          <g>
            <path d="M-30,-282 Q-33,-320 0,-326 Q33,-320 30,-282 Q30,-262 18,-252 L-18,-252 Q-30,-262 -30,-282 Z" fill={hair} />
            <path d="M-12,-318 Q10,-326 26,-306 Q28,-290 22,-268 Q20,-296 8,-306 Z" fill={hairHi} opacity="0.5" />
            <path d="M-16,-256 Q0,-246 16,-256 L12,-246 Q0,-240 -12,-246 Z" fill={skinShade} />
            <path d="M24,-290 Q30,-270 20,-256" fill="none" stroke={rim} strokeWidth="3" opacity="0.85" />
            {hero ? (
              <g>
                <path d="M2,-326 Q-6,-342 8,-348 Q0,-338 7,-328" fill="none" stroke={hair} strokeWidth="3" strokeLinecap="round" />
                <path d="M-27,-292 L-17,-297 L-15,-291 L-25,-286 Z" fill="#ff8066" />
              </g>
            ) : null}
          </g>
        )}
      </g>

    </g>
  );
}

/** Small distant person: a quick silhouette with a coloured jacket. */
export function Walker({ x, y, s = 0.5, jacket = "#8b6bb8", flip = false, dark = "#2a1632" }: { x: number; y: number; s?: number; jacket?: string; flip?: boolean; dark?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${(flip ? -1 : 1) * s} ${s})`}>
      <path d="M-14,-130 L-3,-130 L-8,0 L-22,0 Z M2,-130 L14,-130 L22,0 L8,0 Z" fill={dark} />
      <path d="M-26,-230 Q-30,-170 -28,-120 L28,-120 Q30,-170 26,-230 Q0,-246 -26,-230 Z" fill={jacket} />
      <path d="M-26,-230 Q-30,-170 -28,-120 L-6,-120 Q-8,-180 -6,-240 Z" fill={dark} opacity="0.35" />
      <circle cx="0" cy="-262" r="26" fill={dark} />
      <path d="M-26,-262 Q-24,-292 4,-292 Q26,-290 26,-262 Q10,-276 -26,-262 Z" fill={mix(dark, "#000000", 0.2)} />
    </g>
  );
}

export function Bench({ x, y, s = 1, color = "#3a2147" }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-120" y="-100" width="240" height="14" rx="4" fill={color} />
      <rect x="-120" y="-150" width="240" height="12" rx="4" fill={color} />
      <rect x="-110" y="-150" width="8" height="64" fill={color} />
      <rect x="102" y="-150" width="8" height="64" fill={color} />
      <rect x="-104" y="-86" width="10" height="86" fill={color} />
      <rect x="94" y="-86" width="10" height="86" fill={color} />
    </g>
  );
}

export function Bubble({ x, y, w, h, text, dir = "left", fill = "#fff6ee", ink = "#3a2147", size = 26 }: { x: number; y: number; w: number; h: number; text: string; dir?: "left" | "right"; fill?: string; ink?: string; size?: number }) {
  const tail = dir === "left" ? `${x + 30},${y + h - 2} ${x + 8},${y + h + 26} ${x + 60},${y + h - 2}` : `${x + w - 60},${y + h - 2} ${x + w - 8},${y + h + 26} ${x + w - 30},${y + h - 2}`;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={h / 2.4} fill={fill} opacity="0.96" />
      <polygon points={tail} fill={fill} opacity="0.96" />
      <text x={x + w / 2} y={y + h / 2 + size * 0.33} textAnchor="middle" fontSize={size} fill={ink} style={{ fontFamily: "var(--font-sans), system-ui, sans-serif", fontWeight: 600 }}>
        {text}
      </text>
    </g>
  );
}

/** Soft outlined thought bubbles with unfinished lines. */
export function Thoughts({ x, y, color = "#f2d3b7" }: { x: number; y: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle cx="-34" cy="104" r="5" fill={color} opacity="0.55" />
      <circle cx="-20" cy="78" r="9" fill={color} opacity="0.6" />
      <g fill="#311b39" fillOpacity="0.55" stroke={color} strokeWidth="2.5" strokeOpacity="0.85">
        <ellipse cx="30" cy="20" rx="82" ry="42" />
        <circle cx="-30" cy="26" r="26" />
        <circle cx="86" cy="34" r="24" />
        <circle cx="10" cy="-12" r="28" />
        <circle cx="64" cy="-6" r="26" />
      </g>
      <ellipse cx="30" cy="20" rx="80" ry="40" fill="#311b39" fillOpacity="0.9" />
      <circle cx="-30" cy="26" r="24" fill="#311b39" fillOpacity="0.9" />
      <circle cx="86" cy="34" r="22" fill="#311b39" fillOpacity="0.9" />
      <circle cx="10" cy="-12" r="26" fill="#311b39" fillOpacity="0.9" />
      <circle cx="64" cy="-6" r="24" fill="#311b39" fillOpacity="0.9" />
      <g fill={color}>
        <circle cx="0" cy="20" r="6" />
        <circle cx="30" cy="20" r="6" opacity="0.8" />
        <circle cx="60" cy="20" r="6" opacity="0.6" />
      </g>
    </g>
  );
}

/** Soft glow disc using a shared radial gradient (defined once per scene frame). */
export function Glow({ cx, cy, r, o = 1 }: { cx: number; cy: number; r: number; o?: number }) {
  return <circle cx={cx} cy={cy} r={r} fill="url(#glowW)" opacity={o} />;
}
