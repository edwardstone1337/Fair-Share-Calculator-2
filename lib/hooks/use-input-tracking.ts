"use client";

// NOTE: validation_error GA events were removed from blur handlers on 2025-02-07.
// Historical validation_error data before this date is blur-time noise and not comparable
// to post-deploy data, which fires only on Calculate attempt (see calculator-client.tsx).

import { useRef, useCallback } from "react";
import { trackEvent } from "@/lib/analytics/gtag";

interface UseInputTrackingOptions {
  fieldId: string;
  fieldType: "name" | "salary" | "expense_label" | "expense_amount";
  /** If true, skip input_started (for pre-filled fields) */
  prefilled?: boolean;
}

export function useInputTracking({
  fieldId,
  fieldType,
  prefilled = false,
}: UseInputTrackingOptions) {
  const startedRef = useRef(prefilled);
  const focusValueRef = useRef("");

  const onFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    focusValueRef.current = e.target.value.trim();
  }, []);

  const onInput = useCallback(
    (value: string) => {
      if (!startedRef.current && value.trim() !== "") {
        startedRef.current = true;
        trackEvent("input_started", {
          field_id: fieldId,
          field_type: fieldType,
        });
      }
    },
    [fieldId, fieldType]
  );

  const onBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const currentValue = e.target.value.trim();
      const hasValue = currentValue !== "";
      const valueChanged = currentValue !== focusValueRef.current;

      // Track input_completed
      if (hasValue && valueChanged) {
        trackEvent("input_completed", {
          field_id: fieldId,
          field_type: fieldType,
          has_value: true,
        });
      }
    },
    [fieldId, fieldType]
  );

  return { onFocus, onInput, onBlur };
}
