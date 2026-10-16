/* =========================================================
   Garden decorations, drawn in SVG so they stay crisp:
   - Leaf / Blossom: the two shapes everything is built from
   - ArchVine: a vine climbing around the hero's garden arch
   - Hedge: a band of overlapping leaves along an edge
   - Sprig: a small ornament
   ========================================================= */
import { useMemo } from "react";

const GREENS = ["#2F4A35", "#3F6145", "#5C7A4E", "#7F9C69", "#9DB585"];

/* Tiny seeded random so decorations look the same on every load. */
export function rng(seed = 7) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export const LEAF_PATH = "M0 0 C 2.4 -2.6, 6.2 -2.6, 8 0 C 6.2 2.6, 2.4 2.6, 0 0 Z";

export function Leaf({ x, y, angle, scale = 1, fill = GREENS[2], className, style }) {
  return (
    <path
      d={LEAF_PATH}
      fill={fill}
      className={className}
      style={style}
      transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`}
    />
  );
}

export function Blossom({ x, y, r = 2.4, petal = "#E8A0A6", center = "#E2B04A", className, style }) {
  return (
    <g transform={`translate(${x} ${y})`} className={className} style={style}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="0" cy={-r * 0.9} rx={r * 0.62} ry={r} fill={petal} transform={`rotate(${a})`} />
      ))}
      <circle r={r * 0.5} fill={center} />
    </g>
  );
}

/* Point + tangent along the arch outline (viewBox 0..100 × 0..140,
   semicircle of radius 50 on top). s runs 0 → 1 from bottom-left,
   over the top, to bottom-right. */
function archPoint(s) {
  const side = 90; // straight side height (140 - 50)
  const arc = Math.PI * 50;
  const total = side * 2 + arc;
  let d = s * total;
  if (d < side) return { x: 0, y: 140 - d, a: -90 };
  d -= side;
  if (d < arc) {
    const t = Math.PI - d / 50; // angle from +x axis, π → 0
    return { x: 50 + 50 * Math.cos(t), y: 50 - 50 * Math.sin(t), a: (-t * 180) / Math.PI };
  }
  d -= arc;
  return { x: 100, y: 50 + d, a: 90 };
}

export function ArchVine() {
  const { stem, leaves, blossoms } = useMemo(() => {
    const rand = rng(11);
    const pts = [];
    const N = 160;
    for (let i = 0; i <= N; i++) {
      const s = 0.04 + (i / N) * 0.78; // up the left, over the top, partway down the right
      const p = archPoint(s);
      const wobble = Math.sin(i * 0.55) * 2.2;
      const rad = ((p.a - 90) * Math.PI) / 180; // outward normal
      pts.push({ x: p.x + Math.cos(rad) * wobble, y: p.y + Math.sin(rad) * wobble, a: p.a });
    }
    const stem = "M" + pts.map((p) => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" L");
    const leaves = [];
    const blossoms = [];
    pts.forEach((p, i) => {
      if (i % 4 !== 0) return;
      const side = (i / 4) % 2 ? 1 : -1;
      leaves.push({
        x: p.x, y: p.y,
        angle: p.a + side * (55 + rand() * 25),
        scale: 0.9 + rand() * 0.7,
        fill: GREENS[1 + Math.floor(rand() * 4)],
      });
      if (i % 28 === 12) blossoms.push({ x: p.x, y: p.y, r: 2.4 + rand() * 1.2 });
    });
    return { stem, leaves, blossoms };
  }, []);

  return (
    <svg className="arch-vine" viewBox="-10 -10 120 160" aria-hidden="true">
      <path d={stem} fill="none" stroke="#3F6145" strokeWidth="1.1" strokeLinecap="round" />
      {leaves.map((l, i) => <Leaf key={i} {...l} />)}
      {blossoms.map((b, i) => <Blossom key={i} {...b} petal={i % 2 ? "#F2D7A6" : "#E8A0A6"} />)}
    </svg>
  );
}

export function Hedge({ seed = 3, className = "hedge", flip = false }) {
  const leaves = useMemo(() => {
    const rand = rng(seed);
    const out = [];
    for (let i = 0; i < 260; i++) {
      const x = rand() * 1460 - 10;
      const depth = rand();
      out.push({
        x,
        y: 70 - depth * 46 + rand() * 8,
        angle: -90 + (rand() - 0.5) * 120,
        scale: 3 + rand() * 2.6,
        fill: GREENS[Math.min(4, Math.floor((1 - depth) * 3 + rand() * 2))],
        z: depth,
      });
    }
    return out.sort((a, b) => b.z - a.z);
  }, [seed]);
  const blooms = useMemo(() => {
    const rand = rng(seed + 50);
    return Array.from({ length: 16 }, () => ({ x: rand() * 1440, y: 34 + rand() * 30, r: 4 + rand() * 3 }));
  }, [seed]);

  return (
    <svg
      className={className}
      viewBox="0 0 1440 90"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      style={flip ? { transform: "scaleY(-1)" } : undefined}
    >
      <rect x="0" y="62" width="1440" height="30" fill={GREENS[0]} />
      {leaves.map((l, i) => <Leaf key={i} {...l} />)}
      {blooms.map((b, i) => (
        <Blossom key={i} {...b} petal={["#E8A0A6", "#F2D7A6", "#C9BEE6", "#FBF8F0"][i % 4]} />
      ))}
    </svg>
  );
}

export function Sprig({ className = "sprig" }) {
  return (
    <svg className={className} viewBox="0 0 64 20" aria-hidden="true">
      <path d="M4 10 C 20 6, 44 14, 60 10" fill="none" stroke="#5C7A4E" strokeWidth="1.4" strokeLinecap="round" />
      <Leaf x={14} y={9} angle={-60} scale={1.2} fill="#7F9C69" />
      <Leaf x={22} y={10} angle={60} scale={1.1} fill="#5C7A4E" />
      <Leaf x={40} y={11} angle={-55} scale={1.1} fill="#5C7A4E" />
      <Leaf x={48} y={10} angle={60} scale={1.2} fill="#7F9C69" />
      <Blossom x={32} y={10} r={3.2} />
    </svg>
  );
}
