"use client";

import { useState, useCallback, useEffect } from "react";
import {
  saveConfiguration,
  listConfigurations,
  type ConfigSummary,
} from "@/lib/actions/configurations";
import { ConfigCard } from "@/components/dashboard/config-card";
import { Snackbar } from "@/components/ui/snackbar";
import type { SavedFormData } from "@/lib/calculator/types";
import { buildPendingSaveInput } from "@/lib/calculator/pending-save";

export interface DashboardClientProps {
  initialConfigs: ConfigSummary[];
}

type SnackbarState = {
  message: string;
  variant: "default" | "error";
} | null;

function isValidMigrationForm(data: unknown): data is SavedFormData {
  if (!data || typeof data !== "object") return false;
  const f = data as Record<string, unknown>;
  return (
    typeof f.name1 === "string" ||
    typeof f.salary1 === "string" ||
    typeof f.name2 === "string" ||
    typeof f.salary2 === "string"
  );
}

export function DashboardClient({ initialConfigs }: DashboardClientProps) {
  const [configs, setConfigs] = useState<ConfigSummary[]>(initialConfigs);
  const [snackbar, setSnackbar] = useState<SnackbarState>(null);

  useEffect(() => {
    const pending = typeof window !== "undefined" && localStorage.getItem("fairshare_pending_save") === "true";
    if (!pending) return;

    const raw = typeof window !== "undefined" ? localStorage.getItem("fairshare_form") : null;
    let parsed: unknown = null;
    try {
      if (raw) parsed = JSON.parse(raw);
    } catch {
      // ignore
    }
    if (!parsed || !isValidMigrationForm(parsed)) {
      localStorage.removeItem("fairshare_pending_save");
      return;
    }

    const form = parsed as SavedFormData;
    const input = buildPendingSaveInput(form);
    if (!input) {
      localStorage.removeItem("fairshare_pending_save");
      return;
    }

    let cancelled = false;
    void (async () => {
      const result = await saveConfiguration(input);
      if (cancelled) return;
      if (result.success) {
        const listResult = await listConfigurations();
        if (cancelled) return;
        if (listResult.success) setConfigs(listResult.data);
        if (!cancelled) {
          setSnackbar({
            message: "Configuration saved from your calculator session.",
            variant: "default",
          });
        }
      } else {
        if (!cancelled) setSnackbar({ message: result.error, variant: "error" });
      }
      localStorage.removeItem("fairshare_pending_save");
    })();
    return () => {
      cancelled = true;
      localStorage.removeItem("fairshare_pending_save");
    };
  }, []);

  const handleDeleted = useCallback((configId: string) => {
    setConfigs((prev) => prev.filter((c) => c.id !== configId));
    setSnackbar({ message: "Configuration deleted.", variant: "default" });
  }, []);

  const handleError = useCallback((message: string) => {
    setSnackbar({ message, variant: "error" });
  }, []);

  return (
    <>
      <ul
        style={{
          listStyle: "none",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
        }}
      >
        {configs.map((config) => (
          <li key={config.id}>
            <ConfigCard
              config={config}
              onDeleted={handleDeleted}
              onError={handleError}
            />
          </li>
        ))}
      </ul>
      {snackbar && (
        <Snackbar
          message={snackbar.message}
          visible={true}
          onHide={() => setSnackbar(null)}
          variant={snackbar.variant}
        />
      )}
    </>
  );
}
