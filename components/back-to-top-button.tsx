"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const SCROLL_THRESHOLD = 100;

export function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      setVisible(window.scrollY > SCROLL_THRESHOLD);
    };
    window.addEventListener("scroll", checkScroll, { passive: true });
    checkScroll();
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <div style={{ marginTop: "var(--space-6)", width: "100%" }}>
      <Button
        variant="primary"
        fullWidth
        onClick={scrollToTop}
        type="button"
      >
        ↑ Back to Top
      </Button>
    </div>
  );
}
