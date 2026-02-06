'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { useCurrency } from '@/lib/contexts/currency-context';
import { CurrencySelector } from '@/components/ui/currency-selector';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';

export function NavBar() {
  const { currency, setCurrency } = useCurrency();
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    await createClient().auth.signOut();
    router.refresh();
  }

  const firstInitial = user?.email?.[0]?.toUpperCase() ?? '?';

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
          width: '100%',
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
          {process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true' &&
            (user ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                }}
              >
                <div
                  style={{
                    width: 'var(--space-6)',
                    height: 'var(--space-6)',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--surface-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-semibold)',
                    fontFamily: 'var(--font-family-heading)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  aria-hidden
                >
                  {firstInitial}
                </div>
                <IconButton
                  icon="logout"
                  variant="ghost"
                  onClick={handleSignOut}
                  aria-label="Sign out"
                  size="sm"
                />
              </div>
            ) : (
              <Button
                variant="secondary"
                onClick={() => router.push('/login')}
              >
                Sign in
              </Button>
            ))}
        </div>
      </div>
    </nav>
  );
}
