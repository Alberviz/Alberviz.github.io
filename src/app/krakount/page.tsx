import type { Metadata } from "next";
import { KrakountNavbar } from "@/components/krakount/KrakountNavbar";
import { KrakountHero } from "@/components/krakount/KrakountHero";
import { KrakountMetricsStrip } from "@/components/krakount/KrakountMetricsStrip";
import { ReceiptDebtSimulator } from "@/components/krakount/ReceiptDebtSimulator";
import { KrakountFeatureBento } from "@/components/krakount/KrakountFeatureBento";
import { KrakountEngineeringFooter } from "@/components/krakount/KrakountEngineeringFooter";

export const metadata: Metadata = {
  title: "Krakount | Shared Expenses, Receipt OCR & Group Trips",
  description:
    "Krakount: mobile-first shared expenses, Polish supermarket receipt OCR, live NBP 32-currency settlement, and offline travel wallet engineered by Alberto Vizcaíno Ponte.",
  keywords: [
    "Krakount",
    "Expense Sharing",
    "Receipt OCR",
    "Paragon Fiskalny",
    "NBP Currencies",
    "Group Trips",
    "Offline Boarding Pass",
    "Alberto Vizcaíno Ponte",
    "Kraków",
    "Erasmus",
  ],
  openGraph: {
    title: "Krakount | Shared Expenses, Receipt OCR & Group Trips",
    description:
      "Split Polish supermarket receipts item by item, settle 32 currencies at official NBP rates, and carry every flight offline.",
    url: "https://alberviz.github.io/krakount/",
    siteName: "Krakount Showcase",
    images: [
      {
        url: "/media/krakount/shot-home.webp",
        width: 780,
        height: 1688,
        alt: "Krakount mobile application interface",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Krakount | Shared Expenses, Receipt OCR & Group Trips",
    description:
      "Split Polish supermarket receipts item by item, settle 32 currencies at official NBP rates, and carry every flight offline.",
    images: ["/media/krakount/shot-home.webp"],
  },
};

export default function KrakountPage() {
  return (
    <div
      data-surface="krakount"
      className="min-h-[100dvh] bg-[#0E0F13] text-[#EDEDEF] selection:bg-[#F5A524]/25 selection:text-[#F5A524]"
      style={{ fontFamily: "var(--font-krakount-ui)" }}
    >
      <KrakountNavbar />
      <main>
        <section data-scene="hero">
          <KrakountHero />
        </section>
        <section data-scene="metrics">
          <KrakountMetricsStrip />
        </section>
        <section data-scene="simulator">
          <ReceiptDebtSimulator />
        </section>
        <section data-scene="features">
          <KrakountFeatureBento />
        </section>
        <section data-scene="engineering">
          <KrakountEngineeringFooter />
        </section>
      </main>
    </div>
  );
}
