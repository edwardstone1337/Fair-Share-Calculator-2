"use client";

import { Button } from "@/components/ui/button";

const BUY_ME_A_COFFEE_URL =
  "https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=edthedesigner&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff";

export interface ResultsFooterProps {
  onBackToEdit: () => void;
  onShare: () => void;
}

export function ResultsFooter({ onBackToEdit, onShare }: ResultsFooterProps) {
  return (
    <footer
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Button variant="secondary" fullWidth onClick={onBackToEdit}>
        ← Edit details
      </Button>
      <Button variant="primary" fullWidth onClick={onShare}>
        Share Results
      </Button>
      <a
        href="https://www.buymeacoffee.com/edthedesigner"
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: "block" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={BUY_ME_A_COFFEE_URL}
          alt="Buy me a coffee"
          style={{ border: "none", maxWidth: "100%" }}
        />
      </a>
    </footer>
  );
}
