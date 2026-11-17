"use client";

import React from "react";
import { DesktopExplorer } from "./desktop/DesktopExplorer";
import { MyCrohnieCase } from "./desktop/MyCrohnieCase";
import { AppliedIndex } from "./desktop/AppliedIndex";

/**
 * Two anchored blocks (Phase 2 redesigns both):
 * #escritorio: the AI-native Linux desktop (interactive explorer over real captures).
 * #proyectos: MyCrohnie (HackYeah 2026) and the index of applied AI tools.
 */
export function DesktopSection() {
  return (
    <section id="escritorio" data-scene="desktop" className="border-t border-line">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-20 lg:py-28">
          <DesktopExplorer />
        </div>
      </div>
    </section>
  );
}

export function ProjectsSection() {
  return (
    <section id="proyectos" data-scene="work" className="border-t border-line">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-20 lg:py-28">
          <MyCrohnieCase />
        </div>
        <div className="border-t border-line py-20 lg:py-28">
          <AppliedIndex />
        </div>
      </div>
    </section>
  );
}
