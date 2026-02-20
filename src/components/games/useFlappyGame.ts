// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

"use client";

import { useRef, useCallback, useEffect } from "react";
import {
  type GameState,
  type GameData,
  type Pillar,
  type Cloud,
  type ThemeColors,
  DESIGN_WIDTH,
  DESIGN_HEIGHT,
  PLAYER_SIZE,
  PLAYER_X,
  GRAVITY,
  FLAP_FORCE,
  TERMINAL_VELOCITY,
  FRAME_TIME,
  PILLAR_WIDTH,
  PILLAR_CAP_HEIGHT,
  PILLAR_CAP_OVERHANG,
  PILLAR_SPAWN_INTERVAL,
  PILLAR_INITIAL_GAP,
  PILLAR_MIN_GAP,
  PILLAR_GAP_SHRINK_PER_SCORE,
  PILLAR_MIN_TOP,
  PILLAR_MIN_BOTTOM,
  HITBOX_SHRINK,
  INITIAL_SCROLL_SPEED,
  MAX_SCROLL_SPEED,
  SPEED_INCREASE_PER_SCORE,
  DIFFICULTY_CAP_SCORE,
  GROUND_HEIGHT,
  COLLECTIBLE_CHANCE,
  COLLECTIBLE_SIZE,
  COLLECTIBLE_SCORE,
  COLLECTIBLE_EMOJIS,
  CLOUD_COUNT,
  CLOUD_PARALLAX,
  SKYLINE_PARALLAX,
  SKYLINE_HEIGHT,
  BOB_AMPLITUDE,
  BOB_SPEED,
  COLORS_LIGHT,
  COLORS_DARK,
  HIGH_SCORE_KEY,
} from "./flappy-constants";

// ── Helpers ────────────────────────────────────────────────────────────────

