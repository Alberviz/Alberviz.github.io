import type { Locale } from "@/lib/i18n-context";

export type LocalizedText = Record<Locale, string>;

export interface ExternalLink {
  label: LocalizedText;
  href: string;
  kind: "live" | "github" | "video" | "internal" | "pdf";
}
