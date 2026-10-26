import type { Locale } from "@/lib/i18n-context";

export type LocalizedText = Record<Locale, string>;

export interface ExternalLink {
  label: LocalizedText;
  href: string;
  kind: "live" | "github" | "video" | "internal" | "pdf";
}

export interface MetricItem {
  value: string;
  label: LocalizedText;
}

export interface ArchitectureNode {
  id: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  layer: "ingest" | "core" | "security" | "interface";
  specs: LocalizedText[];
}

export interface ProjectCaseStudy {
  id: string;
  slug: string;
  title: string;
  tagline: LocalizedText;
  category: "flagship" | "systems" | "hackathon" | "applied-ai";
  repoStatus: "public" | "private";
  statusLabel: LocalizedText;
  year: string;
  context: LocalizedText;
  problem: LocalizedText;
  engineeringHighlights: LocalizedText[];
  stack: string[];
  links: ExternalLink[];
  featuredMediaKey:
    | "krakount"
    | "mycrohnie"
    | "gargantua"
    | "celestial"
    | "desktopIcy"
    | "lauraDrawer"
    | "closhare"
    | "barber"
    | "gts2";
}

export interface WealthFlowItem {
  id: string;
  title: LocalizedText;
  source: string;
  protocol?: string;
  detail: LocalizedText;
}

export interface WealthFlowArchitecture {
  inputs: WealthFlowItem[];
  core: {
    title: LocalizedText;
    platform: string;
    specs: LocalizedText[];
  };
  outputs: WealthFlowItem[];
}

export interface LinuxDesktopShowcaseItem {
  id: string;
  title: string;
  badge: LocalizedText;
  tech: string;
  summary: LocalizedText;
  details: LocalizedText[];
  mediaKey: "gargantua" | "celestial" | "desktopIcy" | "lauraDrawer";
  links?: ExternalLink[];
}

export interface SubProject {
  id: string;
  title: string;
  badge: LocalizedText;
  summary: LocalizedText;
  highlights: LocalizedText[];
  stack: string[];
  links: ExternalLink[];
}

export interface ExperienceEntry {
  company: string;
  role: LocalizedText;
  location: LocalizedText;
  period: LocalizedText;
  summary: LocalizedText;
  bullets: LocalizedText[];
  stack: string[];
}

export interface AcademicAward {
  title: LocalizedText;
  detail: LocalizedText;
  year: string;
}

export interface ReceiptSimItem {
  id: string;
  polishName: string;
  translatedName: LocalizedText;
  priceGrosze: number; // integer minor units (PLN grosze: 100 = 1.00 PLN)
  defaultClaimants: string[];
}

export interface KrakountFriend {
  id: string;
  name: string;
  initials: string;
  colorHex: string;
}
