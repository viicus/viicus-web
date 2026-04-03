"use client";

import { useCallback, useEffect, useRef } from "react";

// --- Types ---

interface Waypoint { x: number; y: number }

interface PersonNode {
  id: number;
  x: number; y: number;
  vx: number; vy: number;
  radius: number;
  pulsePhase: number;
  name: string;
  location: string;
  waypoints: Waypoint[];
  waypointIdx: number;
  segmentT: number;
  walkSpeed: number;
  prevX: number; prevY: number;
}

// Signal can travel person→person OR person→card
interface Signal {
  fromIdx: number;       // person index (source)
  toIdx: number;         // person index (-1 if targeting card)
  toCardIdx: number;     // card index (-1 if targeting person)
  t: number;
  speed: number;
}

interface SpawnedCard {
  x: number; y: number;
  age: number;
  maxAge: number;
  growDuration: number;
  cardType: number;
  label: string;
  cardW: number; cardH: number;
  phase: number;
  fadeAlpha: number;
  hovered: boolean;
  connectedPeople: Set<number>; // person indices bound to this card (sticky)
  signalsReceived: number;       // count of signals that arrived
  resolved: boolean;             // whether card has been resolved
  resolvedType: "confirmed" | "dismissed" | null;
  resolveFrame: number;          // frame when resolved (for animation timing)
  resolveTarget: number;         // how many signals needed (50-89)
  titleIdx: number;              // index into CARD_TITLES[cardType]
}

interface Hotspot {
  cx: number; cy: number;
  energy: number;
  memberIds: number[];
  spawnedCard: boolean;
}

// --- Theme ---

interface CanvasTheme {
  personColor: string;
  personDim: string;  // "rgba(r,g,b," prefix
  gridColor: string;
  textRgb: string;    // "r,g,b" for rgba() text
  cardBgRgb: string;  // "r,g,b" for card background
  popupBgRgb: string; // "r,g,b" for popup background
  shadowAlpha: number;
  highlightRgb: string; // "r,g,b" for dot highlights
}

function readTheme(): CanvasTheme {
  const s = getComputedStyle(document.documentElement);
  const get = (v: string) => s.getPropertyValue(v).trim();
  const personRgb = get("--person-rgb") || "255,222,33";
  return {
    personColor: get("--person-color") || "#FFDE21",
    personDim: `rgba(${personRgb},`,
    gridColor: get("--grid-color") || "rgba(0,0,0,0.04)",
    textRgb: get("--text-rgb") || "15,15,14",
    cardBgRgb: get("--card-bg-rgb") || "255,255,255",
    popupBgRgb: get("--popup-bg-rgb") || "255,255,255",
    shadowAlpha: parseFloat(get("--shadow-alpha")) || 0.08,
    highlightRgb: get("--highlight-rgb") || "15,15,14",
  };
}

// --- Config ---
const CLUSTER_RADIUS = 100;
const CLUSTER_MIN_PEOPLE = 4;
const CLUSTER_ENERGY_THRESHOLD = 120;
const MAX_CARDS = 6;
const MAX_SIGNALS = 80;
const CARD_ATTRACT_RADIUS = 220; // people within this radius connect to the card
const CARD_REPULSE_RADIUS = 130; // people pushed away from card center
const CARD_SPAWN_COOLDOWN = 200; // min frames between card spawns (~3.3s)

// Center exclusion zone (ellipse) — keeps people & cards away from the text overlay
const EXCLUSION_RX = 340; // horizontal radius
const EXCLUSION_RY = 300; // vertical radius
const EXCLUSION_FORCE = 2.5; // repulsion strength
const CARD_RESOLVE_SIGNALS_MIN = 150;
const CARD_RESOLVE_SIGNALS_MAX = 200;
const CARD_RESOLVE_ANIM_DURATION = 180; // ~3s for resolution animation
const CARD_ACTION_DELAY = 300; // 5s after confirmation before showing action overlay
const CARD_ACTION_FADE = 50; // ~0.8s fade transition

const CARD_COLORS = ["#FF6B21", "#E24B4A", "#FFB800"];
const CARD_DIM = ["rgba(255,107,33,", "rgba(226,75,74,", "rgba(255,184,0,"];
// --- Translations interface (passed from parent via useTranslations) ---
export interface CanvasTranslations {
  typeLabels: string[];
  titles: string[][];
  actions: [string, string][][];
  dismissReasons: [string, string][][];
  recentlyReported: string;
  confirmed: string;
  dismissed: string;
  votes: string;
  communityNotified: string;
  authoritiesNotified: string;
  eventDismissed: string;
  infoNotVerified: string;
  paused: string;
  collecting: string;
}

const FIRST_NAMES = [
  "Leonardo", "Ana", "Carlos", "Mariana", "Rafael", "Juliana", "Pedro",
  "Camila", "Bruno", "Fernanda", "Lucas", "Beatriz", "Gustavo", "Larissa",
  "Thiago", "Isabella", "Diego", "Gabriela", "André", "Patrícia",
  "Rodrigo", "Amanda", "Felipe", "Natália", "Mateus", "Daniela",
  "Vinícius", "Carolina", "Eduardo", "Letícia", "Henrique", "Bianca",
  "Marcelo", "Renata", "João", "Sofia", "Miguel", "Valentina",
  "Arthur", "Helena", "Davi", "Alice", "Gabriel", "Laura",
  "Bernardo", "Manuela", "Samuel", "Cecília", "Nicolas", "Lívia",
  "Heitor", "Luísa", "Theo", "Clara", "Lorenzo",
];
const LAST_NAMES = [
  "Oliveira", "Santos", "Silva", "Souza", "Costa", "Pereira", "Almeida",
  "Ferreira", "Rodrigues", "Lima", "Nascimento", "Araújo", "Martins",
  "Barbosa", "Ribeiro", "Carvalho", "Gomes", "Monteiro", "Teixeira",
  "Moreira", "Cardoso", "Mendes", "Vieira", "Nunes", "Correia",
];
const LOCATIONS = [
  "Guaianases, São Paulo", "Pinheiros, São Paulo", "Centro, Rio de Janeiro",
  "Copacabana, Rio de Janeiro", "Savassi, Belo Horizonte", "Boa Viagem, Recife",
  "Pelourinho, Salvador", "Moinhos, Porto Alegre", "Aldeota, Fortaleza",
  "Asa Sul, Brasília", "Batel, Curitiba", "Marco Zero, Recife",
  "Lapa, São Paulo", "Botafogo, Rio de Janeiro", "Liberdade, São Paulo",
  "Vila Madalena, São Paulo", "Ipanema, Rio de Janeiro", "Tatuapé, São Paulo",
  "Itaim Bibi, São Paulo", "Moema, São Paulo", "Santana, São Paulo",
  "Tijuca, Rio de Janeiro", "Graças, Recife", "Funcionários, BH",
  "Consolação, São Paulo", "Perdizes, São Paulo", "Brooklin, São Paulo",
  "Campo Belo, São Paulo", "Jardins, São Paulo", "Vila Mariana, São Paulo",
  "Barra, Salvador", "Pompeia, São Paulo", "Butantã, São Paulo",
  "Morumbi, São Paulo", "Penha, São Paulo",
];