function loadHighScore(): number {
  try {
    const val = localStorage.getItem(HIGH_SCORE_KEY);
    return val ? parseInt(val, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

function saveHighScore(score: number) {
  try {
    localStorage.setItem(HIGH_SCORE_KEY, String(score));
  } catch {
    // private browsing — ignore
  }
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function getScrollSpeed(score: number): number {
  const capped = Math.min(score, DIFFICULTY_CAP_SCORE);
  return Math.min(
    INITIAL_SCROLL_SPEED + capped * SPEED_INCREASE_PER_SCORE,
    MAX_SCROLL_SPEED
  );
}

function getGap(score: number): number {
  const capped = Math.min(score, DIFFICULTY_CAP_SCORE);
  return Math.max(
    PILLAR_INITIAL_GAP - capped * PILLAR_GAP_SHRINK_PER_SCORE,
    PILLAR_MIN_GAP
  );
}

function initCloud(dw: number): Cloud {
  return {
    x: randomBetween(0, dw),
    y: randomBetween(20, DESIGN_HEIGHT * 0.4),
    w: randomBetween(50, 120),
    h: randomBetween(18, 36),
    speed: randomBetween(0.7, 1.3),
  };
}

function recycleCloud(dw: number): Cloud {
  return {
    x: dw + randomBetween(20, 200),
    y: randomBetween(20, DESIGN_HEIGHT * 0.4),
    w: randomBetween(50, 120),
    h: randomBetween(18, 36),
    speed: randomBetween(0.7, 1.3),
  };
}

function spawnPillar(x: number, score: number): Pillar {
  const gap = getGap(score);
  const playableTop = PILLAR_MIN_TOP + gap / 2;
  const playableBottom = DESIGN_HEIGHT - GROUND_HEIGHT - PILLAR_MIN_BOTTOM - gap / 2;
  const gapY = randomBetween(playableTop, playableBottom);

  const hasCollectible = Math.random() < COLLECTIBLE_CHANCE;
  const emoji =
    COLLECTIBLE_EMOJIS[Math.floor(Math.random() * COLLECTIBLE_EMOJIS.length)];

  return {
    x,
    gapY,
    gap,
    passed: false,
    hasCollectible,
    collectibleY: gapY + randomBetween(-gap * 0.25, gap * 0.25),
    collectibleEmoji: emoji,
    collectibleCollected: false,
  };
}

// ── Rendering helpers ──────────────────────────────────────────────────────

function drawSky(ctx: CanvasRenderingContext2D, dw: number, colors: ThemeColors) {
  const gradient = ctx.createLinearGradient(0, 0, 0, DESIGN_HEIGHT);
  gradient.addColorStop(0, colors.skyTop);
  gradient.addColorStop(1, colors.skyBottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, dw, DESIGN_HEIGHT);
}

function drawClouds(
  ctx: CanvasRenderingContext2D,
  clouds: Cloud[],
  colors: ThemeColors,
  reducedMotion: boolean
) {
  ctx.save();
  for (const c of clouds) {
    ctx.fillStyle = colors.cloudFill;
    ctx.beginPath();
    const cx = c.x + c.w / 2;
    const cy = c.y + c.h / 2;
    ctx.ellipse(cx, cy, c.w / 2, c.h / 2, 0, 0, Math.PI * 2);
    ctx.ellipse(cx - c.w * 0.2, cy - c.h * 0.3, c.w * 0.3, c.h * 0.4, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + c.w * 0.15, cy - c.h * 0.2, c.w * 0.25, c.h * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();
    if (!reducedMotion) {
      ctx.strokeStyle = colors.cloudStroke;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawSkyline(
  ctx: CanvasRenderingContext2D,
  dw: number,
  offset: number,
  colors: ThemeColors
) {
  const y = DESIGN_HEIGHT - GROUND_HEIGHT - SKYLINE_HEIGHT;
  ctx.fillStyle = colors.skylineFill;
  ctx.beginPath();
  ctx.moveTo(0, DESIGN_HEIGHT - GROUND_HEIGHT);

  for (let x = 0; x <= dw; x += 2) {
    const h1 = Math.sin((x + offset * 0.3) * 0.02) * 20 + 30;
    const h2 = Math.sin((x + offset * 0.3) * 0.05) * 10 + 15;
    const h3 = Math.sin((x + offset * 0.3) * 0.013) * 15 + 20;
    const buildingH = h1 + h2 + h3;
    ctx.lineTo(x, y + SKYLINE_HEIGHT - buildingH);
  }
  ctx.lineTo(dw, DESIGN_HEIGHT - GROUND_HEIGHT);
  ctx.closePath();
  ctx.fill();
}

function drawPillar(
  ctx: CanvasRenderingContext2D,
  pillar: Pillar,
  colors: ThemeColors
) {
  const topEnd = pillar.gapY - pillar.gap / 2;
  const bottomStart = pillar.gapY + pillar.gap / 2;
  const x = pillar.x;
  const w = PILLAR_WIDTH;
  const capW = w + PILLAR_CAP_OVERHANG * 2;
  const capX = x - PILLAR_CAP_OVERHANG;

  // Top pillar body
  ctx.fillStyle = colors.pillarTop;
  ctx.fillRect(x, 0, w, topEnd - PILLAR_CAP_HEIGHT);

  // Top pillar cap
  ctx.fillStyle = colors.pillarCapTop;
  drawRoundedRect(ctx, capX, topEnd - PILLAR_CAP_HEIGHT, capW, PILLAR_CAP_HEIGHT, 4);
  ctx.fill();

  // Bottom pillar body
  ctx.fillStyle = colors.pillarBottom;
  ctx.fillRect(x, bottomStart + PILLAR_CAP_HEIGHT, w, DESIGN_HEIGHT - GROUND_HEIGHT - bottomStart - PILLAR_CAP_HEIGHT);

  // Bottom pillar cap
  ctx.fillStyle = colors.pillarCapBottom;
  drawRoundedRect(ctx, capX, bottomStart, capW, PILLAR_CAP_HEIGHT, 4);
  ctx.fill();
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function drawCollectibles(
  ctx: CanvasRenderingContext2D,
  pillars: Pillar[],
  frameCount: number,
  reducedMotion: boolean
) {
  ctx.save();
  ctx.font = `${COLLECTIBLE_SIZE}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (const p of pillars) {
    if (!p.hasCollectible || p.collectibleCollected) continue;
    const cx = p.x + PILLAR_WIDTH / 2;
    const cy = p.collectibleY;

    ctx.save();
    ctx.translate(cx, cy);
    if (!reducedMotion) {
      const bob = Math.sin(frameCount * 0.05) * 3;
      ctx.translate(0, bob);
    }
    ctx.fillText(p.collectibleEmoji, 0, 0);
    ctx.restore();
  }
  ctx.restore();
}

function drawGround(
  ctx: CanvasRenderingContext2D,
  dw: number,
  offset: number,
  colors: ThemeColors
) {
  const y = DESIGN_HEIGHT - GROUND_HEIGHT;

  ctx.fillStyle = colors.groundFill;
  ctx.fillRect(0, y, dw, GROUND_HEIGHT);

  ctx.strokeStyle = colors.groundLine;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(dw, y);
  ctx.stroke();

  ctx.strokeStyle = colors.groundLine;
  ctx.lineWidth = 1;
  const dashSpacing = 20;
  const dashW = 8;
  const dashY = y + GROUND_HEIGHT * 0.5;
  const o = offset % dashSpacing;
  for (let x = -o; x < dw + dashSpacing; x += dashSpacing) {
    ctx.beginPath();
    ctx.moveTo(x, dashY);
    ctx.lineTo(x + dashW, dashY);
    ctx.stroke();
  }
}

// ── Greenery layer (grass, bushes, small trees on ground) ───────────────────

function drawGreenery(
  ctx: CanvasRenderingContext2D,
  dw: number,
  offset: number,
  colors: ThemeColors
) {
  const groundY = DESIGN_HEIGHT - GROUND_HEIGHT;
  ctx.save();

  // Grass strip along ground top
  const grassH = 10;
  const grad = ctx.createLinearGradient(0, groundY - grassH, 0, groundY);
  grad.addColorStop(0, colors.grassLight);
  grad.addColorStop(1, colors.grassDark);
  ctx.fillStyle = grad;
  ctx.fillRect(0, groundY - grassH, dw, grassH);

  // Procedural grass tufts + bushes (seeded by position for consistency)
  const spacing = 35;
  const o = offset % spacing;
  for (let x = -o - spacing; x < dw + spacing * 2; x += spacing) {
    // Use position-based seed for deterministic variety
    const seed = Math.abs(Math.floor((x + offset) / spacing)) * 7919;
    const kind = seed % 5; // 0-1 = grass tuft, 2-3 = bush, 4 = small tree

    if (kind <= 1) {
      // Grass tuft — small triangular blades
      ctx.fillStyle = (seed % 2 === 0) ? colors.grassLight : colors.grassDark;
      const baseX = x + (seed % 11) - 5;
      const h = 6 + (seed % 7);
      ctx.beginPath();
      ctx.moveTo(baseX - 3, groundY - grassH + 2);
      ctx.lineTo(baseX, groundY - grassH - h);
      ctx.lineTo(baseX + 3, groundY - grassH + 2);
      ctx.fill();
      // Second blade
      ctx.beginPath();
      ctx.moveTo(baseX + 4, groundY - grassH + 2);
      ctx.lineTo(baseX + 6, groundY - grassH - h * 0.7);
      ctx.lineTo(baseX + 9, groundY - grassH + 2);
      ctx.fill();
    } else if (kind <= 3) {
      // Bush — rounded ellipse
      const bx = x + (seed % 9) - 4;
      const bw = 10 + (seed % 8);
      const bh = 7 + (seed % 5);
      ctx.fillStyle = colors.bushFill;
      ctx.beginPath();
      ctx.ellipse(bx, groundY - grassH - bh * 0.4, bw / 2, bh / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      // Highlight bump
      ctx.fillStyle = colors.bushHighlight;
      ctx.beginPath();
      ctx.ellipse(bx - bw * 0.15, groundY - grassH - bh * 0.55, bw * 0.3, bh * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Small tree — trunk + round canopy
      const tx = x + (seed % 7) - 3;
      const trunkH = 14 + (seed % 8);
      const canopyR = 8 + (seed % 5);

      // Trunk
      ctx.fillStyle = colors.trunkFill;
      ctx.fillRect(tx - 2, groundY - grassH - trunkH, 4, trunkH);

      // Canopy
      ctx.fillStyle = colors.bushFill;
      ctx.beginPath();
      ctx.arc(tx, groundY - grassH - trunkH - canopyR * 0.6, canopyR, 0, Math.PI * 2);
      ctx.fill();

      // Highlight
      ctx.fillStyle = colors.bushHighlight;
      ctx.beginPath();
      ctx.arc(tx - canopyR * 0.25, groundY - grassH - trunkH - canopyR * 0.8, canopyR * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

// ── Stick-figure player (Konectr mascot — thick rounded strokes, ring head) ──

function drawPlayer(
  ctx: CanvasRenderingContext2D,
  player: { x: number; y: number; rotation: number }
) {
  ctx.save();
  ctx.translate(player.x + PLAYER_SIZE / 2, player.y + PLAYER_SIZE / 2);
  ctx.rotate(player.rotation);

  const color = "#FF774D";
  ctx.strokeStyle = color;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Head — ring/donut shape (thick outlined circle, cream center)
  ctx.fillStyle = "#FFF5EE";
  ctx.beginPath();
  ctx.arc(0, -9, 6.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.arc(0, -9, 6.5, 0, Math.PI * 2);
  ctx.stroke();

  // Body — short, slightly curved torso
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, -2);
  ctx.quadraticCurveTo(1, 3, 0, 7);
  ctx.stroke();

  // Left arm — sweeping up-left (joyful flying pose)
  ctx.lineWidth = 3.8;
  ctx.beginPath();
  ctx.moveTo(-1, 0);
  ctx.quadraticCurveTo(-7, -4, -13, -7);
  ctx.stroke();

  // Right arm — sweeping up-right
  ctx.beginPath();
  ctx.moveTo(1, 0);
  ctx.quadraticCurveTo(7, -4, 13, -7);
  ctx.stroke();

  // Left leg — trailing down-left
  ctx.lineWidth = 3.8;
  ctx.beginPath();
  ctx.moveTo(-1, 7);
  ctx.quadraticCurveTo(-4, 11, -8, 16);
  ctx.stroke();

  // Right leg — trailing down-right
  ctx.beginPath();
  ctx.moveTo(1, 7);
  ctx.quadraticCurveTo(3, 12, 6, 17);
  ctx.stroke();

  ctx.restore();
}

function drawScore(
  ctx: CanvasRenderingContext2D,
  dw: number,
  score: number,
  colors: ThemeColors
) {
  ctx.save();
  ctx.font = "bold 32px 'Satoshi', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillText(String(score), dw / 2 + 1, 21);

  ctx.fillStyle = colors.scoreText;
  ctx.fillText(String(score), dw / 2, 20);
  ctx.restore();
}

function drawFlash(
  ctx: CanvasRenderingContext2D,
  dw: number,
  opacity: number,
  colors: ThemeColors
) {
  if (opacity <= 0) return;
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.fillStyle = colors.flashColor;
  ctx.fillRect(0, 0, dw, DESIGN_HEIGHT);
  ctx.restore();
}

// ── Collision detection ────────────────────────────────────────────────────

function checkCollision(
  player: { x: number; y: number },
  pillars: Pillar[]
): boolean {
  const px = player.x + HITBOX_SHRINK;
  const py = player.y + HITBOX_SHRINK;
  const pw = PLAYER_SIZE - HITBOX_SHRINK * 2;
  const ph = PLAYER_SIZE - HITBOX_SHRINK * 2;

  if (py + ph >= DESIGN_HEIGHT - GROUND_HEIGHT || py <= 0) {
    return true;
  }

  for (const pillar of pillars) {
    const topEnd = pillar.gapY - pillar.gap / 2;
    const bottomStart = pillar.gapY + pillar.gap / 2;

    if (px + pw > pillar.x && px < pillar.x + PILLAR_WIDTH) {
      if (py < topEnd || py + ph > bottomStart) {
        return true;
      }
    }
  }

  return false;
}

function checkCollectiblePickup(
  player: { x: number; y: number },
  pillars: Pillar[]
): number {
  let bonus = 0;
  const pcx = player.x + PLAYER_SIZE / 2;
  const pcy = player.y + PLAYER_SIZE / 2;

  for (const p of pillars) {
    if (!p.hasCollectible || p.collectibleCollected) continue;
    const cx = p.x + PILLAR_WIDTH / 2;
    const cy = p.collectibleY;
    const dist = Math.hypot(pcx - cx, pcy - cy);
    if (dist < (PLAYER_SIZE + COLLECTIBLE_SIZE) / 2) {
      p.collectibleCollected = true;
      bonus += COLLECTIBLE_SCORE;
    }
  }
  return bonus;
}

// ── Hook ───────────────────────────────────────────────────────────────────

export interface FlappyGameAPI {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  gameState: React.RefObject<GameState>;
  score: React.RefObject<number>;
  highScore: React.RefObject<number>;
  flap: () => void;
  restart: () => void;
  onStateChange: React.RefObject<((state: GameState, score: number, highScore: number) => void) | null>;
}

export function useFlappyGame(): FlappyGameAPI {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const darkRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const stateChangeRef = useRef<((state: GameState, score: number, highScore: number) => void) | null>(null);

  const gameRef = useRef<GameData>({
    state: "idle",
    player: { x: PLAYER_X, y: DESIGN_HEIGHT / 2 - PLAYER_SIZE / 2, velocity: 0, rotation: 0 },
    pillars: [],
    clouds: [],
    score: 0,
    highScore: 0,
    groundOffset: 0,
    frameCount: 0,
    flashOpacity: 0,
  });

  const gameStateRef = useRef<GameState>("idle");
  const scoreRef = useRef(0);
  const highScoreRef = useRef(0);

  const emitStateChange = useCallback((state: GameState, score: number, hs: number) => {
    gameStateRef.current = state;
    scoreRef.current = score;
    highScoreRef.current = hs;
    stateChangeRef.current?.(state, score, hs);
  }, []);

  // ── Compute dynamic design width from canvas aspect ratio ──
  // Height is always DESIGN_HEIGHT (700). Width stretches to fill viewport.

  function getDesignWidth(canvas: HTMLCanvasElement): number {
    if (canvas.height === 0) return DESIGN_WIDTH;
    return (canvas.width / canvas.height) * DESIGN_HEIGHT;
  }

  // ── Init ──

  const initGame = useCallback(() => {
    const g = gameRef.current;
    g.state = "idle";
    g.player = {
      x: PLAYER_X,
      y: DESIGN_HEIGHT / 2 - PLAYER_SIZE / 2,
      velocity: 0,
      rotation: 0,
    };
    g.pillars = [];
    g.score = 0;
    g.highScore = loadHighScore();
    g.groundOffset = 0;
    g.frameCount = 0;
    g.flashOpacity = 0;

    // Init clouds — use canvas width if available, else default
    const canvas = canvasRef.current;
    const dw = canvas ? getDesignWidth(canvas) : DESIGN_WIDTH;
    g.clouds = [];
    for (let i = 0; i < CLOUD_COUNT; i++) {
      g.clouds.push(initCloud(dw));
    }

    emitStateChange("idle", 0, g.highScore);
  }, [emitStateChange]);

  // ── Flap ──

  const flap = useCallback(() => {
    const g = gameRef.current;
    if (g.state === "idle") {
      g.state = "playing";
      g.player.velocity = FLAP_FORCE;
      g.frameCount = 0;
      // Pre-spawn first pillar ~1.5s ahead of player so action starts quickly
      const firstX = PLAYER_X + 220;
      g.pillars = [spawnPillar(firstX, 0)];
      emitStateChange("playing", g.score, g.highScore);
    } else if (g.state === "playing") {
      g.player.velocity = FLAP_FORCE;
    }
  }, [emitStateChange]);

  // ── Restart ──

  const restart = useCallback(() => {
    initGame();
  }, [initGame]);

  // ── Game loop ──

  const tick = useCallback(
    (timestamp: number) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      // Delta-time
      if (lastTimeRef.current === 0) lastTimeRef.current = timestamp;
      const rawDelta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;
      const dt = Math.min(rawDelta / FRAME_TIME, 3);

      const g = gameRef.current;
      const colors: ThemeColors = darkRef.current ? COLORS_DARK : COLORS_LIGHT;
      const reducedMotion = reducedMotionRef.current;

      // Dynamic design width — fills entire viewport
      const dw = getDesignWidth(canvas);

      // --- Update ---

      g.frameCount++;

      if (g.state === "playing") {
        const speed = getScrollSpeed(g.score);

        // Gravity & movement
        g.player.velocity = Math.min(g.player.velocity + GRAVITY * dt, TERMINAL_VELOCITY);
        g.player.y += g.player.velocity * dt;

        // Rotation based on velocity
        const targetRot = Math.max(-0.4, Math.min(g.player.velocity * 0.06, 1.2));
        g.player.rotation += (targetRot - g.player.rotation) * 0.15 * dt;

        // Move pillars
        for (const p of g.pillars) {
          p.x -= speed * dt;
        }

        // Cull off-screen pillars
        g.pillars = g.pillars.filter((p) => p.x + PILLAR_WIDTH > -10);

        // Spawn new pillars
        const lastPillar = g.pillars[g.pillars.length - 1];
        const spawnX = dw + 20;
        if (!lastPillar || lastPillar.x < dw - PILLAR_SPAWN_INTERVAL * (speed / INITIAL_SCROLL_SPEED)) {
          g.pillars.push(spawnPillar(spawnX, g.score));
        }

        // Score: pillar passed
        for (const p of g.pillars) {
          if (!p.passed && p.x + PILLAR_WIDTH < g.player.x) {
            p.passed = true;
            g.score++;
          }
        }

        // Collectible pickup
        const bonus = checkCollectiblePickup(g.player, g.pillars);
        if (bonus > 0) {
          g.score += bonus;
        }

        // Ground offset for scrolling effect
        g.groundOffset += speed * dt;

        // Collision
        if (checkCollision(g.player, g.pillars)) {
          g.state = "gameover";
          g.flashOpacity = 1;
          if (g.score > g.highScore) {
            g.highScore = g.score;
            saveHighScore(g.score);
          }
          emitStateChange("gameover", g.score, g.highScore);
        }
      } else if (g.state === "idle") {
        // Idle bobbing
        if (!reducedMotion) {
          g.player.y =
            DESIGN_HEIGHT / 2 -
            PLAYER_SIZE / 2 +
            Math.sin(g.frameCount * BOB_SPEED) * BOB_AMPLITUDE;
        }
      }

      // Move clouds
      if (!reducedMotion) {
        const cloudSpeed =
          g.state === "playing"
            ? getScrollSpeed(g.score) * CLOUD_PARALLAX
            : 0.3;
        for (const c of g.clouds) {
          c.x -= cloudSpeed * c.speed * dt;
          if (c.x + c.w < -20) {
            Object.assign(c, recycleCloud(dw));
          }
        }
      }

      // Flash decay
      if (g.flashOpacity > 0) {
        g.flashOpacity = Math.max(0, g.flashOpacity - 0.03 * dt);
      }

      // --- Render ---

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Scale: height-based uniform scale, fills entire viewport
      const scale = canvas.height / DESIGN_HEIGHT;
      ctx.scale(scale, scale);

      // Clip to design area
      ctx.beginPath();
      ctx.rect(0, 0, dw, DESIGN_HEIGHT);
      ctx.clip();

      // 1. Sky
      drawSky(ctx, dw, colors);

      // 2. Clouds
      drawClouds(ctx, g.clouds, colors, reducedMotion);

      // 3. Skyline
      drawSkyline(ctx, dw, g.groundOffset * SKYLINE_PARALLAX, colors);

      // 4. Greenery (grass, bushes, trees along ground)
      drawGreenery(ctx, dw, g.groundOffset, colors);

      // 5. Pillars
      for (const p of g.pillars) {
        drawPillar(ctx, p, colors);
      }

      // 6. Collectibles
      drawCollectibles(ctx, g.pillars, g.frameCount, reducedMotion);

      // 7. Ground
      drawGround(ctx, dw, g.groundOffset, colors);

      // 8. Player
      drawPlayer(ctx, g.player);

      // 9. Score (only during play)
      if (g.state === "playing") {
        drawScore(ctx, dw, g.score, colors);
      }

      // 10. Flash
      drawFlash(ctx, dw, g.flashOpacity, colors);

      ctx.restore();

      rafRef.current = requestAnimationFrame(tick);
    },
    [emitStateChange]
  );

  // ── Lifecycle ──

  useEffect(() => {
    // Detect dark mode
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    darkRef.current = mq.matches || document.documentElement.classList.contains("dark");
    const onMqChange = (e: MediaQueryListEvent) => {
      darkRef.current = e.matches;
    };
    mq.addEventListener("change", onMqChange);

    // Observe html class for theme toggling
    const observer = new MutationObserver(() => {
      const html = document.documentElement;
      if (html.classList.contains("dark")) {
        darkRef.current = true;
      } else if (html.classList.contains("light")) {
        darkRef.current = false;
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Reduced motion
    const rmq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = rmq.matches;
    const onRmqChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
    };
    rmq.addEventListener("change", onRmqChange);

    // Init and start loop
    initGame();
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      mq.removeEventListener("change", onMqChange);
      rmq.removeEventListener("change", onRmqChange);
      observer.disconnect();
    };
  }, [initGame, tick]);

  return {
    canvasRef,
    gameState: gameStateRef,
    score: scoreRef,
    highScore: highScoreRef,
    flap,
    restart,
    onStateChange: stateChangeRef,
  };
}
