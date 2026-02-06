"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import type { ConfigSummary } from "@/lib/actions/configurations";
import { renameConfiguration, deleteConfiguration } from "@/lib/actions/configurations";
import { formatCurrency } from "@/lib/calculator/compute";
import { getCurrencyByCode } from "@/lib/constants/currencies";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconButton } from "@/components/ui/icon-button";
import { Icon } from "@/components/ui/icon";

export interface ConfigCardProps {
  config: ConfigSummary;
  onDeleted: (configId: string) => void;
  onError: (message: string) => void;
}

function formatUpdatedAt(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ConfigCard({ config, onDeleted, onError }: ConfigCardProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState(config.name);
  const [isSavingName, setIsSavingName] = useState(false);

  const symbol = getCurrencyByCode(config.currency).symbol;
  const summaryLine = `${config.person1Name} & ${config.person2Name} · ${config.expenseCount} expenses · ${formatCurrency(config.totalExpenses, symbol)}`;

  const saveName = useCallback(async () => {
    const trimmed = editNameValue.trim();
    if (trimmed === config.name || !trimmed) {
      setIsEditingName(false);
      setEditNameValue(config.name);
      return;
    }
    setIsSavingName(true);
    const result = await renameConfiguration(config.id, trimmed);
    setIsSavingName(false);
    if (result.success) {
      setIsEditingName(false);
      setEditNameValue(trimmed);
    } else {
      setEditNameValue(config.name);
      onError(result.error);
    }
  }, [config.id, config.name, editNameValue, onError]);

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveName();
    }
    if (e.key === "Escape") {
      setEditNameValue(config.name);
      setIsEditingName(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete "${config.name}"? This can't be undone.`
    );
    if (!confirmed) return;
    const result = await deleteConfiguration(config.id);
    if (result.success) {
      onDeleted(config.id);
    } else {
      onError(result.error);
    }
  };

  return (
    <Card
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--card-gap)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-2)",
        }}
      >
        {isEditingName ? (
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <Input
              id={`config-name-${config.id}`}
              value={editNameValue}
              onChange={(e) => setEditNameValue(e.target.value)}
              onBlur={() => saveName()}
              onKeyDown={handleNameKeyDown}
              disabled={isSavingName}
              autoComplete="off"
              style={{ flex: 1 }}
            />
            {isSavingName && (
              <span
                style={{
                  fontSize: "var(--summary-explanation-size)",
                  color: "var(--summary-explanation-text)",
                }}
              >
                Saving…
              </span>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditingName(true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-1)",
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              fontFamily: "var(--font-family-body)",
              fontSize: "var(--label-font-size)",
              fontWeight: "var(--label-font-weight)",
              color: "var(--label-text)",
              textAlign: "left",
            }}
          >
            <span>{config.name}</span>
            <Icon
              name="edit"
              size="var(--icon-size-sm)"
              style={{ color: "var(--text-tertiary)", flexShrink: 0 }}
            />
          </button>
        )}
        <p
          style={{
            fontFamily: "var(--font-family-body)",
            fontSize: "var(--summary-explanation-size)",
            color: "var(--summary-explanation-text)",
          }}
        >
          {formatUpdatedAt(config.updatedAt)}
        </p>
        <p
          style={{
            fontFamily: "var(--font-family-body)",
            fontSize: "var(--summary-explanation-size)",
            color: "var(--summary-explanation-text)",
          }}
        >
          {summaryLine}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "var(--space-2)",
        }}
      >
        <Link href={`/?config=${config.id}`}>
          <Button variant="primary">Load</Button>
        </Link>
        <IconButton
          icon="delete"
          variant="danger"
          onClick={handleDelete}
          aria-label={`Delete ${config.name}`}
          size="sm"
        />
      </div>
    </Card>
  );
}