function sr(i: number) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

let _rngState = 12345;
function seedRng(seed: number) { _rngState = seed & 0x7fffffff || 1; }
function rng() {
  _rngState = (_rngState * 1103515245 + 12345) & 0x7fffffff;
  return _rngState / 0x7fffffff;
}

function clamp(v: number, min: number, max: number) {
  return v < min ? min : v > max ? max : v;
}

function randomWaypoint(cx: number, cy: number, wanderR: number, w: number, h: number, seed: number): Waypoint {
  const angle = rng() * Math.PI * 2;
  const dist = (0.4 + rng() * 0.6) * wanderR;
  const biasAngle = sr(seed * 73) * Math.PI * 2;
  const fx = Math.cos(angle) + Math.cos(biasAngle) * 0.3;
  const fy = Math.sin(angle) + Math.sin(biasAngle) * 0.3;
  const mag = Math.sqrt(fx * fx + fy * fy);
  return {
    x: clamp(cx + (fx / mag) * dist, 30, w - 30),
    y: clamp(cy + (fy / mag) * dist, 30, h - 30),
  };
}

function generateWaypoints(startX: number, startY: number, count: number, wanderR: number, w: number, h: number, seed: number): Waypoint[] {
  const wps: Waypoint[] = [{ x: startX, y: startY }];
  for (let i = 0; i < count; i++) {
    const prev = wps[wps.length - 1];
    wps.push(randomWaypoint(prev.x, prev.y, wanderR, w, h, seed + i * 7));
  }
  return wps;
}

