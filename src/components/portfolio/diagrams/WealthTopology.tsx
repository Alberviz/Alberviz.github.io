"use client";

import React from "react";
import { ChartLineUp, DeviceMobile, Receipt, Storefront, TelegramLogo, Waveform } from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import { HOMELAB_WEALTH_SYSTEM } from "@/content/portfolio-data";
import { FlowTopology } from "./FlowTopology";
import { MobileWealthPreview } from "./MobileWealthPreview";

const ICONS = {
  brokers: ChartLineUp,
  business: Storefront,
  krakount: Receipt,
  aurora: TelegramLogo,
  "mobile-app": DeviceMobile,
  "voice-queries": Waveform,
};

const CORE_FACTS = [
  { en: "Isolated Docker bridge", es: "Red Docker aislada" },
  { en: "Encrypted private network", es: "Red privada cifrada" },
  { en: "0 public ports", es: "0 puertos públicos" },
  { en: "Nightly pg_dump backup", es: "Backup pg_dump nocturno" },
] as const;

const LABELS = {
  inputs: { en: "4 live feeds", es: "4 fuentes en vivo" },
  core: { en: "Isolated core", es: "Núcleo aislado" },
  outputs: { en: "2 read-only outputs", es: "2 salidas de solo lectura" },
};

export function WealthTopology() {
  const { locale } = useLocale();
  return (
    <FlowTopology
      flow={HOMELAB_WEALTH_SYSTEM.wealthFlow}
      icons={ICONS}
      coreHost="Raspberry Pi 5"
      coreFacts={CORE_FACTS}
      labels={LABELS}
      defaultId="business"
      renderExtra={(item, side) => (
        <>
          {item.id === "business" && (
            <span className="mt-3 ml-11 inline-flex items-center gap-1.5 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 px-2 py-0.5 font-mono text-[10.5px] text-[#34D399]">
              <span className="size-1.5 rounded-full bg-[#10B981] animate-pulse motion-reduce:animate-none" />
              {locale === "en" ? "Live profit sync" : "Profit en vivo"}
            </span>
          )}
          {side === "out" && item.id === "mobile-app" && <MobileWealthPreview />}
        </>
      )}
    />
  );
}
