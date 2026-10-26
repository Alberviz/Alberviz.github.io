"use client";

import React from "react";
import { Barbell, FileText, ForkKnife, HandTap, Heartbeat, Planet, TelegramLogo, Watch } from "@phosphor-icons/react";
import { HEALTH_SYSTEM } from "@/content/portfolio-data";
import { FlowTopology } from "./FlowTopology";

const ICONS = {
  watch: Watch,
  meals: ForkKnife,
  mando: HandTap,
  opengym: Barbell,
  coach: TelegramLogo,
  report: FileText,
  planet: Planet,
};

const CORE_FACTS = [
  { en: "Read-only API, DB mounted :ro", es: "API de solo lectura, BD en :ro" },
  { en: "Login lockout after 10 fails", es: "Bloqueo tras 10 fallos" },
  { en: "Nightly backup, 14 days", es: "Backup nocturno, 14 días" },
  { en: "Multi-user Telegram bot", es: "Bot de Telegram multiusuario" },
] as const;

const LABELS = {
  inputs: { en: "4 inputs", es: "4 entradas" },
  core: { en: "One hub", es: "Un único hub" },
  outputs: { en: "3 outputs", es: "3 salidas" },
};

export function HealthTopology() {
  return (
    <FlowTopology
      flow={HEALTH_SYSTEM.flow}
      icons={ICONS}
      coreIcon={Heartbeat}
      coreHost="Raspberry Pi 5"
      coreFacts={CORE_FACTS}
      labels={LABELS}
      defaultId="watch"
    />
  );
}
