'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  detectCurrencyFromLocale,
  getCurrencyByCode,
  type CurrencyConfig,
  DEFAULT_CURRENCY,
} from '@/lib/constants/currencies';
import { trackEvent } from '@/lib/analytics/gtag';
import { createClient } from '@/lib/supabase/client';
import { getCurrencyPreference, setCurrencyPreference } from '@/lib/actions/user-preferences';

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

  // On mount: load from localStorage or auto-detect; then for logged-in users, sync from DB
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

    const detected = detectCurrencyFromLocale();
    const resolvedCode = savedCode ?? detected.code;
    if (savedCode) {
      const config = getCurrencyByCode(savedCode);
      setCurrencyState(config);
    } else {
      setCurrencyState(detected);
    }

    setInitialized(true);

    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || cancelled) return;
      const result = await getCurrencyPreference();
      if (cancelled || !result.success || !result.data) return;
      const dbCode = result.data;
      const isValid = typeof dbCode === 'string' && dbCode.length === 3 && /^[A-Z]{3}$/.test(dbCode);
      if (isValid && dbCode !== resolvedCode && !cancelled) {
        setCurrencyState(getCurrencyByCode(dbCode));
      }
    })();
    return () => {
      cancelled = true;
    };
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
    createClient()
      .auth.getUser()
      .then(({ data: { user } }) => {
        if (user) void setCurrencyPreference(code);
      });
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
