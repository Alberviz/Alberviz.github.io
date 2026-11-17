import type { Metadata } from "next";
import { CASE_BY_ID } from "@/content/pages";
import type { CaseId } from "@/content/pages";

const SITE = "Alberto Vizcaíno Ponte";

/** OG image of each case: a capture of the top of its page, 1200x630. */
const OG_ALT: Record<CaseId, string> = {
  wari: "The Wari page: real screens of the app in phone frames over a light blue fog",
  olimpo: "The Olimpo page: a recreated star map interface with the phone sky in front",
  laura: "The Laura page: the title next to a glowing voice wave, above her verified numbers",
  escritorio: "The desktop page: the title above a live recreation of a Linux desktop with a black hole",
};

export function caseMetadata(id: CaseId): Metadata {
  const c = CASE_BY_ID[id];
  const title = `${c.metaTitle} · ${SITE}`;
  const image = { url: `/media/og/${id}.jpg`, width: 1200, height: 630, alt: OG_ALT[id] };
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: { canonical: c.path },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: c.path,
      title,
      description: c.metaDescription,
      siteName: SITE,
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description: c.metaDescription, images: [image.url] },
  };
}
