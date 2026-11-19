import React from "react";
import type { CSSProperties, ReactNode } from "react";
import type { Locale } from "@/lib/i18n-context";
import type { WariShot } from "@/content/wari-shots";

/**
 * A Wari capture inside an iPhone, as on the Wari landing (v2.1): a 310x686 body with
 * a titanium ring, side buttons and a Dynamic Island over a 292x668 screen. The capture
 * is 390x844 with nothing reserved for the status bar, so it sits 36 px lower (under the
 * island) and a blurred copy of its own top fills the strip above it. Every measure is a
 * percentage of the body, so it scales to any width (see `.wari-phone` in globals.css).
 */

/** The two layers that go inside a screen: the blurred strip and the capture itself. */
export function ShotLayers({ shot, locale, loading = "lazy" }: { shot: WariShot; locale: Locale; loading?: "lazy" | "eager" }) {
  return (
    <>
      <div aria-hidden="true" className="wari-strip">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={shot.src} width={shot.width} height={shot.height} alt="" loading={loading} decoding="async" draggable={false} />
      </div>
      <div className="wari-shot">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={shot.src} width={shot.width} height={shot.height} alt={shot.alt[locale]} loading={loading} decoding="async" draggable={false} />
      </div>
    </>
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
        <span aria-hidden="true" className="wari-island" />
      </div>
    </div>
  );
}
