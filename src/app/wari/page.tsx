import { WariPortal } from "@/components/portfolio/WariPortal";
import { NextCase } from "@/components/portfolio/NextCase";
import { caseMetadata } from "../case-metadata";

export const metadata = caseMetadata("wari");

export default function WariPage() {
  return (
    <>
      <WariPortal />
      <NextCase from="wari" />
    </>
  );
}
