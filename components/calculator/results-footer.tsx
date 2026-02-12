"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { trackEvent } from "@/lib/analytics/gtag";
import { FEEDBACK_CLICKED } from "@/lib/analytics/events";

const BUY_ME_A_COFFEE_URL =
  "https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=edthedesigner&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff";

const FEEDBACK_SURVEY_URL =
  "https://surveys.hotjar.com/75994e9b-1ee0-4dae-a644-0609ee4c4ecf";

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

  const handleFeedback = () => {
    trackEvent(FEEDBACK_CLICKED);
    window.open(FEEDBACK_SURVEY_URL, "_blank", "noopener,noreferrer");
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
      <div
        style={{
          backgroundColor: "var(--surface-card)",
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-card)",
          padding: "var(--space-6)",
          textAlign: "left",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "var(--space-4)",
        }}
      >
        <header
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "var(--space-3)",
            width: "100%",
            alignSelf: "flex-start",
            textAlign: "left",
          }}
        >
          <span
            style={{
              fontSize: "var(--breakdown-icon-size)",
              lineHeight: 1,
            }}
            aria-hidden="true"
          >
            ❤️
          </span>
          <h2
            style={{
              fontSize: "var(--breakdown-title-size)",
              fontWeight: "var(--breakdown-title-weight)",
              fontFamily: "var(--breakdown-title-family)",
              color: "var(--text-primary)",
              textAlign: "left",
            }}
          >
            Enjoying Fair Share?
          </h2>
        </header>
        <p
          style={{
            fontSize: "var(--faq-p-size, 1rem)",
            color: "var(--text-secondary)",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          If you find it handy and want to help keep it online, consider buying
          us a coffee ☕. Every bit helps keep this site up and running. Thank
          you, we will split it fairly!
        </p>
        <p
          style={{
            fontSize: "var(--faq-p-size, 1rem)",
            color: "var(--text-secondary)",
            margin: 0,
          }}
        >
          Edward & Sarah 🫶
        </p>
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
      </div>
      <Button variant="secondary" fullWidth onClick={handleBackToEdit}>
        ← Edit details
      </Button>
      <Button variant="secondary" fullWidth onClick={handleFeedback}>
        Give us feedback
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
    </footer>
  );
}
