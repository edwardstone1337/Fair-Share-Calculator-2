'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// Auth UI hidden — hooks preserved for future re-enablement
// import { useRouter } from 'next/navigation';
// import type { User } from '@supabase/supabase-js';
// import { createClient } from '@/lib/supabase/client';
import { useCurrency } from '@/lib/contexts/currency-context';
import { NAV_LINKS } from '@/lib/constants/site-links';
import { trackEvent } from '@/lib/analytics/gtag';
import { NAV_LINK_CLICKED, NAV_MENU_OPENED } from '@/lib/analytics/events';
import { CurrencySelector } from '@/components/ui/currency-selector';
import { Button } from '@/components/ui/button';

export function NavBar() {
  const { currency, setCurrency } = useCurrency();
  // Auth UI hidden — hooks preserved for future re-enablement
  // const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuOpenRef = useRef(menuOpen);
  menuOpenRef.current = menuOpen;
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const secondLinkRef = useRef<HTMLAnchorElement>(null);
  const pathname = usePathname();
  // const router = useRouter();

  const isCalculatorPage = pathname === '/';

  // Auth UI hidden — hooks preserved for future re-enablement
  // useEffect(() => {
  //   const supabase = createClient();
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     setUser(session?.user ?? null);
  //   });
  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange((_event, session) => {
  //     setUser(session?.user ?? null);
  //   });
  //   return () => subscription.unsubscribe();
  // }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
        setTimeout(() => menuButtonRef.current?.focus(), 0);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
    if (menuOpenRef.current) {
      setTimeout(() => menuButtonRef.current?.focus(), 0);
    }
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) {
      const t = setTimeout(() => firstLinkRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [menuOpen]);

  // Auth UI hidden — hooks preserved for future re-enablement
  // async function handleSignOut() {
  //   await createClient().auth.signOut();
  //   router.refresh();
  // }
  // const firstInitial = user?.email?.[0]?.toUpperCase() ?? '?';

  function handleMenuKeyDown(event: React.KeyboardEvent) {
    const target = event.target as HTMLElement;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (target === firstLinkRef.current) {
        secondLinkRef.current?.focus();
      } else {
        firstLinkRef.current?.focus();
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (target === secondLinkRef.current) {
        firstLinkRef.current?.focus();
      } else {
        secondLinkRef.current?.focus();
      }
    }
  }

  function closeMenuAndReturnFocus() {
    setMenuOpen(false);
    setTimeout(() => menuButtonRef.current?.focus(), 0);
  }

  return (
    <nav
      aria-label="Main navigation"
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
          position: 'relative',
          width: '100%',
          minHeight: 'var(--nav-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--nav-padding-y) var(--nav-padding-x)',
        }}
      >
        {/* Left: Logo + Title */}
        <Link
          href="/"
          aria-label="Fair Share Calculator home"
          onClick={() => trackEvent(NAV_LINK_CLICKED, { link: 'home', source: 'logo' })}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
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
          <span className="nav-title" aria-hidden="true">
            Fair Share
          </span>
        </Link>

        {/* Centre: Desktop nav links — visible at 640px+, absolutely centred */}
        <div className="nav-links-desktop nav-links-centre">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                onClick={() =>
                  trackEvent(NAV_LINK_CLICKED, {
                    link: link.label.toLowerCase(),
                    source: 'desktop',
                  })
                }
                style={{
                  fontSize: 'var(--nav-link-font-size)',
                  fontFamily: 'var(--font-family-heading)',
                  color: isActive
                    ? 'var(--nav-link-color-active)'
                    : 'var(--nav-link-color)',
                  fontWeight: isActive
                    ? 'var(--nav-link-font-weight-active)'
                    : 'var(--nav-link-font-weight)',
                  textDecoration: 'none',
                  height: 'var(--touch-target-min-height)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right: CurrencySelector (on / only), then Menu button (far-right on mobile) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            position: 'relative',
          }}
        >
          {isCalculatorPage && (
            <CurrencySelector
              value={currency.code}
              onChange={setCurrency}
            />
          )}
          <div
            ref={menuRef}
            className="nav-menu-button"
            style={{ position: 'relative', alignItems: 'center' }}
          >
            <Button
              ref={menuButtonRef}
              variant="secondary"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              aria-controls="nav-mobile-menu"
              aria-label="Navigation menu"
              onClick={() => {
                if (!menuOpen) trackEvent(NAV_MENU_OPENED, {});
                setMenuOpen(!menuOpen);
              }}
            >
              Menu
            </Button>
            {menuOpen && (
              <div
                id="nav-mobile-menu"
                role="menu"
                className="nav-menu-dropdown"
                onKeyDown={handleMenuKeyDown}
              >
                {NAV_LINKS.map((link, index) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      ref={index === 0 ? firstLinkRef : secondLinkRef}
                      role="menuitem"
                      href={link.href}
                      aria-current={isActive ? 'page' : undefined}
                      onClick={() => {
                        trackEvent(NAV_LINK_CLICKED, {
                          link: link.label.toLowerCase(),
                          source: 'mobile_menu',
                        });
                        closeMenuAndReturnFocus();
                      }}
                      style={{
                        fontSize: 'var(--nav-link-font-size)',
                        fontFamily: 'var(--font-family-heading)',
                        color: isActive
                          ? 'var(--nav-link-color-active)'
                          : 'var(--nav-link-color)',
                        fontWeight: isActive
                          ? 'var(--nav-link-font-weight-active)'
                          : 'var(--nav-link-font-weight)',
                        textDecoration: 'none',
                        padding: 'var(--space-2) var(--space-3)',
                        borderRadius: 'var(--radius-sm)',
                      }}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Auth UI hidden — preserved for future re-enablement */}
          {/* {process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true' &&
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
                />
              </div>
            ) : (
              <Button
                variant="secondary"
                onClick={() => router.push('/login')}
              >
                Sign in
              </Button>
            ))} */}
        </div>
      </div>
    </nav>
  );
}
