'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  detectCurrencyFromLocale,
  getCurrencyByCode,
  type CurrencyConfig,
  DEFAULT_CURRENCY,
} from '@/lib/constants/currencies';
import { trackEvent } from '@/lib/analytics/gtag';

const CURRENCY_LS_KEY = 'fairshare_currency';

interface CurrencyContextValue {
  currency: CurrencyConfig;
  setCurrency: (code: string) => void;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: DEFAULT_CURRENCY,
  setCurrency: () => {},
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyConfig>(DEFAULT_CURRENCY);
  const [initialized, setInitialized] = useState(false);

  // On mount: load from localStorage or auto-detect
  useEffect(() => {
    let savedCode: string | null = null;

    // Check localStorage
    try {
      savedCode = localStorage.getItem(CURRENCY_LS_KEY);
    } catch {
      // localStorage unavailable
    }

    // Also check the old fairshare_form key for backward compat
    if (!savedCode) {
      try {
        const formData = localStorage.getItem('fairshare_form');
        if (formData) {
          const parsed = JSON.parse(formData);
          if (typeof parsed.currency === 'string' && parsed.currency) {
            savedCode = parsed.currency;
          }
        }
      } catch {
        // Ignore parse errors
      }
    }

    if (savedCode) {
      const config = getCurrencyByCode(savedCode);
      setCurrencyState(config);
    } else {
      // Auto-detect from browser locale
      const detected = detectCurrencyFromLocale();
      setCurrencyState(detected);
    }

    setInitialized(true);
  }, []);

  // Persist to localStorage whenever currency changes (after init)
  useEffect(() => {
    if (!initialized) return;
    try {
      localStorage.setItem(CURRENCY_LS_KEY, currency.code);
    } catch {
      // localStorage unavailable
    }
  }, [currency, initialized]);

  const setCurrency = useCallback((code: string) => {
    const config = getCurrencyByCode(code);
    setCurrencyState(config);
    trackEvent('currency_changed', { currency_code: code });
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  return useContext(CurrencyContext);
}
