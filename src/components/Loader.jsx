/* =========================================================
   Opening screen
   1. A flower turns slowly and gains one petal at a time as
      the product photos load.
   2. When everything is ready, vines grow from the flower out
      to the edges of the screen.
   3. The garden screen fades away and the shop is underneath.
   ========================================================= */
import { useEffect, useMemo, useRef, useState } from "react";
import { prefersReducedMotion } from "../utils";
import { Blossom, LEAF_PATH, rng } from "./Garden";

const PETALS = 10;
const PETAL_STEP_MS = 190;  // fastest a new petal can appear
const VINE_MS = 2500;
const LEAVE_MS = 800;
const MAX_WAIT_MS = 9000;   // never hold people longer than this

/* Cubic bezier helpers for placing leaves along each vine. */
const bez = (p0, p1, p2, p3, t) => {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
};
const bezD = (p0, p1, p2, p3, t) => {
  const u = 1 - t;
  return 3 * u * u * (p1 - p0) + 6 * u * t * (p2 - p1) + 3 * t * t * (p3 - p2);
};

/* Keep leaves and blossoms out of the box where the name and
   message sit, so the vines never cover the text. */
function makeClearZone(w, h) {
  const zw = Math.min(380, w * 0.86);
  const zh = 330;
  const cx = w / 2;
  const cy = h / 2 + 30; // the text block sits a little below centre
  return { x0: cx - zw / 2, x1: cx + zw / 2, y0: cy - zh / 2, y1: cy + zh / 2 };
}
const inZone = (z, x, y) => x > z.x0 && x < z.x1 && y > z.y0 && y < z.y1;

function vine(rand, zone, from, angle, reach, depth) {
  const ex = from.x + Math.cos(angle) * reach;
  const ey = from.y + Math.sin(angle) * reach;
  const bend = (rand() > 0.5 ? 1 : -1) * (0.25 + rand() * 0.35);
  const n = { x: -Math.sin(angle), y: Math.cos(angle) };
  const c1 = { x: from.x + (ex - from.x) * 0.33 + n.x * reach * bend, y: from.y + (ey - from.y) * 0.33 + n.y * reach * bend };
  const c2 = { x: from.x + (ex - from.x) * 0.7 - n.x * reach * bend * 0.8, y: from.y + (ey - from.y) * 0.7 - n.y * reach * bend * 0.8 };
  const at = (t) => ({ x: bez(from.x, c1.x, c2.x, ex, t), y: bez(from.y, c1.y, c2.y, ey, t) });
  const dir = (t) => (Math.atan2(bezD(from.y, c1.y, c2.y, ey, t), bezD(from.x, c1.x, c2.x, ex, t)) * 180) / Math.PI;

  const leaves = [];
  const step = depth === 0 ? 0.045 : 0.07;
  for (let t = 0.05; t < 0.98; t += step + rand() * 0.03) {
    const p = at(t);
    if (inZone(zone, p.x, p.y)) continue;
    const side = leaves.length % 2 ? 1 : -1;
    leaves.push({ ...p, t, angle: dir(t) + side * (45 + rand() * 35), scale: (depth === 0 ? 3.2 : 2.4) + rand() * 2, shade: Math.floor(rand() * 4) });
  }
  const blossoms = [];
  [0.35, 0.6, 0.9].forEach((t) => {
    const p = at(t);
    if (rand() > 0.45 && !inZone(zone, p.x, p.y)) blossoms.push({ ...p, t, tone: Math.floor(rand() * 4) });
  });
  return {
    d: `M${from.x} ${from.y} C${c1.x} ${c1.y} ${c2.x} ${c2.y} ${ex} ${ey}`,
    leaves, blossoms, at, dir,
    width: depth === 0 ? 4 + rand() * 3 : 2 + rand() * 1.5,
  };
}

function makeVines(w, h) {
  const rand = rng(29);
  const zone = makeClearZone(w, h);
  const cx = w / 2;
  const cy = h / 2;
  const reach = Math.hypot(w, h) / 2 + 60;
  const vines = [];
  const count = 22;
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + rand() * 0.25;
    // start just outside the text box so stems don't cross the words
    const r0 = Math.max(zone.x1 - cx, zone.y1 - cy) * 0.75;
    const from = { x: cx + Math.cos(a) * r0, y: cy + 30 + Math.sin(a) * r0 * 0.95 };
    const main = vine(rand, zone, from, a, reach - r0, 0);
    vines.push({ ...main, delay: rand() * 200 });
    // one or two side branches from each main vine
    const branches = 1 + Math.floor(rand() * 2);
    for (let b = 0; b < branches; b++) {
      const t = 0.3 + rand() * 0.45;
      const p = main.at(t);
      const ang = (main.dir(t) * Math.PI) / 180 + (rand() > 0.5 ? 1 : -1) * (0.6 + rand() * 0.6);
      const br = vine(rand, zone, p, ang, reach * (0.25 + rand() * 0.3), 1);
      vines.push({ ...br, delay: 200 + t * 1100 });
    }
  }
  return vines;
}