function ease(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function inExclusionZone(px: number, py: number, w: number, h: number): boolean {
  const dx = (px - w / 2) / EXCLUSION_RX;
  const dy = (py - h / 2) / EXCLUSION_RY;
  return dx * dx + dy * dy < 1;
}

function initNodes(w: number, h: number, count: number): PersonNode[] {
  const nodes: PersonNode[] = [];
  const pad = 60;
  seedRng(Date.now());

  // Force clusters in corners/edges so cards appear everywhere
  const cornerOffsets = [
    { x: pad + rng() * 120, y: pad + rng() * 100 },                  // top-left
    { x: w - pad - rng() * 120, y: pad + rng() * 100 },              // top-right
    { x: pad + rng() * 120, y: h - pad - rng() * 100 },              // bottom-left
    { x: w - pad - rng() * 120, y: h - pad - rng() * 100 },          // bottom-right
    { x: w / 2 + (rng() - 0.5) * 200, y: pad + rng() * 80 },        // top-center
    { x: w / 2 + (rng() - 0.5) * 200, y: h - pad - rng() * 80 },    // bottom-center
    { x: pad + rng() * 80, y: h / 2 + (rng() - 0.5) * 150 },        // left-center
    { x: w - pad - rng() * 80, y: h / 2 + (rng() - 0.5) * 150 },    // right-center
  ];

  const clusters: { x: number; y: number; size: number }[] = [];
  // Pick 4-5 corner/edge positions
  const cornerPicks = 4 + Math.floor(rng() * 2);
  const shuffled = cornerOffsets.sort(() => rng() - 0.5);
  for (let c = 0; c < cornerPicks; c++) {
    clusters.push({ ...shuffled[c], size: 3 + Math.floor(rng() * 5) });
  }
  // Add a few random clusters too
  const randomCount = 3 + Math.floor(rng() * 3);
  for (let c = 0; c < randomCount; c++) {
    clusters.push({
      x: pad + rng() * (w - pad * 2),
      y: pad + rng() * (h - pad * 2),
      size: 2 + Math.floor(rng() * 6),
    });
  }

  let personIdx = 0;
  const makePerson = (px: number, py: number, clusterLocation?: string) => {
    const wanderR = 60 + rng() * 140;
    const walkSpeed = 0.0006 + rng() * 0.002;
    const firstName = FIRST_NAMES[Math.floor(rng() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(rng() * LAST_NAMES.length)];
    // ~82% chance of using the cluster's location, ~18% "traveler" from elsewhere
    const location = clusterLocation && rng() < 0.82
      ? clusterLocation
      : LOCATIONS[Math.floor(rng() * LOCATIONS.length)];
    const waypoints = generateWaypoints(px, py, 5, wanderR, w, h, personIdx * 100 + Date.now());
    nodes.push({
      id: personIdx, x: px, y: py, vx: 0, vy: 0,
      radius: 3.5 + rng() * 3.5, pulsePhase: rng() * Math.PI * 2,
      name: `${firstName} ${lastName}`, location,
      waypoints, waypointIdx: 0, segmentT: 0,
      walkSpeed, prevX: px, prevY: py,
    });
    personIdx++;
  };

  for (const cluster of clusters) {
    // Skip clusters that fall inside the exclusion zone
    if (inExclusionZone(cluster.x, cluster.y, w, h)) continue;
    // Each cluster gets a primary location — most people there share it
    const clusterLoc = LOCATIONS[Math.floor(rng() * LOCATIONS.length)];
    for (let j = 0; j < cluster.size && personIdx < count; j++) {
      const angle = rng() * Math.PI * 2;
      const spread = 20 + rng() * 45;
      let px = clamp(cluster.x + Math.cos(angle) * spread, pad, w - pad);
      let py = clamp(cluster.y + Math.sin(angle) * spread, pad, h - pad);
      // Push out of exclusion zone if needed
      if (inExclusionZone(px, py, w, h)) {
        const dx = (px - w / 2) / EXCLUSION_RX, dy = (py - h / 2) / EXCLUSION_RY;
        const d = Math.sqrt(dx * dx + dy * dy) || 0.01;
        px = w / 2 + (dx / d) * EXCLUSION_RX * 1.1;
        py = h / 2 + (dy / d) * EXCLUSION_RY * 1.1;
      }
      makePerson(clamp(px, pad, w - pad), clamp(py, pad, h - pad), clusterLoc);
    }
  }
  // Remaining scattered people — pick a location from the nearest cluster or random
  while (personIdx < count) {
    let px = pad + rng() * (w - pad * 2);
    let py = pad + rng() * (h - pad * 2);
    // Push out of exclusion zone
    if (inExclusionZone(px, py, w, h)) {
      const dx = (px - w / 2) / EXCLUSION_RX, dy = (py - h / 2) / EXCLUSION_RY;
      const d = Math.sqrt(dx * dx + dy * dy) || 0.01;
      px = w / 2 + (dx / d) * EXCLUSION_RX * 1.1;
      py = h / 2 + (dy / d) * EXCLUSION_RY * 1.1;
      px = clamp(px, pad, w - pad); py = clamp(py, pad, h - pad);
    }
    // Find nearest cluster to inherit its location
    let nearestLoc: string | undefined;
    let nearestDist = Infinity;
    for (const cluster of clusters) {
      const dx = px - cluster.x, dy = py - cluster.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < nearestDist) { nearestDist = d; nearestLoc = LOCATIONS[Math.floor(sr(cluster.x * 7 + cluster.y * 13) * LOCATIONS.length)]; }
    }
    // Only use cluster location if reasonably close (~200px), otherwise fully random
    makePerson(px, py, nearestDist < 200 ? nearestLoc : undefined);
  }
  return nodes;
}

function detectClusters(nodes: PersonNode[]): { cx: number; cy: number; members: number[] }[] {
  const visited = new Set<number>();
  const clusters: { cx: number; cy: number; members: number[] }[] = [];
  for (let i = 0; i < nodes.length; i++) {
    if (visited.has(i)) continue;
    const queue = [i];
    const group: number[] = [];
    const gv = new Set<number>([i]);
    while (queue.length > 0) {
      const cur = queue.shift()!;
      group.push(cur);
      for (let j = 0; j < nodes.length; j++) {
        if (gv.has(j)) continue;
        const dx = nodes[cur].x - nodes[j].x;
        const dy = nodes[cur].y - nodes[j].y;
        if (Math.sqrt(dx * dx + dy * dy) < CLUSTER_RADIUS) { gv.add(j); queue.push(j); }
      }
    }
    if (group.length >= CLUSTER_MIN_PEOPLE) {
      let cx = 0, cy = 0;
      for (const idx of group) { cx += nodes[idx].x; cy += nodes[idx].y; visited.add(idx); }
      clusters.push({ cx: cx / group.length, cy: cy / group.length, members: group });
    }
  }
  return clusters;
}

export default function NetworkCanvas({ personCount = 75, translations: T_TEXT }: { personCount?: number; translations: CanvasTranslations }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const hoveredPersonRef = useRef<number>(-1);
  const hoveredPersonAlpha = useRef<number>(0);
  const lastHoveredPersonRef = useRef<number>(-1);
  const hoveredCardRef = useRef<number>(-1);
  const dragCardRef = useRef<{ idx: number; offsetX: number; offsetY: number } | null>(null);
  const themeRef = useRef<CanvasTheme | null>(null);
  const stateRef = useRef<{
    nodes: PersonNode[];
    signals: Signal[];
    cards: SpawnedCard[];
    hotspots: Hotspot[];
    frame: number;
    lastCardSpawn: number;
    w: number; h: number;
  }>({ nodes: [], signals: [], cards: [], hotspots: [], frame: 0, lastCardSpawn: -999, w: 0, h: 0 });

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const s = stateRef.current;
    if (s.nodes.length === 0) s.nodes = initNodes(w, h, personCount);
    s.w = w; s.h = h;
    themeRef.current = readTheme();
  }, [personCount]);

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);

    // Re-read theme when .dark class changes on <html>
    const onThemeChange = () => { themeRef.current = readTheme(); };
    const observer = new MutationObserver(onThemeChange);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const hitTestCard = (mx: number, my: number): number => {
      const cards = stateRef.current.cards;
      for (let i = cards.length - 1; i >= 0; i--) {
        const c = cards[i];
        if (c.fadeAlpha < 0.3) continue;
        const hw = c.cardW / 2 + 8, hh = c.cardH / 2 + 8;
        if (Math.abs(c.x - mx) < hw && Math.abs(c.y - my) < hh) return i;
      }
      return -1;
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };

      // Dragging a card
      const drag = dragCardRef.current;
      if (drag) {
        const cards = stateRef.current.cards;
        if (drag.idx < cards.length) {
          cards[drag.idx].x = e.clientX + drag.offsetX;
          cards[drag.idx].y = e.clientY + drag.offsetY;
        }
        return;
      }

      // Check card hover first
      const cardIdx = hitTestCard(e.clientX, e.clientY);
      hoveredCardRef.current = cardIdx;
      // Update hovered state on cards
      const cards = stateRef.current.cards;
      for (let i = 0; i < cards.length; i++) cards[i].hovered = i === cardIdx;

      const canvas = canvasRef.current;
      if (cardIdx >= 0) {
        if (canvas) canvas.style.cursor = "grab";
        hoveredPersonRef.current = -1;
        return;
      }
      if (canvas) canvas.style.cursor = "default";

      // Person hover
      const nodes = stateRef.current.nodes;
      let cp = -1, cd = 80;
      for (let i = 0; i < nodes.length; i++) {
        const dx = nodes[i].x - e.clientX, dy = nodes[i].y - e.clientY;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < cd) { cd = d; cp = i; }
      }
      hoveredPersonRef.current = cp;
    };

    const onMouseDown = (e: MouseEvent) => {
      const cardIdx = hitTestCard(e.clientX, e.clientY);
      if (cardIdx >= 0) {
        const card = stateRef.current.cards[cardIdx];
        dragCardRef.current = { idx: cardIdx, offsetX: card.x - e.clientX, offsetY: card.y - e.clientY };
        const canvas = canvasRef.current;
        if (canvas) canvas.style.cursor = "grabbing";
      }
    };

    const onMouseUp = () => {
      if (dragCardRef.current) {
        dragCardRef.current = null;
        const canvas = canvasRef.current;
        if (canvas) canvas.style.cursor = "default";
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      observer.disconnect();
    };
  }, [resize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf: number;

    const tick = () => {
      const s = stateRef.current;
      const { w, h, nodes } = s;
      if (w === 0) { raf = requestAnimationFrame(tick); return; }
      const dpr = Math.min(window.devicePixelRatio, 2);
      const T = themeRef.current ?? readTheme();
      const mouse = mouseRef.current;
      s.frame++;

      // --- Update person positions ---
      for (const n of nodes) {
        const wps = n.waypoints;
        if (n.waypointIdx + 1 < wps.length) {
          n.segmentT += n.walkSpeed;
          if (n.segmentT >= 1) {
            n.segmentT = 0; n.prevX = n.x; n.prevY = n.y; n.waypointIdx++;
            if (n.waypointIdx >= wps.length - 2) {
              const wanderR = 60 + sr(n.id * 59 + s.frame * 0.01) * 140;
              for (let k = 0; k < 4; k++) {
                const prev = wps[wps.length - 1];
                wps.push(randomWaypoint(prev.x, prev.y, wanderR, w, h, n.id * 100 + s.frame + k));
              }
              if (wps.length > 12) { const trim = wps.length - 8; wps.splice(0, trim); n.waypointIdx -= trim; }
            }
          }
          const from = wps[n.waypointIdx], to = wps[n.waypointIdx + 1];
          if (from && to) { const t = ease(n.segmentT); n.x = from.x + (to.x - from.x) * t; n.y = from.y + (to.y - from.y) * t; }
        }

        // Mouse repulsion
        const mdx = n.x - mouse.x, mdy = n.y - mouse.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < 100 && mDist > 1) {
          const force = (1 - mDist / 100) * 0.4;
          n.x += (mdx / mDist) * force; n.y += (mdy / mDist) * force;
        }

        // Card repulsion — push people well away from active cards
        for (const card of s.cards) {
          if (card.fadeAlpha < 0.1) continue;
          const cdx = n.x - card.x, cdy = n.y - card.y;
          const cDist = Math.sqrt(cdx * cdx + cdy * cdy);
          if (cDist < CARD_REPULSE_RADIUS && cDist > 1) {
            const force = (1 - cDist / CARD_REPULSE_RADIUS) * 1.8 * card.fadeAlpha;
            n.x += (cdx / cDist) * force;
            n.y += (cdy / cDist) * force;
          }
        }

        // Center exclusion zone repulsion (ellipse)
        const exDx = (n.x - w / 2) / EXCLUSION_RX;
        const exDy = (n.y - h / 2) / EXCLUSION_RY;
        const exDist = Math.sqrt(exDx * exDx + exDy * exDy);
        if (exDist < 1 && exDist > 0.01) {
          const force = (1 - exDist) * EXCLUSION_FORCE;
          n.x += (exDx / exDist) * EXCLUSION_RX * force * 0.02;
          n.y += (exDy / exDist) * EXCLUSION_RY * force * 0.02;
        }

        n.x = clamp(n.x, 20, w - 20);
        n.y = clamp(n.y, 20, h - 20);
      }

      // --- Cluster detection (every 30 frames) ---
      if (s.frame % 30 === 0) {
        const detected = detectClusters(nodes);
        const newHotspots: Hotspot[] = [];
        for (const cluster of detected) {
          let existing: Hotspot | null = null;
          for (const hs of s.hotspots) {
            const dx = hs.cx - cluster.cx, dy = hs.cy - cluster.cy;
            if (Math.sqrt(dx * dx + dy * dy) < CLUSTER_RADIUS * 1.5) { existing = hs; break; }
          }
          if (existing) {
            existing.cx = cluster.cx; existing.cy = cluster.cy;
            existing.memberIds = cluster.members; existing.energy += 30;
            newHotspots.push(existing);
          } else {
            newHotspots.push({ cx: cluster.cx, cy: cluster.cy, energy: 30, memberIds: cluster.members, spawnedCard: false });
          }
        }
        s.hotspots = newHotspots;
      }

      // --- Pre-card signals: between clustered people (buildup phase) ---
      for (const hs of s.hotspots) {
        if (hs.spawnedCard || hs.memberIds.length < 2) continue;
        if (s.frame % 3 === 0 && s.signals.length < MAX_SIGNALS) {
          const fromI = Math.floor(sr(s.frame * 17 + hs.cx) * hs.memberIds.length);
          let toI = Math.floor(sr(s.frame * 31 + hs.cy) * hs.memberIds.length);
          if (toI === fromI) toI = (toI + 1) % hs.memberIds.length;
          s.signals.push({
            fromIdx: hs.memberIds[fromI], toIdx: hs.memberIds[toI], toCardIdx: -1,
            t: 0, speed: 0.015 + sr(s.frame * 7 + s.signals.length) * 0.025,
          });
        }
      }

      // --- Post-card signals: from connected people TO card (intense, sticky) ---
      for (let ci = 0; ci < s.cards.length; ci++) {
        const card = s.cards[ci];
        if (card.fadeAlpha < 0.2 || card.resolved) continue;
        // Spawn signals every 2 frames from connected people only
        if (s.frame % 2 === 0 && s.signals.length < MAX_SIGNALS) {
          for (const ni of card.connectedPeople) {
            if (ni >= nodes.length) continue;
            // Random chance so not all fire at once
            if (sr(s.frame * 13 + ni * 7 + ci * 31) < 0.15 && s.signals.length < MAX_SIGNALS) {
              s.signals.push({
                fromIdx: ni, toIdx: -1, toCardIdx: ci,
                t: 0, speed: 0.012 + sr(s.frame * 11 + ni) * 0.02,
              });
            }
          }
        }
      }

      // --- Update signals ---
      for (let i = s.signals.length - 1; i >= 0; i--) {
        s.signals[i].t += s.signals[i].speed;
        if (s.signals[i].t >= 1) {
          // Count signal arrival at card
          const sig = s.signals[i];
          if (sig.toCardIdx >= 0 && sig.toCardIdx < s.cards.length) {
            const card = s.cards[sig.toCardIdx];
            if (!card.resolved) card.signalsReceived++;
          }
          s.signals.splice(i, 1);
        }
      }

      // --- Check card resolution ---
      for (let ci = 0; ci < s.cards.length; ci++) {
        const card = s.cards[ci];
        if (!card.resolved && card.signalsReceived >= card.resolveTarget) {
          card.resolved = true;
          card.resolveFrame = s.frame;
          card.resolvedType = sr(s.frame * 37 + card.x * 11 + card.y * 23) < 0.8 ? "confirmed" : "dismissed";
          // Extend card life so resolution + action overlay can play out
          const neededTime = CARD_ACTION_DELAY + CARD_ACTION_FADE + 360; // ~6s after action shows
          const remaining = card.maxAge - card.age;
          if (remaining < neededTime) {
            card.maxAge = card.age + neededTime;
          }
        }
      }

      // --- Spawn cards from hotspots (one at a time, desynchronized) ---
      if (s.frame - s.lastCardSpawn >= CARD_SPAWN_COOLDOWN) {
        // Pick the hotspot with the most energy that hasn't spawned yet
        let bestHs: Hotspot | null = null;
        let bestEnergy = 0;
        for (const hs of s.hotspots) {
          if (hs.spawnedCard || hs.energy < CLUSTER_ENERGY_THRESHOLD) continue;
          // Don't spawn cards in center exclusion zone
          if (inExclusionZone(hs.cx, hs.cy, w, h)) continue;
          if (hs.energy > bestEnergy) { bestEnergy = hs.energy; bestHs = hs; }
        }
        if (bestHs && s.cards.length < MAX_CARDS) {
          let tooClose = false;
          for (const card of s.cards) {
            const dx = card.x - bestHs.cx, dy = card.y - bestHs.cy;
            if (Math.sqrt(dx * dx + dy * dy) < 250) { tooClose = true; break; }
          }
          if (!tooClose) {
            const cardType = Math.floor(sr(s.frame * 13 + bestHs.cx * 7) * 3);
            const titles = T_TEXT.titles[cardType];
            const tIdx = Math.floor(sr(s.frame * 23 + bestHs.cy * 11) * titles.length);
            s.cards.push({
              x: bestHs.cx, y: bestHs.cy, age: 0,
              maxAge: 600 + Math.floor(sr(s.frame * 41) * 600), // 10-20 seconds
              growDuration: 120, cardType,
              label: titles[tIdx], titleIdx: tIdx,
              cardW: 280, cardH: 94,
              phase: sr(s.frame * 53) * Math.PI * 2,
              fadeAlpha: 0, hovered: false,
              connectedPeople: new Set<number>(),
              signalsReceived: 0, resolved: false,
              resolvedType: null, resolveFrame: 0,
              resolveTarget: CARD_RESOLVE_SIGNALS_MIN + Math.floor(sr(s.frame * 67 + bestHs.cx * 19) * (CARD_RESOLVE_SIGNALS_MAX - CARD_RESOLVE_SIGNALS_MIN + 1)),
            });
            bestHs.spawnedCard = true;
            s.lastCardSpawn = s.frame;
          }
        }
      }

      // --- Build personToCard lookup & bind free people to nearby cards (sticky exclusive) ---
      const personToCard = new Map<number, number>(); // person idx → card idx
      for (let ci = 0; ci < s.cards.length; ci++) {
        const card = s.cards[ci];
        // Register already-bound people
        for (const pi of card.connectedPeople) personToCard.set(pi, ci);
      }
      // Bind free people within attract radius to cards
      for (let ci = 0; ci < s.cards.length; ci++) {
        const card = s.cards[ci];
        if (card.fadeAlpha < 0.15) continue;
        for (let ni = 0; ni < nodes.length; ni++) {
          if (personToCard.has(ni)) continue; // already bound to another card
          const dx = nodes[ni].x - card.x, dy = nodes[ni].y - card.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CARD_ATTRACT_RADIUS) {
            card.connectedPeople.add(ni);
            personToCard.set(ni, ci);
          }
        }
      }

      // --- Update cards ---
      const isDraggingCard = dragCardRef.current !== null;
      for (let i = s.cards.length - 1; i >= 0; i--) {
        const card = s.cards[i];
        const isBeingDragged = isDraggingCard && dragCardRef.current!.idx === i;
        const isPaused = card.hovered || isBeingDragged;

        // Only age when not paused
        if (!isPaused) card.age++;

        if (card.age < card.growDuration) {
          card.fadeAlpha = Math.min(card.fadeAlpha + 0.02, 1);
        } else if (!isPaused && card.age > card.maxAge - 90) {
          card.fadeAlpha = Math.max(card.fadeAlpha - 0.012, 0);
        } else {
          card.fadeAlpha = Math.min(card.fadeAlpha + 0.02, 1);
        }
        if (card.age >= card.maxAge) {
          // Free connected people before removing card
          card.connectedPeople.clear();
          s.cards.splice(i, 1);
          // Fix drag reference if needed
          if (dragCardRef.current && dragCardRef.current.idx === i) dragCardRef.current = null;
          if (dragCardRef.current && dragCardRef.current.idx > i) dragCardRef.current.idx--;
        }
      }

      // ======= DRAW =======
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      // Grid
      ctx.strokeStyle = T.gridColor;
      ctx.lineWidth = 0.5;
      for (let gx = 0; gx < w; gx += 60) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
      for (let gy = 0; gy < h; gy += 60) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }

      // Subtle connection lines between nearby people
      ctx.lineCap = "round";
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.strokeStyle = T.personDim + ((1 - dist / 120) * 0.18) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
          }
        }
      }

      // Cluster connection lines (buildup, before card)
      for (const hs of s.hotspots) {
        if (hs.energy < 30 || hs.spawnedCard) continue;
        const intensity = Math.min(hs.energy / CLUSTER_ENERGY_THRESHOLD, 1);
        for (let i = 0; i < hs.memberIds.length; i++) {
          for (let j = i + 1; j < hs.memberIds.length; j++) {
            const a = nodes[hs.memberIds[i]], b = nodes[hs.memberIds[j]];
            const dx = a.x - b.x, dy = a.y - b.y, dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < CLUSTER_RADIUS) {
              ctx.strokeStyle = T.personDim + ((1 - dist / CLUSTER_RADIUS) * 0.3 * intensity) + ")";
              ctx.lineWidth = 1.2;
              ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            }
          }
        }
      }

      // Person → Card connection lines (sticky, high contrast)
      for (let ci = 0; ci < s.cards.length; ci++) {
        const card = s.cards[ci];
        if (card.fadeAlpha < 0.1) continue;
        const dimColor = CARD_DIM[card.cardType];
        // Find the card edge to connect the line to (not center)
        const chw = card.cardW / 2, chh = card.cardH / 2;
        for (const ni of card.connectedPeople) {
          if (ni >= nodes.length) continue;
          const n = nodes[ni];
          const dx = n.x - card.x, dy = n.y - card.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          // Connect to nearest card edge point
          const angle = Math.atan2(dy, dx);
          const edgeX = card.x + Math.cos(angle) * Math.min(chw, Math.abs(Math.cos(angle)) > 0.01 ? chw / Math.abs(Math.cos(angle)) : chh) * Math.sign(Math.cos(angle)) * 0.6;
          const edgeY = card.y + Math.sin(angle) * Math.min(chh, Math.abs(Math.sin(angle)) > 0.01 ? chh / Math.abs(Math.sin(angle)) : chw) * Math.sign(Math.sin(angle)) * 0.6;
          const distFactor = dist < CARD_ATTRACT_RADIUS ? (1 - dist / CARD_ATTRACT_RADIUS) : 0.3;
          const opacity = distFactor * 0.5 * card.fadeAlpha;
          const grad = ctx.createLinearGradient(n.x, n.y, edgeX, edgeY);
          grad.addColorStop(0, T.personDim + (opacity * 0.6) + ")");
          grad.addColorStop(0.6, dimColor + (opacity * 0.8) + ")");
          grad.addColorStop(1, dimColor + (opacity * 1.2) + ")");
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(edgeX, edgeY); ctx.stroke();
        }
      }

      // Signal particles
      for (const sig of s.signals) {
        const a = nodes[sig.fromIdx];
        if (!a) continue;
        let bx: number, by: number;
        let sigColor = T.personColor;
        let sigDim = T.personDim;
        if (sig.toCardIdx >= 0 && sig.toCardIdx < s.cards.length) {
          const card = s.cards[sig.toCardIdx];
          bx = card.x; by = card.y;
          sigColor = CARD_COLORS[card.cardType];
          sigDim = CARD_DIM[card.cardType];
        } else if (sig.toIdx >= 0 && sig.toIdx < nodes.length) {
          bx = nodes[sig.toIdx].x; by = nodes[sig.toIdx].y;
        } else continue;

        const t = sig.t;
        const sx = a.x + (bx - a.x) * t, sy = a.y + (by - a.y) * t;
        const alpha = t < 0.15 ? t / 0.15 : t > 0.85 ? (1 - t) / 0.15 : 1;

        ctx.beginPath(); ctx.arc(sx, sy, 5, 0, Math.PI * 2);
        ctx.fillStyle = sigDim + (alpha * 0.06) + ")"; ctx.fill();
        ctx.beginPath(); ctx.arc(sx, sy, 2, 0, Math.PI * 2);
        ctx.fillStyle = sigColor; ctx.globalAlpha = alpha * 0.8; ctx.fill(); ctx.globalAlpha = 1;
      }

      // Person nodes
      for (let idx = 0; idx < nodes.length; idx++) {
        const n = nodes[idx];
        const pulse = Math.sin(s.frame * 0.03 + n.pulsePhase) * 0.3 + 0.7;
        const r = n.radius * (0.92 + pulse * 0.08);
        const mdx = n.x - mouse.x, mdy = n.y - mouse.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        const mouseGlow = mDist < 150 ? (1 - mDist / 150) * 0.25 : 0;

        ctx.beginPath(); ctx.arc(n.x, n.y, r + 5 + pulse * 3, 0, Math.PI * 2);
        ctx.strokeStyle = T.personDim + (pulse * 0.07 + mouseGlow * 0.4) + ")"; ctx.lineWidth = 0.6; ctx.stroke();

        ctx.beginPath(); ctx.arc(n.x, n.y, r + 3, 0, Math.PI * 2);
        ctx.fillStyle = T.personDim + (pulse * 0.1 + mouseGlow) + ")"; ctx.fill();

        ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = T.personColor; ctx.globalAlpha = 0.7; ctx.fill(); ctx.globalAlpha = 1;

        ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${T.highlightRgb},0.08)`; ctx.lineWidth = 0.5; ctx.stroke();

        ctx.beginPath(); ctx.arc(n.x - r * 0.2, n.y - r * 0.25, r * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${T.highlightRgb},0.2)`; ctx.fill();

        const s2 = r * 0.5;
        ctx.fillStyle = `rgba(${T.highlightRgb},0.85)`;
        ctx.beginPath(); ctx.arc(n.x, n.y - s2 * 0.3, s2 * 0.32, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(n.x, n.y + s2 * 0.35, s2 * 0.42, s2 * 0.28, 0, 0, Math.PI * 2); ctx.fill();
      }

      // --- Spawned cards (dot → card animation) ---
      for (let ci = 0; ci < s.cards.length; ci++) {
        const card = s.cards[ci];
        const isCardDragged = isDraggingCard && dragCardRef.current!.idx === ci;
        const isCardHovered = card.hovered || isCardDragged;
        const color = CARD_COLORS[card.cardType];
        const dimColor = CARD_DIM[card.cardType];
        const growT = clamp(card.age / card.growDuration, 0, 1);
        const pulse = Math.sin(s.frame * 0.04 + card.phase) * 0.5 + 0.5;
        const alpha = card.fadeAlpha;
        if (alpha < 0.01) continue;
        ctx.globalAlpha = alpha;
        const hoverScale = isCardHovered ? 1.06 : 1;

        if (growT < 0.35) {
          // Phase 1: Pulsing dot
          const dp = growT / 0.35;
          const dotR = 3 + dp * 6;

          ctx.beginPath(); ctx.arc(card.x, card.y, dotR + pulse * 8 + 10, 0, Math.PI * 2);
          ctx.strokeStyle = dimColor + (pulse * 0.1 * alpha) + ")"; ctx.lineWidth = 0.6; ctx.stroke();

          ctx.beginPath(); ctx.arc(card.x, card.y, dotR + pulse * 4 + 4, 0, Math.PI * 2);
          ctx.strokeStyle = dimColor + (pulse * 0.18 * alpha) + ")"; ctx.lineWidth = 0.8; ctx.stroke();

          ctx.beginPath(); ctx.arc(card.x, card.y, dotR + 8, 0, Math.PI * 2);
          ctx.fillStyle = dimColor + (0.06 * alpha) + ")"; ctx.fill();

          ctx.beginPath(); ctx.arc(card.x, card.y, dotR, 0, Math.PI * 2);
          ctx.fillStyle = color; ctx.fill();

        } else if (growT < 1) {
          // Phase 2: Expanding into card
          const cp = (growT - 0.35) / 0.65;
          const ec = ease(cp);
          const cw = 10 + ec * (card.cardW - 10), ch = 10 + ec * (card.cardH - 10);
          const cx = card.x - cw / 2, cy = card.y - ch / 2;
          const rad = 4 + ec * 2;

          ctx.beginPath(); ctx.roundRect(cx + 1.5, cy + 1.5, cw, ch, rad);
          ctx.fillStyle = `rgba(0,0,0,${T.shadowAlpha * alpha})`; ctx.fill();

          ctx.beginPath(); ctx.roundRect(cx, cy, cw, ch, rad);
          ctx.fillStyle = `rgba(${T.cardBgRgb},${0.92 * alpha})`; ctx.fill();

          ctx.beginPath(); ctx.roundRect(cx, cy, cw, ch, rad);
          ctx.strokeStyle = dimColor + (0.3 * alpha) + ")"; ctx.lineWidth = 0.8; ctx.stroke();

          ctx.beginPath(); ctx.roundRect(cx, cy, 3, ch, [rad, 0, 0, rad]);
          ctx.fillStyle = color; ctx.globalAlpha = alpha * 0.7; ctx.fill(); ctx.globalAlpha = alpha;

          if (cp > 0.4) {
            const ta = (cp - 0.4) / 0.6; ctx.globalAlpha = alpha * ta;
            ctx.font = "700 11px system-ui, sans-serif"; ctx.fillStyle = color;
            ctx.fillText(T_TEXT.typeLabels[card.cardType], cx + 14, cy + 20);
            ctx.beginPath(); ctx.arc(cx + cw - 16, cy + 16, 3.5, 0, Math.PI * 2);
            ctx.fillStyle = color; ctx.globalAlpha = alpha * ta * (0.4 + pulse * 0.4); ctx.fill(); ctx.globalAlpha = alpha * ta;
            ctx.font = "600 14px system-ui, sans-serif"; ctx.fillStyle = `rgba(${T.textRgb},${0.8 * ta})`;
            let title = card.label; const maxW = cw - 30;
            while (ctx.measureText(title).width > maxW && title.length > 3) title = title.slice(0, -4) + "...";
            ctx.fillText(title, cx + 14, cy + 42);
            ctx.font = "400 10px system-ui, sans-serif"; ctx.fillStyle = `rgba(${T.textRgb},${0.3 * ta})`;
            ctx.fillText(T_TEXT.recentlyReported, cx + 14, cy + ch - 12);
            ctx.globalAlpha = alpha;
          }

        } else {
          // Phase 3: Full card
          const isResolved = card.resolved && card.resolvedType;
          const resolveAge = isResolved ? s.frame - card.resolveFrame : 0;
          const resolveT = isResolved ? clamp(resolveAge / 40, 0, 1) : 0; // 40-frame transition
          const isConfirmed = card.resolvedType === "confirmed";

          // Resolution colors
          const resolveColor = isConfirmed ? "#1D9E75" : "#9E9C93";
          const resolveDim = isConfirmed ? "rgba(29,158,117," : "rgba(158,156,147,";
          const resolveGlowColor = isConfirmed ? "rgba(29,158,117," : "rgba(158,156,147,";

          // Blend between original card color and resolve color
          const activeColor = isResolved ? resolveColor : color;
          const activeDim = isResolved ? resolveDim : dimColor;

          const cw = card.cardW * hoverScale, ch = card.cardH * hoverScale;
          const cx = card.x - cw / 2, cy = card.y - ch / 2;
          const rad = 6;
          const hoverGlow = isCardHovered ? 0.15 : 0;

          // Resolution flash effect
          if (isResolved && resolveAge < 30) {
            const flashAlpha = (1 - resolveAge / 30) * 0.25 * alpha;
            ctx.beginPath(); ctx.arc(card.x, card.y, 40 + resolveAge * 3, 0, Math.PI * 2);
            ctx.fillStyle = resolveGlowColor + flashAlpha + ")"; ctx.fill();
          }

          // Dragged outer glow
          if (isCardDragged) {
            ctx.beginPath(); ctx.roundRect(cx - 14, cy - 14, cw + 28, ch + 28, rad + 8);
            ctx.fillStyle = activeDim + (0.06 * alpha) + ")"; ctx.fill();
          }

          const pe = pulse * 4 + (isCardHovered ? 6 : 0);
          ctx.beginPath(); ctx.roundRect(cx - pe, cy - pe, cw + pe * 2, ch + pe * 2, rad + 2);
          ctx.strokeStyle = activeDim + ((pulse * 0.07 + hoverGlow) * alpha) + ")"; ctx.lineWidth = 0.6; ctx.stroke();

          ctx.beginPath(); ctx.roundRect(cx - 3, cy - 3, cw + 6, ch + 6, rad + 1);
          ctx.fillStyle = activeDim + ((0.03 + hoverGlow * 0.5) * alpha) + ")"; ctx.fill();

          ctx.beginPath(); ctx.roundRect(cx + 1.5, cy + 1.5, cw, ch, rad);
          ctx.fillStyle = `rgba(0,0,0,${(isCardDragged ? T.shadowAlpha + 0.1 : T.shadowAlpha) * alpha})`; ctx.fill();

          ctx.beginPath(); ctx.roundRect(cx, cy, cw, ch, rad);
          ctx.fillStyle = `rgba(${T.cardBgRgb},${(isCardHovered ? 0.96 : 0.92) * alpha})`; ctx.fill();

          ctx.beginPath(); ctx.roundRect(cx, cy, cw, ch, rad);
          ctx.strokeStyle = activeDim + ((0.22 + hoverGlow * 1.5 + pulse * 0.05) * alpha) + ")";
          ctx.lineWidth = isCardHovered ? 1.2 : 0.8; ctx.stroke();

          // Left accent bar
          ctx.beginPath(); ctx.roundRect(cx, cy, 4, ch, [rad, 0, 0, rad]);
          ctx.fillStyle = activeColor; ctx.globalAlpha = alpha * (0.7 + pulse * 0.15); ctx.fill(); ctx.globalAlpha = alpha;

          // Action overlay phase (5s after resolution — both confirmed & dismissed)
          const showAction = isResolved && resolveAge >= CARD_ACTION_DELAY;
          const actionT = showAction ? clamp((resolveAge - CARD_ACTION_DELAY) / CARD_ACTION_FADE, 0, 1) : 0;
          const contentAlpha = 1 - actionT; // original content fades out

          if (actionT < 1) {
            // --- Original card content (fades out when action appears) ---
            const cAlpha = alpha * contentAlpha;

            // Type label
            ctx.font = "700 11px system-ui, sans-serif"; ctx.fillStyle = activeColor;
            ctx.globalAlpha = cAlpha * 0.85; ctx.fillText(T_TEXT.typeLabels[card.cardType], cx + 14, cy + 20); ctx.globalAlpha = cAlpha;

            // Status dot (top-right)
            ctx.beginPath(); ctx.arc(cx + cw - 16, cy + 16, 3.5, 0, Math.PI * 2);
            ctx.fillStyle = activeColor; ctx.globalAlpha = cAlpha * (0.4 + pulse * 0.4); ctx.fill(); ctx.globalAlpha = cAlpha;

            ctx.beginPath(); ctx.arc(cx + cw - 16, cy + 16, 3.5 + pulse * 3, 0, Math.PI * 2);
            ctx.strokeStyle = activeDim + (pulse * 0.12 * cAlpha) + ")"; ctx.lineWidth = 0.5; ctx.stroke();

            // Title
            ctx.font = "600 14px system-ui, sans-serif"; ctx.fillStyle = `rgba(${T.textRgb},${(0.8 + hoverGlow) * cAlpha})`;
            let title = card.label; const maxW = cw - 30;
            while (ctx.measureText(title).width > maxW && title.length > 3) title = title.slice(0, -4) + "...";
            ctx.fillText(title, cx + 14, cy + 42);

            // Bottom area: progress bar OR resolution status
            if (isResolved && resolveT > 0) {
              const badgeAlpha = ease(resolveT) * cAlpha;
              ctx.globalAlpha = badgeAlpha;
              const statusText = isConfirmed ? T_TEXT.confirmed : T_TEXT.dismissed;
              const statusIcon = isConfirmed ? "\u2713" : "\u2717";
              ctx.font = "700 11px system-ui, sans-serif";
              ctx.fillStyle = resolveColor;
              ctx.fillText(`${statusIcon} ${statusText}`, cx + 14, cy + ch - 14);
              ctx.font = "400 10px system-ui, sans-serif";
              ctx.fillStyle = `rgba(${T.textRgb},${0.35 * badgeAlpha})`;
              ctx.fillText(`${card.signalsReceived} ${T_TEXT.votes}`, cx + cw - 65, cy + ch - 14);
            } else {
              const barX = cx + 14, barY = cy + ch - 18, barW = cw - 70, barH = 4;
              const progress = clamp(card.signalsReceived / card.resolveTarget, 0, 1);
              ctx.beginPath(); ctx.roundRect(barX, barY, barW, barH, 2);
              ctx.fillStyle = `rgba(${T.textRgb},${0.06 * cAlpha})`; ctx.fill();
              if (progress > 0) {
                ctx.beginPath(); ctx.roundRect(barX, barY, barW * progress, barH, 2);
                ctx.fillStyle = activeDim + (0.5 * cAlpha) + ")"; ctx.fill();
              }
              ctx.font = "500 10px system-ui, sans-serif";
              ctx.fillStyle = `rgba(${T.textRgb},${0.3 * cAlpha})`;
              ctx.fillText(`${card.signalsReceived}/${card.resolveTarget}`, cx + cw - 52, cy + ch - 14);
              ctx.font = "400 10px system-ui, sans-serif"; ctx.fillStyle = `rgba(${T.textRgb},${0.25 * cAlpha})`;
              const ageSec = Math.floor(card.age / 60);
              const meta = isCardHovered ? T_TEXT.paused : ageSec < 5 ? T_TEXT.collecting : `${ageSec}s`;
              ctx.fillText(meta, cx + 14, cy + 60);
            }
            ctx.globalAlpha = alpha;
          }

          if (actionT > 0) {
            // --- Action overlay (fades in) ---
            const aAlpha = alpha * ease(actionT);
            const actionsSource = isConfirmed ? T_TEXT.actions : T_TEXT.dismissReasons;
            const actions = actionsSource[card.cardType]?.[card.titleIdx];
            const line1 = actions?.[0] ?? (isConfirmed ? T_TEXT.communityNotified : T_TEXT.eventDismissed);
            const line2 = actions?.[1] ?? (isConfirmed ? T_TEXT.authoritiesNotified : T_TEXT.infoNotVerified);

            // Status header
            ctx.globalAlpha = aAlpha * 0.9;
            ctx.font = "700 11px system-ui, sans-serif";
            if (isConfirmed) {
              ctx.fillStyle = "#1D9E75";
              ctx.fillText(`\u2713 ${T_TEXT.confirmed}`, cx + 14, cy + 20);
            } else {
              ctx.fillStyle = "#9E9C93";
              ctx.fillText(`\u2717 ${T_TEXT.dismissed}`, cx + 14, cy + 20);
            }

            // Line 1
            ctx.font = "600 14px system-ui, sans-serif";
            ctx.fillStyle = `rgba(${T.textRgb},${0.9 * aAlpha})`;
            ctx.fillText(line1, cx + 14, cy + 42);

            // Line 2 — reason/action
            ctx.font = "500 11px system-ui, sans-serif";
            ctx.fillStyle = `rgba(${T.textRgb},${0.5 * aAlpha})`;
            let actionText = line2;
            const actionMaxW = cw - 28;
            while (ctx.measureText(actionText).width > actionMaxW && actionText.length > 3) actionText = actionText.slice(0, -4) + "...";
            ctx.fillText(actionText, cx + 14, cy + 60);

            // Votes count bottom-right
            ctx.font = "400 9px system-ui, sans-serif";
            ctx.fillStyle = `rgba(${T.textRgb},${0.25 * aAlpha})`;
            ctx.fillText(`${card.signalsReceived} ${T_TEXT.votes}`, cx + cw - 60, cy + ch - 12);

            ctx.globalAlpha = alpha;
          }
        }
        ctx.globalAlpha = 1;
      }

      // Person hover popup
      const hovPerson = hoveredPersonRef.current;
      if (hovPerson >= 0 && hovPerson !== lastHoveredPersonRef.current) {
        hoveredPersonAlpha.current = 0; lastHoveredPersonRef.current = hovPerson;
      }
      if (hovPerson < 0 && hoveredPersonAlpha.current <= 0.01) lastHoveredPersonRef.current = -1;
      hoveredPersonAlpha.current = hovPerson >= 0
        ? Math.min(hoveredPersonAlpha.current + 0.12, 1)
        : Math.max(hoveredPersonAlpha.current - 0.1, 0);
      const popupAlpha = hoveredPersonAlpha.current;
      const popupTarget = lastHoveredPersonRef.current;
      if (popupAlpha > 0.01 && popupTarget >= 0) {
        const pn = nodes[popupTarget];
        const pf = "500 11px system-ui, sans-serif", psf = "400 9px system-ui, sans-serif";
        ctx.font = pf; const nw = ctx.measureText(pn.name).width;
        ctx.font = psf; const lw = ctx.measureText(pn.location).width;
        const pw = Math.max(nw, lw) + 20, ph = 40, pr = 8;
        let px = pn.x - pw / 2, py = pn.y - pn.radius - ph - 12;
        if (px < 8) px = 8; if (px + pw > w - 8) px = w - pw - 8;
        if (py < 8) py = pn.y + pn.radius + 12;
        ctx.globalAlpha = popupAlpha;
        ctx.beginPath(); ctx.roundRect(px + 1.5, py + 2, pw, ph, pr); ctx.fillStyle = `rgba(0,0,0,${T.shadowAlpha + 0.1})`; ctx.fill();
        ctx.beginPath(); ctx.roundRect(px, py, pw, ph, pr); ctx.fillStyle = `rgba(${T.popupBgRgb},0.92)`; ctx.fill();
        ctx.beginPath(); ctx.roundRect(px, py, pw, ph, pr); ctx.strokeStyle = T.personDim + "0.3)"; ctx.lineWidth = 0.8; ctx.stroke();
        ctx.beginPath(); ctx.roundRect(px, py, 3, ph, [pr, 0, 0, pr]); ctx.fillStyle = T.personColor; ctx.globalAlpha = popupAlpha * 0.7; ctx.fill(); ctx.globalAlpha = popupAlpha;
        ctx.font = pf; ctx.fillStyle = `rgba(${T.textRgb},0.9)`; ctx.fillText(pn.name, px + 10, py + 16);
        ctx.font = psf; ctx.fillStyle = `rgba(${T.textRgb},0.4)`; ctx.fillText(pn.location, px + 10, py + 30);
        ctx.globalAlpha = 1;
      }

      ctx.restore();
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
}
