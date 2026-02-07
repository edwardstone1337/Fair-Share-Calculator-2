"use client";

import { useEffect, useState } from "react";

const DEFAULT_THRESHOLD = 400;

const CHEVRON_UP_SVG = (
  <svg
    style={{ width: "var(--font-size-xl)", height: "var(--font-size-xl)" }}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M18 15l-6-6-6 6" />
  </svg>
);

export interface BackToTopButtonProps {
  threshold?: number;
}

export function BackToTopButton({ threshold = DEFAULT_THRESHOLD }: BackToTopButtonProps) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      setVisible(window.scrollY > threshold);
    };
    window.addEventListener("scroll", checkScroll, { passive: true });
    checkScroll();
    return () => window.removeEventListener("scroll", checkScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const background = pressed
    ? "var(--button-bg-pressed)"
    : hovered
      ? "var(--button-bg-hover)"
      : "var(--button-bg-default)";
  const shadow = hovered && !pressed ? "var(--shadow-lg)" : "var(--shadow-md)";

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={scrollToTop}
      className="focus:outline-none focus-visible:[outline:var(--focus-ring-width)_solid_var(--focus-ring-color)] focus-visible:[outline-offset:var(--focus-ring-offset)]"
      style={{
        position: "fixed",
        bottom: "var(--space-6)",
        right: "var(--space-6)",
        zIndex: 40,
        width: "var(--touch-target-min-height)",
        height: "var(--touch-target-min-height)",
        borderRadius: "var(--radius-full)",
        border: "none",
        background,
        color: "var(--button-text)",
        boxShadow: shadow,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(var(--space-2))",
        pointerEvents: visible ? "auto" : "none",
        transition:
          "opacity 300ms ease, transform 300ms ease, background-color 300ms ease, box-shadow 300ms ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
    >
      {CHEVRON_UP_SVG}
    </button>
  );
}