const LEAF_FILLS = ["#5C7A4E", "#7F9C69", "#9DB585", "#B9CDA0"];
const BLOOM_FILLS = ["#E8A0A6", "#F2D7A6", "#C9BEE6", "#FBF8F0"];

export default function Loader({ images = [], onDone }) {
  const reduced = useRef(prefersReducedMotion()).current;
  const [loaded, setLoaded] = useState(0);
  const [petals, setPetals] = useState(reduced ? PETALS : 0);
  const [phase, setPhase] = useState("blooming"); // blooming → vines → leaving
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [timedOut, setTimedOut] = useState(false);
  const total = Math.max(1, images.length);

  // preload the photos the first screen needs
  useEffect(() => {
    let alive = true;
    images.forEach((src) => {
      const img = new Image();
      img.onload = img.onerror = () => alive && setLoaded((n) => n + 1);
      img.src = src;
    });
    const t = setTimeout(() => setTimedOut(true), MAX_WAIT_MS);
    return () => { alive = false; clearTimeout(t); };
  }, [images]);

  // add petals one by one, never ahead of real loading progress
  useEffect(() => {
    if (phase !== "blooming" || petals >= PETALS) return;
    const allowed = timedOut ? PETALS : Math.ceil((loaded / total) * PETALS);
    if (petals >= allowed) return;
    const t = setTimeout(() => setPetals((p) => p + 1), PETAL_STEP_MS);
    return () => clearTimeout(t);
  }, [petals, loaded, total, phase, timedOut]);

  // full flower → vines → fade out
  useEffect(() => {
    if (phase === "blooming" && petals >= PETALS) {
      const t = setTimeout(() => setPhase(reduced ? "leaving" : "vines"), reduced ? 200 : 350);
      return () => clearTimeout(t);
    }
    if (phase === "vines") {
      const t = setTimeout(() => setPhase("leaving"), VINE_MS);
      return () => clearTimeout(t);
    }
    if (phase === "leaving") {
      const t = setTimeout(onDone, LEAVE_MS);
      return () => clearTimeout(t);
    }
  }, [phase, petals, reduced, onDone]);

  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("resize", onResize);
      document.body.style.overflow = "";
    };
  }, []);

  const vines = useMemo(() => makeVines(size.w, size.h), [size.w, size.h]);
  const pct = Math.round((petals / PETALS) * 100);

  return (
    <div className={`loader is-${phase}`} role="status" aria-live="polite">
      <div className="loader-overgrowth" aria-hidden="true" />
      {phase !== "blooming" && !reduced && (
        <svg className="loader-vines" viewBox={`0 0 ${size.w} ${size.h}`} aria-hidden="true">
          {vines.map((v, i) => (
            <g key={i} style={{ "--delay": `${v.delay}ms` }}>
              <path className="vine-stem" d={v.d} pathLength="1" strokeWidth={v.width} />
              {v.leaves.map((l, j) => (
                <path
                  key={j}
                  className="vine-leaf"
                  d={LEAF_PATH}
                  fill={LEAF_FILLS[l.shade]}
                  style={{
                    "--x": `${l.x}px`, "--y": `${l.y}px`, "--r": `${l.angle}deg`, "--s": l.scale,
                    animationDelay: `calc(var(--delay) + ${Math.round(l.t * 1100)}ms)`,
                  }}
                />
              ))}
              {v.blossoms.map((b, j) => (
                <g key={`b${j}`} className="vine-bloom" style={{ "--x": `${b.x}px`, "--y": `${b.y}px`, animationDelay: `calc(var(--delay) + ${Math.round(b.t * 1100) + 250}ms)` }}>
                  <Blossom x={0} y={0} r={7} petal={BLOOM_FILLS[b.tone]} />
                </g>
              ))}
            </g>
          ))}
        </svg>
      )}

      <div className="loader-center">
        <svg className="loader-flower" viewBox="-60 -60 120 120" aria-hidden="true">
          <g className="flower-spin">
            {Array.from({ length: PETALS }, (_, i) => (
              <g key={i} transform={`rotate(${(360 / PETALS) * i})`}>
                <ellipse
                  className={`petal${i < petals ? " is-on" : ""}`}
                  cx="0" cy="-30" rx="11" ry="24"
                />
              </g>
            ))}
            <circle r="15" fill="#E2B04A" />
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <circle key={a} r="2.2" fill="#8A5A1C" transform={`rotate(${a}) translate(0 -7)`} />
            ))}
            <circle r="3" fill="#8A5A1C" />
          </g>
        </svg>
        <p className="loader-name">Mama Bunz'</p>
        <p className="loader-text">
          {phase === "blooming" ? "Gathering the flowers" : "Welcome to the garden"}
          <span className="sr-only"> {pct}%</span>
        </p>
      </div>

      {phase === "blooming" && (
        <button className="loader-skip" onClick={() => setPhase("leaving")}>Skip</button>
      )}
    </div>
  );
}
