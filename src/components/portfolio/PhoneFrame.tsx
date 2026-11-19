import React from "react";
import type { CSSProperties, ReactNode } from "react";
import type { Locale } from "@/lib/i18n-context";
import type { WariShot } from "@/content/wari-shots";

/**
 * A Wari capture inside an iPhone, as on the Wari landing (v2.1): a 310x686 body with a titanium ring, side buttons
 * and a 292x668 screen with the Dynamic Island, the status bar (clock, signal, Wi-Fi, battery) and the home indicator
 * on top. The captures are taken with the safe areas of an installed iPhone (47 pt above, 34 pt below, 390x892, the
 * screen's own ratio), so the app already leaves room for all of it and the capture simply fills the screen.
 * Every measure is a percentage of the body, so it scales to any width (see `.wari-phone` in globals.css).
 */

/** The capture itself, filling the screen. */
export function ShotLayers({ shot, locale, loading = "lazy" }: { shot: WariShot; locale: Locale; loading?: "lazy" | "eager" }) {
  return (
    <div className="wari-shot">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={shot.src} width={shot.width} height={shot.height} alt={shot.alt[locale]} loading={loading} decoding="async" draggable={false} />
    </div>
  );
}

/** Clock on the left ear of the island, signal, Wi-Fi and battery on the right one. Decorative. */
function StatusBar() {
  return (
    <div aria-hidden="true" className="wari-status">
      <span className="wari-clock">9:41</span>
      <span className="wari-icons">
        <svg viewBox="0 0 17 11" fill="currentColor" className="wari-ico-signal">
          <rect x="0" y="7" width="3" height="4" rx="0.8" />
          <rect x="4.6" y="4.7" width="3" height="6.3" rx="0.8" />
          <rect x="9.2" y="2.4" width="3" height="8.6" rx="0.8" />
          <rect x="13.8" y="0" width="3" height="11" rx="0.8" />
        </svg>
        <svg viewBox="0 0 16 11" fill="currentColor" className="wari-ico-wifi">
          <path d="M8 2.3c2.1 0 4 .8 5.5 2.2l1-1.1A9.6 9.6 0 0 0 8 .8 9.6 9.6 0 0 0 1.5 3.4l1 1.1A7.9 7.9 0 0 1 8 2.3Z" />
          <path d="M8 5.6c1.2 0 2.3.5 3.2 1.2l1-1.1A6.4 6.4 0 0 0 8 4.1a6.4 6.4 0 0 0-4.2 1.6l1 1.1c.9-.8 2-1.2 3.2-1.2Z" />
          <path d="M8 8.8c.5 0 1 .2 1.4.6L8 11 6.6 9.4c.4-.4.9-.6 1.4-.6Z" />
        </svg>
        <svg viewBox="0 0 25 12" fill="none" className="wari-ico-battery">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3.4" stroke="currentColor" opacity="0.4" />
          <rect x="2" y="2" width="18" height="8" rx="2.2" fill="currentColor" />
          <path d="M23 4v4c.9-.3 1.5-1.1 1.5-2S23.9 4.3 23 4Z" fill="currentColor" opacity="0.45" />
        </svg>
      </span>
    </div>
  );
}

/**
 * The phone. Pass `shot` for one still capture, or `children` (for example crossfading
 * `ShotLayers`) to fill the screen yourself.
 */
export function PhoneFrame({
  shot,
  locale,
  loading,
  children,
  className = "",
  style,
  ...rest
}: {
  shot?: WariShot;
  locale: Locale;
  loading?: "lazy" | "eager";
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`wari-phone ${className}`} style={style} {...rest}>
      <span aria-hidden="true" className="wari-btn wari-btn-a" />
      <span aria-hidden="true" className="wari-btn wari-btn-b" />
      <span aria-hidden="true" className="wari-btn wari-btn-c" />
      <div className="wari-screen">
        {children ?? (shot ? <ShotLayers shot={shot} locale={locale} loading={loading} /> : null)}
        <StatusBar />
        <span aria-hidden="true" className="wari-island" />
        <span aria-hidden="true" className="wari-home" />
      </div>
    </div>
  );
}
