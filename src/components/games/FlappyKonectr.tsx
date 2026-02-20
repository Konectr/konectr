// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useFlappyGame } from "./useFlappyGame";
import type { GameState } from "./flappy-constants";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "./flappy-constants";

// ── Locale detection ───────────────────────────────────────────────────────

function detectLocale(): string {
  try {
    const lang = navigator.language;
    if ((SUPPORTED_LOCALES as readonly string[]).includes(lang)) return lang;
    const base = lang.split("-")[0];
    if ((SUPPORTED_LOCALES as readonly string[]).includes(base)) return base;
    if (base === "zh") return "zh-HK";
    return DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

// ── Component ──────────────────────────────────────────────────────────────

export default function FlappyKonectr() {
  const { canvasRef, gameState: gameStateRef, flap, restart, onStateChange } = useFlappyGame();
  const containerRef = useRef<HTMLDivElement>(null);

  const [uiState, setUiState] = useState<GameState>("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [homeHref, setHomeHref] = useState("/en");

  // ── State change handler ──

  useEffect(() => {
    onStateChange.current = (state, s, hs) => {
      setUiState(state);
      setScore(s);
      setHighScore(hs);
      setIsNewHighScore(state === "gameover" && s > 0 && s >= hs);
    };
    return () => {
      onStateChange.current = null;
    };
  }, [onStateChange]);

  // ── Detect locale for home link ──

  useEffect(() => {
    setHomeHref(`/${detectLocale()}`);
  }, []);

  // ── Canvas sizing ──

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };

    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(container);

    return () => observer.disconnect();
  }, [canvasRef]);

  // ── Window-level keyboard handler (Safari doesn't reliably fire on canvas) ──

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (gameStateRef.current === "gameover") {
          restart();
        } else {
          flap();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameStateRef, flap, restart]);

  // ── Mouse/touch handler ──

  const handleInteraction = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      if (uiState === "gameover") return;
      flap();
    },
    [uiState, flap]
  );

  const handlePlayAgain = useCallback(() => {
    restart();
  }, [restart]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden bg-[#FFF0E6] dark:bg-[#0D1117]"
      style={{ touchAction: "none" }}
    >
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full outline-none"
        tabIndex={0}
        aria-label="Flappy Konectr game. Press Space or tap to flap."
        onMouseDown={handleInteraction}
        onTouchStart={handleInteraction}
      />

      {/* Score during play (a11y) */}
      {uiState === "playing" && (
        <div role="status" aria-live="polite" className="sr-only">
          Score: {score}
        </div>
      )}

      {/* Idle overlay */}
      {uiState === "idle" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
          <div className="pointer-events-auto flex flex-col items-center gap-4 px-6 text-center">
            <h1
              className="text-7xl font-black tracking-tighter"
              style={{ fontFamily: "'Satoshi', sans-serif", color: "#FF774D" }}
            >
              404
            </h1>
            <p className="text-lg font-medium text-[#1F1F1F] dark:text-[#FAFAFA] opacity-70">
              Page not found
            </p>

            <div className="mt-4 flex flex-col items-center gap-2">
              <button
                onClick={() => flap()}
                className="px-8 py-3 rounded-full text-white font-bold text-base transition-transform active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #FF774D 0%, #ff5722 100%)",
                  fontFamily: "'Satoshi', sans-serif",
                  boxShadow: "0 4px 14px rgba(255,119,77,0.4)",
                }}
              >
                Tap to Fly
              </button>
              <p className="text-xs text-[#1F1F1F] dark:text-[#FAFAFA] opacity-40 mt-1">
                or press Space / Enter
              </p>
            </div>

            {highScore > 0 && (
              <p className="text-sm font-medium text-[#1F1F1F] dark:text-[#FAFAFA] opacity-50 mt-2">
                Best: {highScore}
              </p>
            )}

            <a
              href={homeHref}
              className="mt-6 text-sm font-medium underline underline-offset-4 transition-colors text-[#FF774D] hover:text-[#ff5722]"
            >
              Go back home
            </a>
          </div>
        </div>
      )}

      {/* Game Over overlay */}
      {uiState === "gameover" && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="absolute inset-0 bg-[rgba(250,250,250,0.5)] dark:bg-[rgba(13,17,23,0.5)] backdrop-blur-sm" />

          <div
            className="relative z-20 flex flex-col items-center gap-4 px-8 py-8 rounded-2xl shadow-xl mx-6 max-w-[320px] w-full border"
            style={{
              backgroundColor: "var(--gameover-card-bg, #FFFFFF)",
              borderColor: "var(--gameover-card-border, rgba(0,0,0,0.08))",
            }}
          >
            <style>{`
              :root {
                --gameover-card-bg: #FFFFFF;
                --gameover-card-border: rgba(0,0,0,0.08);
              }
              .dark {
                --gameover-card-bg: #161B22;
                --gameover-card-border: rgba(255,255,255,0.08);
              }
            `}</style>

            <h2
              className="text-2xl font-black text-[#1F1F1F] dark:text-[#FAFAFA]"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            >
              Game Over
            </h2>

            {isNewHighScore && (
              <p
                className="text-sm font-bold px-3 py-1 rounded-full"
                style={{
                  background: "linear-gradient(135deg, #FFC845 0%, #fbbf24 100%)",
                  color: "#1F1F1F",
                }}
              >
                New High Score!
              </p>
            )}

            <div className="flex gap-8 mt-2">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black text-[#FF774D]">{score}</span>
                <span className="text-xs text-[#1F1F1F] dark:text-[#FAFAFA] opacity-50 mt-1">
                  Score
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black text-[#1F1F1F] dark:text-[#FAFAFA]">
                  {highScore}
                </span>
                <span className="text-xs text-[#1F1F1F] dark:text-[#FAFAFA] opacity-50 mt-1">
                  Best
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full mt-4">
              <button
                onClick={handlePlayAgain}
                className="w-full py-3 rounded-full text-white font-bold text-base transition-transform active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #FF774D 0%, #ff5722 100%)",
                  fontFamily: "'Satoshi', sans-serif",
                  boxShadow: "0 4px 14px rgba(255,119,77,0.4)",
                }}
              >
                Play Again
              </button>
              <a
                href={homeHref}
                className="w-full py-3 rounded-full text-center font-bold text-base border-2 transition-colors"
                style={{
                  color: "#FF774D",
                  borderColor: "#FF774D",
                  fontFamily: "'Satoshi', sans-serif",
                }}
              >
                Go Home
              </a>
            </div>

            <p className="text-[10px] text-[#1F1F1F] dark:text-[#FAFAFA] opacity-30 mt-1">
              Press Space to play again
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
