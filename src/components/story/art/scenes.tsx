import * as React from "react";
import {
  W, H, Sky, Sun, Cloud, Rays, Stars, Petals, Bokeh, Building, ClockTower, Tree, Lamp, Hill, Ground,
  Person, Walker, Bench, Bubble, Thoughts, Glow, mix,
} from "./kit";

function Layer({ d = 0, children, className = "" }: { d?: number; children: React.ReactNode; className?: string }) {
  return (
    <g className={`story-layer ${className}`} style={{ ["--d"]: d } as React.CSSProperties}>
      {children}
    </g>
  );
}

function Frame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <svg className="story-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" role="img" aria-label={label}>
      <defs>
        <radialGradient id="glowW">
          <stop offset="0" stopColor="#ffd6a0" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffd6a0" stopOpacity="0" />
        </radialGradient>
      </defs>
      {children}
    </svg>
  );
}

const SKIN_B = "#e9bfa5";
const SKIN_C = "#d9a98f";

/* ───────── Scene 1 · A new world ───────── */
export function Scene1() {
  return (
    <Frame label="Late afternoon on a college campus. A student with a tote bag stands at the start of a path, looking toward a clock tower and groups of friends in the golden light.">
      <Sky id="s1sky" stops={[[0, "#3b2050"], [0.28, "#7a3f7e"], [0.5, "#d8607c"], [0.7, "#ff9a76"], [0.84, "#ffd2a2"]]} />
      <Layer d={0.05}>
        <Sun id="s1sun" cx={640} cy={545} r={64} />
      </Layer>
      <Layer d={0.12}>
        <Cloud x={120} y={150} w={420} />
        <Cloud x={980} y={110} w={520} lit="#ffb59c" shade="#8a4a86" />
        <Cloud x={700} y={290} w={360} lit="#ffd7ae" shade="#b0627f" o={0.8} />
        <Cloud x={1250} y={310} w={260} o={0.7} />
      </Layer>
      <Rays id="s1rays" x={640} y={545} />
      <Layer d={0.25}>
        <Hill y={575} color="#9a5a8a" amp={20} o={0.9} />
        <Building x={60} y={470} w={110} h={125} color="#8f5390" cols={3} rows={3} seed={2} />
        <Building x={190} y={500} w={90} h={95} color="#9a5a8a" cols={3} rows={2} seed={4} />
        <Building x={1480} y={455} w={130} h={140} color="#8f5390" cols={3} rows={3} seed={1} />
      </Layer>
      <Layer d={0.45}>
        <Building x={880} y={375} w={620} h={225} color="#5f3470" roof="#4a2760" cols={9} rows={3} seed={5} arch />
        <ClockTower x={1150} y={255} color="#6a3a78" />
        <Building x={100} y={400} w={430} h={195} color="#5f3470" roof="#4a2760" cols={7} rows={3} seed={7} arch />
      </Layer>
      <Ground id="s1gr" y={592} top="#7a4580" bottom="#34193f" />
      <path d="M772,592 L832,592 L1340,900 L260,900 Z" fill="#f2b394" />
      <path d="M772,592 L800,592 L640,900 L260,900 Z" fill="#c8707f" opacity="0.5" />
      <path d="M810,592 L832,592 L1340,900 L1130,900 Z" fill="#ffd7b0" opacity="0.45" />
      <polygon points="300,900 520,900 880,620 830,610" fill="#34193f" opacity="0.28" />
      <polygon points="1010,900 1180,900 900,640 860,630" fill="#34193f" opacity="0.2" />
      <Layer d={0.6}>
        <Lamp x={560} y={650} s={0.7} />
        <Lamp x={1020} y={650} s={0.7} />
        <Walker x={700} y={622} s={0.28} jacket="#b58bd8" />
        <Walker x={738} y={626} s={0.3} jacket="#ff9d82" flip />
        <Walker x={915} y={640} s={0.34} jacket="#8b6bb8" />
        <Walker x={1075} y={668} s={0.42} jacket="#ffb59c" flip />
        <Walker x={1115} y={672} s={0.44} jacket="#7a8fd6" />
        <Walker x={470} y={690} s={0.46} jacket="#ff8f86" />
        <Walker x={520} y={694} s={0.46} jacket="#c9a3ef" flip />
        <Person x={1230} y={760} s={0.5} jacket="#b78fe0" hair="#3a2147" skin={SKIN_B} pose="speak" face="smile" rim="#ffd9a8" flip dim={0.12} />
        <Person x={1300} y={766} s={0.5} jacket="#ffb08f" hair="#4a2c3e" skin={SKIN_C} pose="stand" face="open" rim="#ffd9a8" dim={0.12} />
      </Layer>
      <Layer d={0.9}>
        <Tree x={190} y={760} s={1.25} leaf="#7a3f7e" leafLit="#d9728a" />
        <Tree x={1470} y={740} s={1.0} leaf="#6a3578" leafLit="#c4668a" seed={4} />
      </Layer>
      <Layer d={1}>
        <Person x={760} y={896} s={1.12} look="back" pose="strap" hero rim="#ffd0a8" />
      </Layer>
      <Layer d={1.5}>
        <path d="M0,0 L520,0 Q410,70 330,80 Q250,130 170,112 Q90,170 0,196 Z" fill="#24102c" />
        {Array.from({ length: 14 }, (_, i) => (
          <circle key={i} cx={40 + ((i * 97) % 440)} cy={60 + ((i * 53) % 120)} r={7 + (i % 3) * 3} fill={i % 2 ? "#ff9d82" : "#ffcbb4"} opacity="0.9" />
        ))}
      </Layer>
      <Layer d={1.8}>
        <Petals />
      </Layer>
      <Bokeh items={[[1200, 150, 40, "#ffd9a8"], [1320, 230, 24, "#ffb59c"], [180, 640, 30, "#ffd9a8"], [1500, 560, 50, "#ffcbb4"]]} />
    </Frame>
  );
}

