import type { Metadata } from "next";
import { WARI_URL } from "@/content/links";

/**
 * /wari is a short link to Wari's own site. Static export, so the redirect is a
 * meta refresh (plus a visible link and a canonical for crawlers).
 */
export const metadata: Metadata = {
  title: "Wari",
  description: "Wari: group expenses, receipts and trips. In beta, on its way to Google Play and the App Store.",
  alternates: { canonical: WARI_URL },
  robots: { index: false, follow: true },
};

export default function WariRedirectPage() {
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${WARI_URL}`} />
      <main className="grid min-h-screen place-items-center bg-bg px-6 text-center">
        <div>
          <p className="font-display text-3xl font-semibold tracking-[-0.03em] text-ink">Taking you to Wari.</p>
          <p className="mt-3 text-muted">Te llevo a Wari.</p>
          <a
            href={WARI_URL}
            className="press-scale mt-8 inline-flex h-12 items-center rounded-full bg-accent px-6 text-[15px] font-semibold text-on-accent"
          >
            {WARI_URL.replace("https://", "")}
          </a>
        </div>
      </main>
    </>
  );
}
