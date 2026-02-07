"use client";

import { trackEvent } from "@/lib/analytics/gtag";
import { AnchorHTMLAttributes } from "react";

interface TrackedAnchorProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  eventName: string;
  eventParams?: Record<string, unknown>;
}

/**
 * Standard <a> with GA4 event tracking on click.
 * Use for external links that need tracking.
 */
export function TrackedAnchor({
  eventName,
  eventParams = {},
  onClick,
  children,
  ...anchorProps
}: TrackedAnchorProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackEvent(eventName, eventParams);
    if (onClick) onClick(e);
  };

  return (
    <a {...anchorProps} onClick={handleClick}>
      {children}
    </a>
  );
}