/* ───────── Scene 2 · The unspoken thoughts ───────── */
export function Scene2() {
  return (
    <Frame label="Golden hour in the courtyard. A student with a notebook stands a little apart in cool shade, watching a small group chat warmly under a tree, with quiet thoughts floating nearby.">
      <Sky id="s2sky" stops={[[0, "#2f1a47"], [0.3, "#6b3a7f"], [0.55, "#c9577c"], [0.76, "#ff8f78"], [0.9, "#ffc392"]]} />
      <Layer d={0.05}>
        <Sun id="s2sun" cx={1180} cy={560} r={58} glow="#ff9d7a" />
      </Layer>
      <Layer d={0.12}>
        <Cloud x={160} y={170} w={460} lit="#ff9d82" shade="#7a3f7e" />
        <Cloud x={820} y={120} w={380} lit="#ffb59c" shade="#8a4a86" o={0.8} />
        <Cloud x={1150} y={250} w={300} lit="#ffd2a2" shade="#b0627f" o={0.7} />
      </Layer>
      <Rays id="s2rays" x={1180} y={560} color="#ffc08a" o={0.2} />
      <Layer d={0.25}>
        <Hill y={600} color="#8a4a86" amp={26} />
        <Building x={80} y={470} w={170} h={140} color="#7d4488" cols={4} rows={3} seed={2} />
        <Building x={1380} y={480} w={200} h={130} color="#7d4488" cols={4} rows={3} seed={6} />
      </Layer>
      <Layer d={0.45}>
        <Building x={560} y={430} w={560} h={190} color="#55306a" roof="#44245a" cols={8} rows={3} seed={9} arch />
      </Layer>
      <Ground id="s2gr" y={610} top="#6e3f78" bottom="#2a1534" />
      <path d="M0,760 L1600,740 L1600,900 L0,900 Z" fill="#c8707f" opacity="0.22" />
      <Layer d={0.7}>
        <path d="M80,700 L640,700 L640,790 L80,790 Z" fill="#3d2150" />
        <path d="M80,700 L640,700 L640,712 L80,712 Z" fill="#8a5a8e" />
        <Lamp x={900} y={720} s={0.9} />
        <Tree x={1350} y={740} s={1.25} leaf="#7a3f7e" leafLit="#ee7f84" seed={3} />
        <ellipse cx="1130" cy="740" rx="360" ry="120" fill="url(#glowW)" />
        <Person x={1010} y={780} s={0.78} jacket="#ffb08f" hair="#4a2c3e" skin={SKIN_B} pose="speak" face="smile" rim="#ffe0b8" />
        <Person x={1160} y={790} s={0.8} jacket="#b78fe0" hair="#2b1838" skin={SKIN_C} pose="rest" face="open" rim="#ffe0b8" flip />
        <Person x={1260} y={776} s={0.76} jacket="#7fa0e6" hair="#6a3f2c" skin={SKIN_B} pose="stand" face="smile" rim="#ffe0b8" flip />
      </Layer>
      <Layer d={0.95}>
        <Person x={380} y={880} s={1.28} pose="book" rim="#b9a0f2" dim={0.1} />
      </Layer>
      <Layer d={1.15}>
        <Thoughts x={520} y={420} />
        <g fill="none" stroke="#f2d3b7" strokeWidth="2" strokeLinecap="round" opacity="0.55">
          <path d="M610,560 Q640,540 676,552" strokeDasharray="1 9" />
          <path d="M650,610 Q690,590 740,606" strokeDasharray="1 9" />
        </g>
      </Layer>
      <Layer d={1.5}>
        <path d="M1600,0 L1090,0 Q1200,80 1290,86 Q1380,140 1470,120 Q1540,170 1600,200 Z" fill="#24102c" />
        {Array.from({ length: 12 }, (_, i) => (
          <circle key={i} cx={1130 + ((i * 83) % 440)} cy={60 + ((i * 47) % 120)} r={6 + (i % 3) * 3} fill={i % 2 ? "#ff9d82" : "#ffcbb4"} opacity="0.85" />
        ))}
      </Layer>
      <Layer d={1.8}>
        <Petals color="#ffa488" />
      </Layer>
    </Frame>
  );
}

