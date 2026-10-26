"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ArrowSquareOut,
  GithubLogo,
  FilePdf,
  CheckCircle,
  Terminal,
  Sparkle,
} from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import {
  SELECTED_CASE_STUDIES,
  APPLIED_AI_PROJECTS,
} from "@/content/portfolio-data";
import { ASSETS } from "@/content/assets";

export function SelectedWorkSection() {
  const { locale } = useLocale();

  // MyCrohnie visual modal/switcher state
  const [myCrohnieView, setMyCrohnieView] = useState<"video" | "home" | "report" | "patterns">("video");

  // Systems renders switcher state
  const [systemRenderIndex, setSystemRenderIndex] = useState<number>(0);

  const systemRenders = [
    {
      key: "gargantua",
      name: { en: "Gargantua Black Hole", es: "Agujero Negro Gargantua" },
      desc: { en: "Raymarched GLSL · ACES Tonemapping", es: "Raymarching GLSL · Mapeo ACES" },
      asset: ASSETS.systems.gargantua,
    },
    {
      key: "celestial",
      name: { en: "Celestial Orbital Desktop", es: "Escritorio Orbital Celestial" },
      desc: { en: "Hyprland · Quickshell · Solar System", es: "Hyprland · Quickshell · Sistema Solar" },
      asset: ASSETS.systems.celestial,
    },
    {
      key: "telemetry",
      name: { en: "QML System Health Telemetry", es: "Telemetría QML del Sistema" },
      desc: { en: "Live Hardware & GPU Sensors", es: "Sensores de Hardware y GPU en Vivo" },
      asset: ASSETS.systems.qmlTelemetry,
    },
  ];

  const myCrohnie = SELECTED_CASE_STUDIES[0];
  const systemsStudy = SELECTED_CASE_STUDIES[1];

  return (
    <section
      id="case-studies"
      data-scene="work"
      className="py-16 sm:py-24 border-b border-[#232732]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-3xl mb-12">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.02em] text-[#ECEEF2]">
            {locale === "en"
              ? "Systems Engineering & Production AI"
              : "Ingeniería de Sistemas e IA en Producción"}
          </h2>
          <p className="text-base sm:text-lg text-[#8E95A5] mt-3 leading-relaxed">
            {locale === "en"
              ? "From raw USB packet sniffing and raymarched GLSL shaders down to 24-hour hackathons and zero-cost serverless tools."
              : "Desde captura de tramas USB y shaders GLSL hasta hackathons presenciales de 24 horas y herramientas serverless a coste cero."}
          </p>
        </div>

        {/* 1. MYCROHNIE (HackYeah 2026 Winner/Track Project) */}
        <div className="bg-[#111318] border border-[#232732] rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 mb-10">
          {/* Left Column: Story, Highlights & Links */}
          <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171A21] border border-[#232732] text-xs font-mono text-[#10B981] mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                <span>{myCrohnie.statusLabel[locale]}</span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#ECEEF2]">
                {myCrohnie.title}
              </h3>
              <p className="text-sm sm:text-base text-[#ECEEF2]/90 mt-2 font-medium">
                {myCrohnie.tagline[locale]}
              </p>

              <p className="text-xs sm:text-sm text-[#8E95A5] mt-4 leading-relaxed">
                {myCrohnie.problem[locale]}
              </p>

              {/* Engineering Highlights */}
              <div className="mt-6 space-y-3">
                {myCrohnie.engineeringHighlights.map((hl, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-[#ECEEF2]/90">
                    <CheckCircle
                      size={15}
                      weight="bold"
                      className="text-[#10B981] mt-0.5 shrink-0"
                    />
                    <span className="leading-relaxed">{hl[locale]}</span>
                  </div>
                ))}
              </div>

              {/* Stack Pills */}
              <div className="flex flex-wrap gap-1.5 mt-6">
                {myCrohnie.stack.map((item) => (
                  <span
                    key={item}
                    className="px-2.5 py-0.5 rounded-full bg-[#171A21] border border-[#232732] text-[11px] font-mono text-[#8E95A5]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Links Bar */}
            <div className="mt-8 pt-6 border-t border-[#232732] flex flex-wrap items-center gap-3">
              <a
                href={myCrohnie.links[0].href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#10B981] hover:bg-[#059669] text-[#04130D] font-semibold text-xs px-4 py-2 press-scale transition-colors shadow-md"
              >
                <span>{myCrohnie.links[0].label[locale]}</span>
                <ArrowSquareOut size={14} weight="bold" />
              </a>
              <a
                href={myCrohnie.links[1].href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#232732] bg-[#171A21] hover:bg-[#232732] text-[#ECEEF2] text-xs px-3.5 py-2 press-scale transition-colors"
              >
                <GithubLogo size={14} weight="bold" />
                <span>{myCrohnie.links[1].label[locale]}</span>
              </a>
              <a
                href={myCrohnie.links[2].href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#232732] bg-[#171A21] hover:bg-[#232732] text-[#8E95A5] hover:text-[#ECEEF2] text-xs px-3.5 py-2 press-scale transition-colors"
              >
                <FilePdf size={14} weight="bold" />
                <span>{myCrohnie.links[2].label[locale]}</span>
              </a>
            </div>
          </div>

          {/* Right Column: Real 16:9 Video + Real Mobile Shots Switcher */}
          <div className="lg:col-span-6 bg-[#0E0F13] border-t lg:border-t-0 lg:border-l border-[#232732] p-6 flex flex-col justify-center gap-4">
            {/* Main Stage: Video or Selected Mobile Shot */}
            <div className="w-full aspect-[16/10] rounded-xl border border-[#232732] bg-[#111318] overflow-hidden relative shadow-inner">
              {myCrohnieView === "video" ? (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={ASSETS.mycrohnie.poster.src}
                  className="w-full h-full object-cover"
                >
                  <source src={ASSETS.mycrohnie.demoLoop.src} type="video/mp4" />
                </video>
              ) : myCrohnieView === "home" ? (
                <Image
                  src={ASSETS.mycrohnie.shots.home.src}
                  alt={ASSETS.mycrohnie.shots.home.alt[locale]}
                  width={ASSETS.mycrohnie.shots.home.width}
                  height={ASSETS.mycrohnie.shots.home.height}
                  className="w-full h-full object-contain p-2"
                />
              ) : myCrohnieView === "report" ? (
                <Image
                  src={ASSETS.mycrohnie.shots.report.src}
                  alt={ASSETS.mycrohnie.shots.report.alt[locale]}
                  width={ASSETS.mycrohnie.shots.report.width}
                  height={ASSETS.mycrohnie.shots.report.height}
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <Image
                  src={ASSETS.mycrohnie.shots.patterns.src}
                  alt={ASSETS.mycrohnie.shots.patterns.alt[locale]}
                  width={ASSETS.mycrohnie.shots.patterns.width}
                  height={ASSETS.mycrohnie.shots.patterns.height}
                  className="w-full h-full object-contain p-2"
                />
              )}
            </div>

            {/* Thumbnail Switcher */}
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setMyCrohnieView("video")}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-colors press-scale text-center ${
                  myCrohnieView === "video"
                    ? "bg-[#10B981]/10 border-[#10B981] text-[#10B981] font-semibold"
                    : "bg-[#171A21] border-[#232732] text-[#8E95A5] hover:text-[#ECEEF2]"
                }`}
              >
                18s Reel
              </button>
              <button
                type="button"
                onClick={() => setMyCrohnieView("home")}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-colors press-scale text-center ${
                  myCrohnieView === "home"
                    ? "bg-[#10B981]/10 border-[#10B981] text-[#10B981] font-semibold"
                    : "bg-[#171A21] border-[#232732] text-[#8E95A5] hover:text-[#ECEEF2]"
                }`}
              >
                Kid UI
              </button>
              <button
                type="button"
                onClick={() => setMyCrohnieView("report")}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-colors press-scale text-center ${
                  myCrohnieView === "report"
                    ? "bg-[#10B981]/10 border-[#10B981] text-[#10B981] font-semibold"
                    : "bg-[#171A21] border-[#232732] text-[#8E95A5] hover:text-[#ECEEF2]"
                }`}
              >
                Doctor Print
              </button>
              <button
                type="button"
                onClick={() => setMyCrohnieView("patterns")}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-colors press-scale text-center ${
                  myCrohnieView === "patterns"
                    ? "bg-[#10B981]/10 border-[#10B981] text-[#10B981] font-semibold"
                    : "bg-[#171A21] border-[#232732] text-[#8E95A5] hover:text-[#ECEEF2]"
                }`}
              >
                Flare AI
              </button>
            </div>
          </div>
        </div>

        {/* 2. SYSTEMS & LOW-LEVEL REVERSE ENGINEERING */}
        <div className="bg-[#111318] border border-[#232732] rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 mb-10">
          {/* Left Column: Interactive Visual Switcher */}
          <div className="lg:col-span-6 bg-[#0E0F13] p-6 flex flex-col justify-center gap-4 border-b lg:border-b-0 lg:border-r border-[#232732]">
            <div className="w-full aspect-[16/10] rounded-xl border border-[#232732] bg-[#111318] overflow-hidden relative shadow-inner">
              <Image
                src={systemRenders[systemRenderIndex].asset.src}
                alt={systemRenders[systemRenderIndex].asset.alt[locale]}
                width={systemRenders[systemRenderIndex].asset.width}
                height={systemRenders[systemRenderIndex].asset.height}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-lg bg-[#090A0D]/85 backdrop-blur-md border border-[#232732] flex items-center justify-between">
                <span className="font-display font-semibold text-xs text-[#ECEEF2]">
                  {systemRenders[systemRenderIndex].name[locale]}
                </span>
                <span className="font-mono text-[10px] text-[#10B981]">
                  {systemRenders[systemRenderIndex].desc[locale]}
                </span>
              </div>
            </div>

            {/* Switcher Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {systemRenders.map((item, idx) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setSystemRenderIndex(idx)}
                  className={`px-2 py-1.5 rounded-lg border text-xs font-mono transition-colors press-scale text-center truncate ${
                    systemRenderIndex === idx
                      ? "bg-[#10B981]/10 border-[#10B981] text-[#10B981] font-semibold"
                      : "bg-[#171A21] border-[#232732] text-[#8E95A5] hover:text-[#ECEEF2]"
                  }`}
                >
                  0{idx + 1}. {item.key}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: 4 Low-Level Engineering Breakthroughs */}
          <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171A21] border border-[#232732] text-xs font-mono text-[#10B981] mb-4">
                <Terminal size={14} weight="bold" />
                <span>{systemsStudy.statusLabel[locale]}</span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#ECEEF2]">
                {systemsStudy.title}
              </h3>
              <p className="text-sm sm:text-base text-[#ECEEF2]/90 mt-2 font-medium">
                {systemsStudy.tagline[locale]}
              </p>

              {/* 4 Low-Level Breakthroughs */}
              <div className="mt-6 space-y-3">
                {systemsStudy.engineeringHighlights.map((hl, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-[#ECEEF2]/90">
                    <span className="font-mono font-bold text-[#10B981] mt-0.5 shrink-0">
                      [{idx + 1}]
                    </span>
                    <span className="leading-relaxed">{hl[locale]}</span>
                  </div>
                ))}
              </div>

              {/* Stack Tags */}
              <div className="flex flex-wrap gap-1.5 mt-6">
                {systemsStudy.stack.map((item) => (
                  <span
                    key={item}
                    className="px-2.5 py-0.5 rounded-full bg-[#171A21] border border-[#232732] text-[11px] font-mono text-[#8E95A5]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Repositories */}
            <div className="mt-8 pt-6 border-t border-[#232732] flex flex-wrap items-center gap-3">
              <a
                href={systemsStudy.links[0].href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#232732] bg-[#171A21] hover:bg-[#232732] text-[#ECEEF2] text-xs px-3.5 py-2 press-scale transition-colors"
              >
                <GithubLogo size={14} weight="bold" />
                <span>{systemsStudy.links[0].label[locale]}</span>
              </a>
              <a
                href={systemsStudy.links[1].href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#232732] bg-[#171A21] hover:bg-[#232732] text-[#ECEEF2] text-xs px-3.5 py-2 press-scale transition-colors"
              >
                <GithubLogo size={14} weight="bold" />
                <span>{systemsStudy.links[1].label[locale]}</span>
              </a>
            </div>
          </div>
        </div>

        {/* 3. APPLIED AI & ZERO-COST ARCHITECTURE SHEET */}
        <div className="bg-[#111318] border border-[#232732] rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 sm:p-8 border-b border-[#232732] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#ECEEF2]">
                {locale === "en"
                  ? "Applied AI & Zero-Cost Consumer Architecture"
                  : "IA Aplicada y Arquitectura de Consumo a Coste Cero"}
              </h3>
              <p className="text-xs sm:text-sm text-[#8E95A5] mt-1">
                {locale === "en"
                  ? "Live production micro-services engineered for high resilience and zero fixed monthly infrastructure bills."
                  : "Microservicios en producción diseñados con alta resiliencia y cero facturas fijas mensuales de infraestructura."}
              </p>
            </div>
            <span className="font-mono text-xs text-[#10B981] bg-[#171A21] px-3 py-1 rounded-full border border-[#232732] self-start sm:self-auto">
              3 Live Projects
            </span>
          </div>

          <div className="divide-y divide-[#232732]">
            {APPLIED_AI_PROJECTS.map((project) => (
              <div
                key={project.id}
                className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 hover:bg-[#171A21]/30 transition-colors"
              >
                <div className="lg:col-span-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs text-[#10B981] bg-[#171A21] px-2.5 py-0.5 rounded-full border border-[#232732]">
                      {project.badge[locale]}
                    </span>
                  </div>
                  <h4 className="font-display text-lg font-semibold text-[#ECEEF2]">
                    {project.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#8E95A5] mt-2 leading-relaxed">
                    {project.summary[locale]}
                  </p>
                </div>

                <div className="lg:col-span-5 flex flex-col justify-center">
                  {project.highlights.map((hl, hIdx) => (
                    <div
                      key={hIdx}
                      className="text-xs sm:text-sm text-[#ECEEF2]/90 leading-relaxed font-mono bg-[#171A21]/60 p-3 rounded-xl border border-[#232732]"
                    >
                      <span className="text-[#10B981] font-bold mr-1">&gt;</span>
                      {hl[locale]}
                    </div>
                  ))}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {project.stack.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-[#171A21] text-[10px] font-mono text-[#8E95A5]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-3 flex lg:flex-col justify-end lg:justify-center items-start lg:items-end gap-2">
                  {project.links.map((link, lIdx) => (
                    <a
                      key={lIdx}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#232732] bg-[#171A21] hover:bg-[#232732] text-[#ECEEF2] text-xs px-3.5 py-2 press-scale transition-colors"
                    >
                      <span>{link.label[locale]}</span>
                      <ArrowSquareOut size={13} weight="bold" />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
