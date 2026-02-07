"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { trackEvent } from "@/lib/analytics/gtag";

const BUY_ME_A_COFFEE_URL =
  "https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=edthedesigner&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff";

export type SaveState = "idle" | "saving" | "saved" | "error";

export interface ResultsFooterProps {
  onBackToEdit: () => void;
  onSave?: () => void;
  saveState?: SaveState;
}

export function ResultsFooter({
  onBackToEdit,
  onSave,
  saveState,
}: ResultsFooterProps) {
  const handleBackToEdit = () => {
    trackEvent("back_to_edit_clicked");
    onBackToEdit();
  };

  const saveButtonLabel =
    saveState === "saving"
      ? "Saving…"
      : saveState === "saved"
        ? "Saved"
        : "Save Configuration";

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
      <Button variant="secondary" fullWidth onClick={handleBackToEdit}>
        ← Edit details
      </Button>
      {onSave !== undefined && (
        <Button
          variant="secondary"
          fullWidth
          onClick={onSave}
          disabled={saveState === "saving" || saveState === "saved"}
        >
          {saveState === "saved" ? (
            <>
              <Icon
                name="check"
                size="var(--text-base)"
                style={{ marginRight: "var(--space-2)" }}
              />
              {saveButtonLabel}
            </>
          ) : (
            saveButtonLabel
          )}
        </Button>
      )}
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