/* ───────── Scene 3 · Small moments (three manga-style panels) ───────── */
function Panel({ id, pts, n, children }: { id: string; pts: string; n: string; children: React.ReactNode }) {
  return (
    <g className={`story-panel story-panel-${n}`}>
      <defs>
        <clipPath id={id}>
          <polygon points={pts} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>{children}</g>
      <polygon points={pts} fill="none" stroke="#fff1e6" strokeOpacity="0.7" strokeWidth="3" />
    </g>
  );
}

export function Scene3() {
  return (
    <Frame label="Three small moments in comic-panel style. First, the student asks a classmate on a bench if the seat is free. Second, they raise a hand in class. Third, they share a sketch of an idea with a friend.">
      <Sky id="s3sky" stops={[[0, "#2a1740"], [0.5, "#4d2a63"], [1, "#7a3f7e"]]} />
      <Layer d={0.1}>
        <Cloud x={60} y={60} w={380} lit="#c98aa8" shade="#5f3470" o={0.35} />
        <Cloud x={1120} y={760} w={420} lit="#c98aa8" shade="#5f3470" o={0.3} />
      </Layer>

      <g transform="translate(80 -44) scale(0.9)">
      <Layer d={0.2}>
        <Panel id="s3pA" n="1" pts="90,140 560,140 520,760 60,760">
          <Sky id="s3skyA" stops={[[0, "#6b3a7f"], [0.55, "#e0637c"], [1, "#ffc392"]]} />
          <Sun id="s3sunA" cx={170} cy={400} r={42} />
          <Hill y={520} color="#8a4a86" amp={18} />
          <Tree x={140} y={640} s={0.65} leaf="#7a3f7e" leafLit="#ee7f84" />
          <Ground id="s3grA" y={600} top="#7a4580" bottom="#34193f" />
          <Bench x={290} y={700} s={0.8} color="#2f1a3c" />
          <Person x={250} y={690} s={0.78} seated jacket="#b78fe0" hair="#2b1838" skin={SKIN_B} rim="#ffd9a8" face="smile" />
          <Person x={448} y={718} s={0.86} flip pose="speak" hero rim="#ffd9a8" />
          <Bubble x={190} y={196} w={290} h={74} text="Hey, is this seat taken?" size={23} />
          <circle cx="116" cy="178" r="20" fill="#fff1e6" opacity="0.9" />
          <text x="116" y="186" textAnchor="middle" fontSize="22" fontWeight="700" fill="#3a2147" style={{ fontFamily: "var(--font-serif), serif" }}>1</text>
        </Panel>
      </Layer>

      <Layer d={0.4}>
        <Panel id="s3pB" n="2" pts="600,140 1030,140 990,760 560,760">
          <rect x="540" y="130" width="520" height="640" fill="#5a3470" />
          <rect x="590" y="190" width="340" height="170" rx="6" fill="#2c1a45" />
          <path d="M620,240 L760,240 M620,275 L710,275 M780,300 L890,300" stroke="#e9dccf" strokeWidth="3" opacity="0.5" strokeLinecap="round" />
          <rect x="950" y="200" width="70" height="160" fill="#ff9d82" opacity="0.55" />
          <rect x="560" y="620" width="480" height="150" fill="#3a2147" />
          <Walker x={650} y={690} s={0.5} jacket="#8b6bb8" />
          <Walker x={950} y={690} s={0.5} jacket="#ff9d82" flip />
          <Person x={800} y={760} s={0.9} look="back" pose="raise" hero rim="#ffd9a8" />
          <rect x="680" y="690" width="240" height="90" fill="#2a1632" />
          <rect x="680" y="690" width="240" height="8" fill="#8a5a8e" />
          <Bubble x={660} y={296} w={300} h={74} text="Could I add something?" dir="right" size={22} />
          <circle cx="650" cy="178" r="20" fill="#fff1e6" opacity="0.9" />
          <text x="650" y="186" textAnchor="middle" fontSize="22" fontWeight="700" fill="#3a2147" style={{ fontFamily: "var(--font-serif), serif" }}>2</text>
        </Panel>
      </Layer>

      <Layer d={0.6}>
        <Panel id="s3pC" n="3" pts="1070,140 1540,140 1500,760 1030,760">
          <Sky id="s3skyC" stops={[[0, "#7a3f7e"], [0.6, "#ff8f78"], [1, "#ffd6a6"]]} />
          <Sun id="s3sunC" cx={1450} cy={470} r={40} />
          <Hill y={560} color="#8a4a86" amp={14} />
          <Ground id="s3grC" y={620} top="#6e3f78" bottom="#2a1534" />
          <Bench x={1290} y={720} s={0.9} color="#2f1a3c" />
          <Person x={1215} y={712} s={0.8} seated pose="book" hero rim="#ffe0b8" face="smile" />
          <Person x={1390} y={716} s={0.78} seated flip jacket="#7fa0e6" hair="#6a3f2c" skin={SKIN_C} rim="#ffe0b8" face="open" />
          <Bubble x={1170} y={210} w={320} h={74} text="Here's what I'm thinking." size={22} />
          <circle cx="1150" cy="178" r="20" fill="#fff1e6" opacity="0.9" />
          <text x="1150" y="186" textAnchor="middle" fontSize="22" fontWeight="700" fill="#3a2147" style={{ fontFamily: "var(--font-serif), serif" }}>3</text>
        </Panel>
      </Layer>
      </g>
      <Layer d={1.6}>
        <Petals color="#ffb7a0" />
      </Layer>
    </Frame>
  );
}

