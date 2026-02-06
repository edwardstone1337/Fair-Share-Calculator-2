"use client";

import { useEffect, useRef, useState } from "react";

export interface SnackbarProps {
  message: string;
  visible: boolean;
  onHide: () => void;
  duration?: number;
  /** Use "error" for error feedback (red background) */
  variant?: "default" | "error";
}

const DEFAULT_DURATION = 3000;
const ANIMATION_MS = 500;

export function Snackbar({
  message,
  visible,
  onHide,
  duration = DEFAULT_DURATION,
  variant = "default",
}: SnackbarProps) {
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onHideRef = useRef(onHide);
  useEffect(() => {
    onHideRef.current = onHide;
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
  }, []);

  useEffect(() => {
    if (!visible) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      setIsAnimatingIn(false);
      setIsAnimatingOut(false);
      return;
    }

    if (prefersReducedMotion) {
      timeoutRef.current = setTimeout(() => {
        onHideRef.current();
        timeoutRef.current = null;
      }, duration);
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }

    setIsAnimatingOut(false);
    setIsAnimatingIn(true);

    timeoutRef.current = setTimeout(() => {
      setIsAnimatingIn(false);
      setIsAnimatingOut(true);
      timeoutRef.current = null;

      hideTimeoutRef.current = setTimeout(() => {
        onHideRef.current();
        hideTimeoutRef.current = null;
      }, ANIMATION_MS);
    }, duration);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [visible, duration, prefersReducedMotion]);

  if (!visible && !isAnimatingOut) return null;

  const show = prefersReducedMotion ? visible : visible && (isAnimatingIn || isAnimatingOut);

  const style: React.CSSProperties = {
    position: "fixed",
    bottom: "30px",
    left: "50%",
    transform: "translateX(-50%)",
    background:
      variant === "error" ? "var(--snackbar-error-bg)" : "var(--snackbar-bg)",
    color: "var(--snackbar-text)",
    borderRadius: "var(--snackbar-radius)",
    padding: "var(--snackbar-padding)",
    minWidth: "var(--snackbar-min-width)",
    zIndex: 10,
    fontFamily: "var(--font-family-body)",
    fontSize: "var(--font-size-md)",
    boxShadow: "var(--shadow-md)",
    ...(prefersReducedMotion
      ? { opacity: show ? 1 : 0, visibility: show ? "visible" : "hidden" }
      : {
          opacity: isAnimatingOut ? 0 : 1,
          bottom: isAnimatingIn ? "30px" : "0",
          transition: `opacity ${ANIMATION_MS}ms ease, bottom ${ANIMATION_MS}ms ease`,
        }),
  };

  return (
    <div
      role="status"
      aria-live="polite"
      style={style}
    >
      {message}
    </div>
  );
}
