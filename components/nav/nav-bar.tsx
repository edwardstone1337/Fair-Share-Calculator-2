'use client';

import Link from 'next/link';
import { useCurrency } from '@/lib/contexts/currency-context';
import { CurrencySelector } from '@/components/ui/currency-selector';

export function NavBar() {
  const { currency, setCurrency } = useCurrency();

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 'var(--nav-z-index)',
        background: 'var(--nav-bg)',
        width: '100%',
        borderBottom: 'var(--nav-border-bottom)',
        boxShadow: 'var(--nav-shadow)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--nav-max-width)',
          margin: '0 auto',
          minHeight: 'var(--nav-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--nav-padding-y) var(--nav-padding-x)',
        }}
      >
        {/* Left: Logo */}
        <Link
          href="/"
          aria-label="Fair Share Calculator home"
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logoIcon.png"
            alt=""
            aria-hidden="true"
            style={{
              width: 'var(--nav-logo-size)',
              height: 'var(--nav-logo-size)',
            }}
          />
        </Link>

        {/* Right: Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
          }}
        >
          <CurrencySelector
            value={currency.code}
            onChange={setCurrency}
          />
          {/* Auth button slot — Phase 5 will add here */}
        </div>
      </div>
    </nav>
  );
}