/* ───────── Scene 4 · Finding your rhythm ───────── */
function StringLights({ y, sag = 60 }: { y: number; sag?: number }) {
  const bulbs = Array.from({ length: 15 }, (_, i) => {
    const t = (i + 0.5) / 15;
    return { x: Math.round(t * W), y: Math.round(y + Math.sin(t * Math.PI) * sag) };
  });
  return (
    <g>
      <path d={`M0,${y} Q${W / 2},${y + sag * 2} ${W},${y}`} stroke="#2a1632" strokeWidth="3" fill="none" />
      {bulbs.map((b, i) => (
        <g key={i}>
          <circle cx={b.x} cy={b.y + 6} r="20" fill="#ffd6a0" opacity="0.18" />
          <circle cx={b.x} cy={b.y + 6} r="5" fill="#ffe3b8" />
        </g>
      ))}
    </g>
  );
}

export function Scene4() {
  return (
    <Frame label="Warm early evening on the library steps. Two friends sit side by side talking quietly, string lights glowing above them, the student relaxed with a notebook on their lap.">
      <Sky id="s4sky" stops={[[0, "#33204f"], [0.3, "#7a3f7e"], [0.55, "#e0637c"], [0.78, "#ffa27a"], [0.92, "#ffd6a6"]]} />
      <Layer d={0.05}>
        <Sun id="s4sun" cx={1300} cy={600} r={54} />
      </Layer>
      <Layer d={0.12}>
        <Cloud x={200} y={140} w={480} lit="#ff9d82" shade="#7a3f7e" />
        <Cloud x={900} y={200} w={420} lit="#ffb59c" shade="#8a4a86" o={0.75} />
      </Layer>
      <Layer d={0.25}>
        <Hill y={610} color="#8a4a86" amp={24} />
      </Layer>
      <Layer d={0.45}>
        <Building x={40} y={330} w={760} h={290} color="#55306a" roof="#44245a" cols={11} rows={4} seed={3} arch />
        <Building x={1100} y={470} w={420} h={150} color="#5f3470" cols={6} rows={2} seed={8} />
      </Layer>
      <Ground id="s4gr" y={620} top="#6e3f78" bottom="#2a1534" />
      <Layer d={0.6}>
        <Walker x={1180} y={700} s={0.42} jacket="#8b6bb8" />
        <Walker x={1240} y={704} s={0.4} jacket="#ffb59c" flip />
        <Lamp x={380} y={700} s={0.95} />
        <Lamp x={1350} y={700} s={0.95} />
        <Tree x={1480} y={700} s={0.95} leaf="#6a3578" leafLit="#c4668a" seed={9} />
      </Layer>
      <StringLights y={150} sag={70} />
      <Layer d={0.9}>
        <rect x="300" y="780" width="1100" height="120" fill="#6b4376" />
        <rect x="300" y="780" width="1100" height="8" fill="#c9a0b8" opacity="0.8" />
        <rect x="400" y="682" width="900" height="100" fill="#7a5084" />
        <rect x="400" y="682" width="900" height="8" fill="#e0b8c0" opacity="0.9" />
        <ellipse cx="880" cy="700" rx="520" ry="150" fill="url(#glowW)" />
        <Person x={740} y={780} s={1.02} seated pose="book" hero rim="#ffe0b8" face="smile" />
        <Person x={1020} y={782} s={1.0} seated flip pose="rest" jacket="#b78fe0" hair="#6a3f2c" skin={SKIN_C} rim="#ffe0b8" face="open" />
      </Layer>
      <Layer d={1.5}>
        <path d="M0,0 L420,0 Q340,60 260,72 Q190,100 120,92 Q60,130 0,150 Z" fill="#24102c" opacity="0.9" />
      </Layer>
      <Layer d={1.8}>
        <Petals color="#ffd0a0" color2="#ffe3b8" />
      </Layer>
      <Bokeh items={[[200, 560, 36, "#ffd9a8"], [1450, 400, 46, "#ffcbb4"], [700, 300, 26, "#ffe3b8"]]} />
    </Frame>
  );
}

