import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Geist,
  Geist_Mono,
  Inter,
  Inter_Tight,
  Marcellus,
} from "next/font/google";
import { LanguageProvider } from "@/lib/i18n-context";
import { SITE_URL } from "@/content/links";
import "./globals.css";

const fontDisplay = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--f-display",
  display: "swap",
});

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--f-sans",
  display: "swap",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--f-mono",
  display: "swap",
});

/* Wari's own type, only used inside the Wari portal ("another world"). */
const fontWari = Inter({
  subsets: ["latin"],
  variable: "--f-wari",
  display: "swap",
  preload: false,
});

const fontWariDisplay = Inter_Tight({
  subsets: ["latin"],
  variable: "--f-wari-display",
  display: "swap",
  preload: false,
});

/* Olimpo's own display face, only used inside the recreated Olimpo interface. */
const fontOlimpo = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--f-olimpo",
  display: "swap",
  preload: false,
});

const TITLE = "Alberto Vizcaíno Ponte";
const DESCRIPTION =
  "Maths and computer science student in Kraków. I build whole systems: Wari, my group expenses and trips app, in beta on its way to the stores; Olimpo, the operating system of my life on a Raspberry Pi; and a Linux desktop with a black hole I wrote by hand.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "Alberto Vizcaíno Ponte",
    "Software Engineer",
    "Design Engineer",
    "Mathematics",
    "Computer Science",
    "Wari",
    "WebGL",
    "Raspberry Pi",
    "Olimpo",
    "Svelte",
  ],
  authors: [{ name: TITLE, url: SITE_URL }],
  creator: TITLE,
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: TITLE,
    description: DESCRIPTION,
    siteName: TITLE,
    images: [
      {
        url: "/media/hero/og.jpg",
        width: 1200,
        height: 630,
        alt: "A black hole with a glowing accretion disk rendered in WebGL, next to the name Alberto Vizcaíno Ponte",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/media/hero/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#07080B",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${fontDisplay.variable} ${fontSans.variable} ${fontMono.variable} ${fontWari.variable} ${fontWariDisplay.variable} ${fontOlimpo.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-bg font-sans text-ink antialiased selection:bg-accent/25">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
