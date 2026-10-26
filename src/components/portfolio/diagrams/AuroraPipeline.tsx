"use client";

import React from "react";
import Image from "next/image";
import { useLocale } from "@/lib/i18n-context";
import { HOMELAB_WEALTH_SYSTEM } from "@/content/portfolio-data";
import { ASSETS } from "@/content/assets";

const STAGES = [
  {
    title: { en: "Isolated input", es: "Entrada aislada" },
    detail: {
      en: "Telegram voice notes and UMU/AGH mail via IMAP BODY.PEEK, read as inert text.",
      es: "Notas de voz por Telegram y correo UMU/AGH vía IMAP BODY.PEEK, leído como texto inerte.",
    },
  },
  {
    title: { en: "Hermes engine, 24/7", es: "Motor Hermes 24/7" },
    detail: {
      en: "Gemini with automatic DeepSeek fallback, running on the Raspberry Pi 5.",
      es: "Gemini con respaldo automático a DeepSeek, ejecutándose en la Raspberry Pi 5.",
    },
  },
  {
    title: { en: "MCP router", es: "Router MCP" },
    detail: {
      en: "73 Google Workspace tools. Tool discovery cut from >400s to ~15s.",
      es: "73 herramientas de Google Workspace. Descubrimiento reducido de >400s a ~15s.",
    },
  },
  {
    title: { en: "Safe execution", es: "Ejecución segura" },
    detail: {
      en: "My authenticated commands run directly, outbound actions need confirmation, Laura uses the local API.",
      es: "Mis comandos autenticados se ejecutan directos, las acciones externas piden confirmación y Laura usa la API local.",
    },
  },
] as const;

export function AuroraPipeline() {
  const { locale } = useLocale();
  const aurora = HOMELAB_WEALTH_SYSTEM.auroraHighlight;

  return (
    <div>
      <style>{`
        @keyframes aurora-signal { 0% { transform: translateX(-100%); } 70%, 100% { transform: translateX(8rem); } }
        .aurora-signal { animation: aurora-signal 3.6s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .aurora-signal { animation: none; display: none; } }
      `}</style>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        <div className="flex items-start gap-4">
          <Image
            src={ASSETS.aurora.logo.src}
            alt={ASSETS.aurora.logo.alt[locale]}
            width={44}
            height={44}
            className="size-11 shrink-0 rounded-xl border border-[#232732] bg-[#111318] object-contain p-1"
          />
          <div>
            <h3 className="font-display text-2xl font-semibold tracking-[-0.02em] text-[#ECEEF2] sm:text-3xl">
              {aurora.title}
            </h3>
            <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-[#8E95A5] sm:text-base">
              {aurora.summary[locale]}
            </p>
          </div>
        </div>
        <p className="shrink-0 font-mono text-[11px] text-[#8E95A5] lg:pb-1">
          {aurora.badge[locale]}
        </p>
      </div>

      <div className="relative mt-10">
        {/* Desktop signal rail */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-[7px] hidden h-px overflow-hidden bg-[#232732] lg:block"
        >
          <span className="aurora-signal absolute inset-0 block">
            <span className="absolute inset-y-0 right-0 block w-32 bg-gradient-to-r from-transparent via-[#10B981] to-transparent" />
          </span>
        </div>

        <ol className="grid grid-cols-1 gap-y-7 lg:grid-cols-4 lg:gap-x-10">
          {STAGES.map((stage, idx) => (
            <li key={stage.title.en} className="relative pl-8 lg:pl-0">
              {idx < STAGES.length - 1 && (
                <span
                  aria-hidden
                  className="absolute left-[7px] top-[19px] -bottom-7 w-px bg-[#232732] lg:hidden"
                />
              )}
              <span
                aria-hidden
                className="absolute left-0 top-0 grid size-[15px] place-items-center rounded-[4px] border border-[#2C3240] bg-[#090A0D] lg:relative"
              >
                <span className="size-[5px] rounded-[1px] bg-[#10B981]" />
              </span>
              <p className="font-mono text-[11px] tabular-nums text-[#10B981] lg:mt-5">
                {String(idx + 1).padStart(2, "0")}
              </p>
              <h4 className="mt-1 font-display text-base font-medium text-[#ECEEF2]">
                {stage.title[locale]}
              </h4>
              <p className="mt-1.5 max-w-[40ch] text-sm leading-relaxed text-[#8E95A5]">
                {stage.detail[locale]}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