/* ───────── Scene 5 · Your story continues ───────── */
function Glass({ x, y, w, h, title, lines }: { x: number; y: number; w: number; h: number; title: string; lines: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="22" fill="#fff1e6" fillOpacity="0.1" stroke="#fff1e6" strokeOpacity="0.5" strokeWidth="1.5" />
      <rect x={x + 18} y={y + 18} width="26" height="26" rx="9" fill="#ff8066" opacity="0.9" />
      <text x={x + 56} y={y + 38} fontSize="18" fontWeight="600" fill="#fff8f3" style={{ fontFamily: "var(--font-sans), sans-serif" }}>{title}</text>
      {Array.from({ length: lines }, (_, i) => (
        <rect key={i} x={x + 20} y={y + 62 + i * 18} width={w - 40 - i * 30} height="7" rx="3.5" fill="#fff1e6" opacity="0.28" />
      ))}
    </g>
  );
}

export function Scene5() {
  return (
    <Frame label="Twilight on campus. The student walks along a lamplit path toward a soft glow, with translucent glass panels floating ahead like the start of something new.">
      <Sky id="s5sky" stops={[[0, "#1b0f2b"], [0.35, "#3a1f55"], [0.62, "#7a3f7e"], [0.82, "#c9577c"], [1, "#ff9a76"]]} />
      <Stars n={70} />
      <Layer d={0.05}>
        <Glow cx={1440} cy={130} r={170} o={0.7} />
        <circle cx="1440" cy="130" r="38" fill="#fff1dc" opacity="0.95" />
      </Layer>
      <Layer d={0.2}>
        <Cloud x={160} y={200} w={420} lit="#8a5aa0" shade="#4a2760" o={0.6} />
        <Cloud x={900} y={290} w={380} lit="#c9577c" shade="#5a2f72" o={0.5} />
      </Layer>
      <Layer d={0.3}>
        <Hill y={560} color="#4a2760" amp={20} />
        <Building x={120} y={420} w={150} h={150} color="#3d2150" cols={4} rows={4} seed={2} />
        <Building x={300} y={470} w={120} h={100} color="#46285c" cols={3} rows={3} seed={6} />
        <Building x={1160} y={400} w={170} h={170} color="#3d2150" cols={5} rows={4} seed={1} />
        <Building x={1360} y={450} w={150} h={120} color="#46285c" cols={4} rows={3} seed={5} />
      </Layer>
      <Layer d={0.45}>
        <Building x={520} y={350} w={560} h={225} color="#4a2760" roof="#3a1f55" cols={8} rows={3} seed={4} arch />
        
      </Layer>
      <Ground id="s5gr" y={578} top="#4a2760" bottom="#1d0f29" />
      <path d="M770,578 L830,578 L1260,900 L340,900 Z" fill="#c8707f" opacity="0.8" />
      <path d="M780,578 L822,578 L930,900 L670,900 Z" fill="#ffd0a8" opacity="0.5" />
      <Layer d={0.7}>
        <Lamp x={600} y={640} s={0.8} />
        <Lamp x={1000} y={640} s={0.8} />
        <Lamp x={420} y={760} s={1.1} />
        <Lamp x={1180} y={760} s={1.1} />
        <Walker x={690} y={620} s={0.3} jacket="#7a8fd6" />
        <Walker x={720} y={624} s={0.3} jacket="#ffb59c" flip />
      </Layer>
      <Layer d={0.9}>
        <Glass x={400} y={170} w={260} h={112} title="Say it your way" lines={2} />
        <Glass x={700} y={110} w={270} h={112} title="Find first words" lines={2} />
        <Glass x={1010} y={190} w={290} h={112} title="Practice at your pace" lines={2} />
      </Layer>
      <Layer d={1}>
        <Person x={800} y={896} s={1.15} look="back" pose="strap" hero rim="#c9b0ff" />
      </Layer>
      <Layer d={1.6}>
        <g>
          {Array.from({ length: 18 }, (_, i) => (
            <circle key={i} className="story-firefly" cx={80 + ((i * 89) % 1450)} cy={420 + ((i * 61) % 420)} r={2.5 + (i % 3)} fill="#ffe3b8" style={{ animationDelay: `${-(i * 0.9) % 7}s` }} />
          ))}
        </g>
        <Petals color="#c9a3ef" color2="#ffd9c4" />
      </Layer>
      <rect x="0" y="0" width={W} height={H} fill={mix("#311b39", "#000000", 0)} opacity="0" />
    </Frame>
  );
}

export const SCENE_ART = [Scene1, Scene2, Scene3, Scene4, Scene5];
