// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

// ---------------------------------------------------------------------------
// Flappy Konectr — 404 Mini-Game Constants & Types
// ---------------------------------------------------------------------------

// ── Types ──────────────────────────────────────────────────────────────────

export type GameState = "idle" | "playing" | "gameover";

export interface Pillar {
  x: number;
  gapY: number; // center of gap
  gap: number; // total gap height
  passed: boolean;
  hasCollectible: boolean;
  collectibleY: number;
  collectibleEmoji: string;
  collectibleCollected: boolean;
}

export interface Cloud {
  x: number;
  y: number;
  w: number;
  h: number;
  speed: number; // multiplier relative to parallax base
}

export interface Player {
  x: number;
  y: number;
  velocity: number;
  rotation: number;
}

export interface GameData {
  state: GameState;
  player: Player;
  pillars: Pillar[];
  clouds: Cloud[];
  score: number;
  highScore: number;
  groundOffset: number;
  frameCount: number;
  flashOpacity: number; // hit flash
}

// ── Design canvas ──────────────────────────────────────────────────────────

export const DESIGN_WIDTH = 400;
export const DESIGN_HEIGHT = 700;

// ── Player ─────────────────────────────────────────────────────────────────

export const PLAYER_SIZE = 36;
export const PLAYER_X = 80; // fixed horizontal position

// ── Physics ────────────────────────────────────────────────────────────────

export const GRAVITY = 0.45;
export const FLAP_FORCE = -7.5;
export const TERMINAL_VELOCITY = 10;
export const TARGET_FPS = 60;
export const FRAME_TIME = 1000 / TARGET_FPS;

// ── Pillars ────────────────────────────────────────────────────────────────

export const PILLAR_WIDTH = 52;
export const PILLAR_CAP_HEIGHT = 12;
export const PILLAR_CAP_OVERHANG = 4;
export const PILLAR_SPAWN_INTERVAL = 100; // in frames
export const PILLAR_INITIAL_GAP = 160;
export const PILLAR_MIN_GAP = 120;
export const PILLAR_GAP_SHRINK_PER_SCORE = 0.8; // px per point
export const PILLAR_MIN_TOP = 60; // min distance from top
export const PILLAR_MIN_BOTTOM = 60; // min distance from ground
export const HITBOX_SHRINK = 4; // px of forgiveness per side

// ── Scroll speed ───────────────────────────────────────────────────────────

export const INITIAL_SCROLL_SPEED = 2.5;
export const MAX_SCROLL_SPEED = 4.5;
export const SPEED_INCREASE_PER_SCORE = 0.04;
export const DIFFICULTY_CAP_SCORE = 50;

// ── Ground ─────────────────────────────────────────────────────────────────

export const GROUND_HEIGHT = 60;

// ── Collectibles ───────────────────────────────────────────────────────────

export const COLLECTIBLE_CHANCE = 0.4; // 40% of pillar pairs have one
export const COLLECTIBLE_SIZE = 24;
export const COLLECTIBLE_SCORE = 3;
export const COLLECTIBLE_EMOJIS = [
  "\u2615", // ☕
  "\uD83D\uDCAA", // 💪
  "\uD83C\uDFAF", // 🎯
  "\uD83C\uDFA8", // 🎨
  "\u26F0\uFE0F", // ⛰️
  "\uD83C\uDF89", // 🎉
  "\uD83C\uDF7D\uFE0F", // 🍽️
  "\uD83C\uDF7B", // 🍻
  "\uD83C\uDFAD", // 🎭
];

// ── Clouds / parallax ──────────────────────────────────────────────────────

export const CLOUD_COUNT = 6;
export const CLOUD_PARALLAX = 0.3;
export const SKYLINE_PARALLAX = 0.6;
export const SKYLINE_HEIGHT = 80;

// ── Idle bob ───────────────────────────────────────────────────────────────

export const BOB_AMPLITUDE = 6;
export const BOB_SPEED = 0.04;

