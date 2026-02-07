"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics/gtag";
import { ComponentProps } from "react";

interface TrackedLinkProps extends ComponentProps<typeof Link> {
  eventName: string;
  eventParams?: Record<string, unknown>;
}

/**
 * Next.js Link with GA4 event tracking on click.
 * Use in server components that need click tracking without converting the whole component to client.
 */
export function TrackedLink({
  eventName,
  eventParams = {},
  onClick,
  children,
  ...linkProps
}: TrackedLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackEvent(eventName, eventParams);
    // Call any existing onClick handler
    if (onClick) onClick(e);
  };

  return (
    <Link {...linkProps} onClick={handleClick}>
      {children}
    </Link>
  );
}
