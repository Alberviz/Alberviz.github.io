import type { Metadata, Viewport } from "next";
import {
  Space_Grotesk,
  Plus_Jakarta_Sans,
  JetBrains_Mono,
  Schibsted_Grotesk,
  Archivo,
} from "next/font/google";
import { LanguageProvider } from "@/lib/i18n-context";
import "./globals.css";

const fontDisplay = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

const fontKrakountUi = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-krakount-ui",
  display: "swap",
});

const fontKrakountBrand = Archivo({
  subsets: ["latin"],
  weight: ["800", "900"],
  variable: "--font-krakount-brand",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://alberviz.github.io"),
  title: "Alberto Vizcaíno Ponte | Mathematics & CS Engineer | Builder",
  description:
    "Portfolio of Alberto Vizcaíno Ponte. Double degree in Mathematics and Computer Science. Engineering high-resilience systems and refined digital products.",
  keywords: [
    "Alberto Vizcaíno Ponte",
    "Software Engineer",
    "Mathematics",
    "Computer Science",
    "Fullstack",
    "Distributed Systems",
    "Krakount",
  ],
  authors: [{ name: "Alberto Vizcaíno Ponte", url: "https://alberviz.github.io" }],
  creator: "Alberto Vizcaíno Ponte",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://alberviz.github.io",
    title: "Alberto Vizcaíno Ponte | Mathematics & CS Engineer | Builder",
    description:
      "Portfolio of Alberto Vizcaíno Ponte. Double degree in Mathematics and Computer Science. Engineering high-resilience systems and refined digital products.",
    siteName: "Alberto Vizcaíno Ponte Portfolio",
    images: [
      {
        url: "/media/systems/gargantua-shader.webp",
        width: 1600,
        height: 900,
        alt: "Alberto Vizcaíno Ponte - Mathematics & CS Engineer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alberto Vizcaíno Ponte | Mathematics & CS Engineer | Builder",
    description:
      "Portfolio of Alberto Vizcaíno Ponte. Double degree in Mathematics and Computer Science. Engineering high-resilience systems and refined digital products.",
    images: ["/media/systems/gargantua-shader.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#090A0D",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${fontDisplay.variable} ${fontSans.variable} ${fontMono.variable} ${fontKrakountUi.variable} ${fontKrakountBrand.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[#090A0D] text-[#ECEEF2] selection:bg-emerald-500/20 selection:text-emerald-300 antialiased font-sans">
        <LanguageProvider>
          <div className="bg-noise" aria-hidden="true" />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