// ── Colors ─────────────────────────────────────────────────────────────────

export interface ThemeColors {
  skyTop: string;
  skyBottom: string;
  cloudFill: string;
  cloudStroke: string;
  skylineFill: string;
  groundFill: string;
  groundLine: string;
  pillarTop: string;
  pillarBottom: string;
  pillarCapTop: string;
  pillarCapBottom: string;
  scoreText: string;
  overlayBg: string;
  overlayText: string;
  overlaySubtext: string;
  overlayCard: string;
  overlayCardBorder: string;
  buttonPrimary: string;
  buttonPrimaryText: string;
  buttonSecondary: string;
  buttonSecondaryText: string;
  buttonSecondaryBorder: string;
  flashColor: string;
  grassLight: string;
  grassDark: string;
  bushFill: string;
  bushHighlight: string;
  trunkFill: string;
}

export const COLORS_LIGHT: ThemeColors = {
  skyTop: "#FFF0E6", // warm peach
  skyBottom: "#FFD6C0",
  cloudFill: "rgba(255,255,255,0.85)",
  cloudStroke: "rgba(255,200,170,0.3)",
  skylineFill: "#E8D5C8",
  groundFill: "#D4A574",
  groundLine: "#C49060",
  pillarTop: "#FF774D", // Sunset Orange
  pillarBottom: "#FFC845", // Solar Amber
  pillarCapTop: "#E5653C",
  pillarCapBottom: "#E6B33D",
  scoreText: "#1F1F1F",
  overlayBg: "rgba(250,250,250,0.92)",
  overlayText: "#1F1F1F",
  overlaySubtext: "#666666",
  overlayCard: "#FFFFFF",
  overlayCardBorder: "rgba(0,0,0,0.08)",
  buttonPrimary: "#FF774D",
  buttonPrimaryText: "#FFFFFF",
  buttonSecondary: "transparent",
  buttonSecondaryText: "#FF774D",
  buttonSecondaryBorder: "#FF774D",
  flashColor: "rgba(255,255,255,0.6)",
  grassLight: "#7EC850",
  grassDark: "#5BA832",
  bushFill: "#4EA33A",
  bushHighlight: "#6DC252",
  trunkFill: "#8B6B4A",
};

export const COLORS_DARK: ThemeColors = {
  skyTop: "#0D1117",
  skyBottom: "#1A1F2E",
  cloudFill: "rgba(255,255,255,0.06)",
  cloudStroke: "rgba(255,255,255,0.04)",
  skylineFill: "#1E2433",
  groundFill: "#2A1F14",
  groundLine: "#3D2E1F",
  pillarTop: "#FF774D",
  pillarBottom: "#FFC845",
  pillarCapTop: "#CC5F3E",
  pillarCapBottom: "#CC9F37",
  scoreText: "#FAFAFA",
  overlayBg: "rgba(13,17,23,0.92)",
  overlayText: "#FAFAFA",
  overlaySubtext: "#999999",
  overlayCard: "#161B22",
  overlayCardBorder: "rgba(255,255,255,0.08)",
  buttonPrimary: "#FF774D",
  buttonPrimaryText: "#FFFFFF",
  buttonSecondary: "transparent",
  buttonSecondaryText: "#FF774D",
  buttonSecondaryBorder: "#FF774D",
  flashColor: "rgba(255,255,255,0.15)",
  grassLight: "#3D6B30",
  grassDark: "#2D5022",
  bushFill: "#2A4D20",
  bushHighlight: "#3A6630",
  trunkFill: "#5A4530",
};

// ── Locale detection ───────────────────────────────────────────────────────

export const SUPPORTED_LOCALES = [
  "en",
  "ms",
  "zh-HK",
  "de",
  "th",
  "ko",
  "ja",
  "vi",
] as const;
export const DEFAULT_LOCALE = "en";

// ── High score key ─────────────────────────────────────────────────────────

export const HIGH_SCORE_KEY = "flappy-konectr-high-score";
