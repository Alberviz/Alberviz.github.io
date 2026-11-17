import { LauraSection } from "@/components/portfolio/LauraSection";
import { NextCase } from "@/components/portfolio/NextCase";
import { caseMetadata } from "../case-metadata";

export const metadata = caseMetadata("laura");

export default function LauraPage() {
  return (
    <>
      <LauraSection />
      <NextCase from="laura" />
    </>
  );
}
