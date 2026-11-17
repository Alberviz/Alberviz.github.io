import { DesktopSection } from "@/components/portfolio/DesktopSection";
import { NextCase } from "@/components/portfolio/NextCase";
import { caseMetadata } from "../case-metadata";

export const metadata = caseMetadata("escritorio");

export default function EscritorioPage() {
  return (
    <>
      <DesktopSection />
      <NextCase from="escritorio" />
    </>
  );
}
