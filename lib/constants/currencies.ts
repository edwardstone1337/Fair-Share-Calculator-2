export interface CurrencyConfig {
  code: string;       // ISO 4217 code
  symbol: string;     // Display symbol
  label: string;      // Dropdown label
}

export const CURRENCIES: CurrencyConfig[] = [
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'CAD', symbol: 'C$', label: 'CAD (C$)' },
  { code: 'AUD', symbol: 'A$', label: 'AUD (A$)' },
  { code: 'NZD', symbol: 'NZ$', label: 'NZD (NZ$)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
  { code: 'INR', symbol: '₹', label: 'INR (₹)' },
  { code: 'PHP', symbol: '₱', label: 'PHP (₱)' },
  { code: 'SGD', symbol: 'S$', label: 'SGD (S$)' },
];

export const DEFAULT_CURRENCY = CURRENCIES[0]; // USD

/**
 * Map browser locale to currency code.
 * Falls back to USD if locale doesn't match.
 */
const LOCALE_TO_CURRENCY: Record<string, string> = {
  'en-US': 'USD',
  'en-CA': 'CAD',
  'fr-CA': 'CAD',
  'en-AU': 'AUD',
  'en-NZ': 'NZD',
  'en-GB': 'GBP',
  'en-IN': 'INR',
  'hi-IN': 'INR',
  'en-PH': 'PHP',
  'fil-PH': 'PHP',
  'en-SG': 'SGD',
  'zh-SG': 'SGD',
};

/**
 * Detect currency from browser locale.
 * Tries exact match first, then language-region prefix.
 * Returns USD if no match.
 */
export function detectCurrencyFromLocale(): CurrencyConfig {
  if (typeof navigator === 'undefined') return DEFAULT_CURRENCY;

  const locales = navigator.languages ?? [navigator.language];

  for (const locale of locales) {
    // Exact match
    const exactCode = LOCALE_TO_CURRENCY[locale];
    if (exactCode) {
      const found = CURRENCIES.find(c => c.code === exactCode);
      if (found) return found;
    }

    // Try region suffix only (e.g. "en-AU" → check country "AU")
    const parts = locale.split('-');
    if (parts.length >= 2) {
      const country = parts[parts.length - 1].toUpperCase();
      const countryMap: Record<string, string> = {
        US: 'USD', CA: 'CAD', AU: 'AUD', NZ: 'NZD',
        GB: 'GBP', UK: 'GBP', IN: 'INR', PH: 'PHP', SG: 'SGD',
      };
      const code = countryMap[country];
      if (code) {
        const found = CURRENCIES.find(c => c.code === code);
        if (found) return found;
      }
    }
  }

  return DEFAULT_CURRENCY;
}

/**
 * Find a CurrencyConfig by its code.
 * Returns DEFAULT_CURRENCY if not found.
 */
export function getCurrencyByCode(code: string): CurrencyConfig {
  return CURRENCIES.find(c => c.code === code) ?? DEFAULT_CURRENCY;
}
