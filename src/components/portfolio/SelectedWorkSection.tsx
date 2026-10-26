"use client";

import React from "react";
import { DesktopExplorer } from "./desktop/DesktopExplorer";
import { MyCrohnieCase } from "./desktop/MyCrohnieCase";
import { AppliedIndex } from "./desktop/AppliedIndex";

/**
 * Selected work, in three movements separated by hairlines:
 * 1. The AI-native Linux desktop (interactive explorer over real captures).
 * 2. MyCrohnie, the HackYeah 2026 case study.
 * 3. An editorial index of applied AI tools in production.
 */
export function SelectedWorkSection() {
  return (
    <section id="case-studies" data-scene="work" className="border-t border-[#232732]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-20 lg:py-28">
          <DesktopExplorer />
        </div>
        <div className="border-t border-[#232732] py-20 lg:py-28">
          <MyCrohnieCase />
        </div>
        <div className="border-t border-[#232732] py-20 lg:py-28">
          <AppliedIndex />
        </div>
      </div>
    </section>
  );
}
