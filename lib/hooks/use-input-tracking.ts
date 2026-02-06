"use client";

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

      // Track validation_error on blur for salary and expense_amount fields
      if (fieldType === "salary" || fieldType === "expense_amount") {
        const rawValue = currentValue.replace(/,/g, "").trim();
        let errorType: string | null = null;

        if (fieldType === "salary") {
          if (rawValue === "") {
            errorType = "missing";
          } else {
            const numValue = parseFloat(rawValue);
            if (isNaN(numValue) || numValue <= 0) {
              errorType = "invalid_format";
            } else if (numValue > 999999999) {
              errorType = "too_large";
            }
          }
        } else if (fieldType === "expense_amount") {
          if (rawValue !== "") {
            const numValue = parseFloat(rawValue);
            if (isNaN(numValue) || numValue <= 0) {
              errorType = "invalid_format";
            } else if (numValue > 999999999) {
              errorType = "too_large";
            }
          }
        }

        if (errorType) {
          trackEvent("validation_error", {
            field_id: fieldId,
            error_type: errorType,
          });
        }
      }
    },
    [fieldId, fieldType]
  );

  return { onFocus, onInput, onBlur };
}
