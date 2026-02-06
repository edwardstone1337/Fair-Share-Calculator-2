const API_BASE =
  process.env.NEXT_PUBLIC_SHARE_API_URL ||
  "https://tight-firefly-c0dd.edwardstone1337.workers.dev";

export interface ShareState {
  name1: string;
  name2: string;
  salary1: string;
  salary2: string;
  expenses: { amount: string; label: string }[];
}

/**
 * Share via backend (Cloudflare Worker).
 * POST /share with the current state.
 * Returns the share URL on success.
 */
export async function shareViaBackend(state: ShareState): Promise<string> {
  const res = await fetch(`${API_BASE}/share`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(state),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      (errorData as { error?: string })?.error || `HTTP ${res.status}`
    );
  }

  const data = (await res.json()) as { id: string };
  if (!data?.id) throw new Error("Invalid response");

  return `${window.location.origin}${window.location.pathname}?id=${encodeURIComponent(data.id)}`;
}

/**
 * Fallback: build a legacy query-param URL.
 * Used if the backend share fails.
 */
export function buildLegacyShareUrl(state: ShareState): string {
  const params = new URLSearchParams({
    name1: state.name1,
    name2: state.name2,
    salary1: state.salary1,
    salary2: state.salary2,
    expenses: JSON.stringify(state.expenses),
  });
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
}

/**
 * Validate that a response from the share API has the expected shape.
 * Returns a validated ShareState or throws.
 */
function validateShareResponse(data: unknown): ShareState {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid response: not an object");
  }

  const obj = data as Record<string, unknown>;

  return {
    name1: typeof obj.name1 === "string" ? obj.name1 : "",
    name2: typeof obj.name2 === "string" ? obj.name2 : "",
    salary1: typeof obj.salary1 === "string" ? obj.salary1 : "",
    salary2: typeof obj.salary2 === "string" ? obj.salary2 : "",
    expenses: Array.isArray(obj.expenses)
      ? obj.expenses
          .filter((e): e is Record<string, unknown> => !!e && typeof e === "object")
          .slice(0, 50)
          .map((e) => ({
            amount: typeof e.amount === "string" ? e.amount : "",
            label: typeof e.label === "string" ? e.label : "",
          }))
      : [],
  };
}

/**
 * Load configuration from a backend share ID.
 * GET /share/:id
 */
export async function loadFromShareId(id: string): Promise<ShareState> {
  if (
    typeof id !== "string" ||
    id.length > 100 ||
    !/^[a-zA-Z0-9_-]+$/.test(id)
  ) {
    throw new Error("Invalid share ID");
  }

  const res = await fetch(
    `${API_BASE}/share/${encodeURIComponent(id)}`
  );

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const raw = await res.json();
  return validateShareResponse(raw);
}
