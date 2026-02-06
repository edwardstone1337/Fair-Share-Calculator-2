const isDev = process.env.NODE_ENV === "development";

export const logger = {
  info(message: string, data?: unknown) {
    if (isDev) console.log(`[FairShare] ${message}`, data ?? "");
  },
  warn(message: string, data?: unknown) {
    if (isDev) console.warn(`[FairShare] ${message}`, data ?? "");
  },
  error(message: string, data?: unknown) {
    // Errors log in all environments — they indicate real problems
    console.error(`[FairShare] ${message}`, data ?? "");
  },
};
