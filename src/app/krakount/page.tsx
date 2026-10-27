import type { Metadata } from "next";
import { KrakountNavbar } from "@/components/krakount/KrakountNavbar";
import { KrakountHero } from "@/components/krakount/KrakountHero";
import { KrakountMetricsStrip } from "@/components/krakount/KrakountMetricsStrip";
import { KrakountFeatureBento } from "@/components/krakount/KrakountFeatureBento";
import { KrakountEngineeringFooter } from "@/components/krakount/KrakountEngineeringFooter";

export const metadata: Metadata = {
  title: "Krakount | Automated Expenses, Receipt OCR & Group Trips",
  description:
    "Krakount: automated payment capture, incoming Bizum auto-settlement, Polish supermarket receipt OCR, live 32-currency settlement, and offline travel wallet engineered by Alberto Vizcaíno Ponte.",
  keywords: [
    "Krakount",
    "Expense Sharing",
    "Automatic Payments",
    "Bizum Settlement",
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
    title: "Krakount | Automated Expenses, Receipt OCR & Group Trips",
    description:
      "Automated payment capture, incoming Bizum auto-settle, Polish supermarket receipts split item by item, and offline travel wallet.",
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
    title: "Krakount | Automated Expenses, Receipt OCR & Group Trips",
    description:
      "Automated payment capture, incoming Bizum auto-settle, Polish supermarket receipts split item by item, and offline travel wallet.",
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
        <section id="features" data-scene="features">
          <KrakountFeatureBento />
        </section>
        <section data-scene="engineering">
          <KrakountEngineeringFooter />
        </section>
      </main>
    </div>
  );
}
