import { OlimpoSection } from "@/components/portfolio/OlimpoSection";
import { SystemsSection } from "@/components/portfolio/SystemsSection";
import { NextCase } from "@/components/portfolio/NextCase";
import { caseMetadata } from "../case-metadata";

export const metadata = caseMetadata("olimpo");

export default function OlimpoPage() {
  return (
    <>
      <OlimpoSection />
      <SystemsSection />
      <NextCase from="olimpo" />
    </>
  );
}
