"use client";

import React, { useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { Play } from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import type { Locale } from "@/lib/i18n-context";
import { KRAKOUNT_PAGE } from "@/content/krakount-data";
import { ASSETS } from "@/content/assets";
import type { MediaAsset } from "@/content/assets";
import { EASE_OUT, SPRING_LAYOUT, SPRING_SNAPPY, revealProps } from "@/lib/motion";

const SHOTS = ASSETS.krakount.shots;

/** Resolves the content layer's shot keys (for example "shotCaptura") to real captures. */
const SHOT_BY_KEY: Record<string, MediaAsset> = {
  shotHome: SHOTS.home,
  shotGroup: SHOTS.group,
  shotCurrency: SHOTS.currency,
  shotItinerary: SHOTS.itinerary,
  shotFlight: SHOTS.flight,
  shotPass: SHOTS.pass,
  shotExpense: SHOTS.expense,
  shotReceipt: SHOTS.receipt,
  shotBalances: SHOTS.balances,
  shotSettled: SHOTS.settled,
  shotWrapped: SHOTS.wrapped,
  shotMisGastos: SHOTS.misGastos,
  shotCaptura: SHOTS.captura,
};

type Variant = { label: Record<Locale, string>; shot: MediaAsset };

/** Two-state screens per feature (toggle inside the cell). */
const VARIANTS: Record<string, Variant[]> = {
  "honest-balances": [
    { label: { en: "Balances", es: "Saldos" }, shot: SHOTS.balances },
    { label: { en: "Settled", es: "Liquidado" }, shot: SHOTS.settled },
  ],
  "group-trips": [
    { label: { en: "Flight", es: "Vuelo" }, shot: SHOTS.flight },
    { label: { en: "Pass", es: "Pase" }, shot: SHOTS.pass },
  ],
};

/** Bento spans: asymmetric 7/5 then 5/7, read as one hairline-ruled sheet. */
const SPANS = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7"];

function Phone({
  shot,
  locale,
  className = "",
}: {
  shot: MediaAsset;
  locale: Locale;
  className?: string;
}) {
  return (
    <div className={`rounded-[30px] border border-[#26272F] bg-[#1F2027] p-[5px] shadow-[0_40px_70px_-30px_rgba(0,0,0,0.95)] ${className}`}>
      <div className="relative aspect-[780/1688] overflow-hidden rounded-[25px] bg-[#0E0F13]">
        <AnimatePresence initial={false}>
          <motion.img
            key={shot.src}
            src={shot.src}
            alt={shot.alt[locale]}
            width={shot.width}
            height={shot.height}
            loading="lazy"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover object-top"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}

function Segmented({
  id,
  options,
  value,
  onChange,
  reduce,
}: {
  id: string;
  options: string[];
  value: number;
  onChange: (index: number) => void;
  reduce: boolean | null;
}) {
  return (
    <LayoutGroup id={id}>
      <div role="tablist" className="inline-flex items-center rounded-full border border-[#26272F] bg-[#0E0F13] p-0.5">
        {options.map((label, i) => {
          const selected = i === value;
          return (
            <button
              key={label}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onChange(i)}
              className={`relative isolate rounded-full px-3 py-1 text-[12px] font-semibold transition-colors duration-150 press-scale ${
                selected ? "text-[#EDEDEF]" : "text-[#8B8D98] hover:text-[#EDEDEF]"
              }`}
            >
              {selected && (
                <motion.span
                  layoutId={`${id}-pill`}
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 rounded-full bg-[#1F2027]"
                  transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                />
              )}
              {label}
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}

function FeatureStage({ featureId, shotKey, locale }: { featureId: string; shotKey: string; locale: Locale }) {
  const reduce = useReducedMotion();
  const [variant, setVariant] = useState(0);
  const [captureFront, setCaptureFront] = useState<"captura" | "misGastos">("misGastos");

  const rise = {
    initial: { opacity: 0, transform: reduce ? "none" : "translateY(48px)" },
    whileInView: { opacity: 1, transform: "translateY(0px)" },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.9, ease: EASE_OUT },
  } as const;

  if (featureId === "receipt-ocr") {
    return (
      <div className="relative flex h-[340px] items-start justify-center overflow-hidden pt-2">
        <motion.div {...rise} className="relative">
          <Phone shot={SHOTS.receipt} locale={locale} className="w-[220px] hover-elevate" />
          <motion.img
            src={ASSETS.krakount.pops.share.src}
            alt={ASSETS.krakount.pops.share.alt[locale]}
            width={ASSETS.krakount.pops.share.width}
            height={ASSETS.krakount.pops.share.height}
            loading="lazy"
            draggable={false}
            className="absolute -right-24 top-24 hidden w-[230px] rounded-2xl border border-[#26272F] shadow-[0_30px_60px_-24px_rgba(0,0,0,0.95)] sm:block"
            initial={{ opacity: 0, transform: reduce ? "none" : "translateY(16px)" }}
            whileInView={{ opacity: 1, transform: "translateY(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.25 }}
          />
        </motion.div>
      </div>
    );
  }

  if (featureId === "android-capture") {
    const phones: { id: "captura" | "misGastos"; shot: MediaAsset; label: Record<Locale, string> }[] = [
      { id: "misGastos", shot: SHOTS.misGastos, label: { en: "Mis gastos", es: "Mis gastos" } },
      { id: "captura", shot: SHOTS.captura, label: { en: "Captura", es: "Captura" } },
    ];
    return (
      <div className="relative h-[340px] overflow-hidden pt-2">
        <motion.div {...rise} className="relative mx-auto h-full w-[220px] -translate-x-[18%]">
          {phones.map((p) => {
            const isFront = captureFront === p.id;
            return (
              <motion.button
                key={p.id}
                type="button"
                onClick={() => setCaptureFront(p.id)}
                aria-pressed={isFront}
                aria-label={p.label[locale]}
                className="absolute left-0 top-0 w-[220px] origin-top text-left"
                style={{ zIndex: isFront ? 2 : 1 }}
                initial={false}
                animate={{
                  transform: isFront
                    ? "translateX(0%) translateY(0%) scale(1)"
                    : "translateX(46%) translateY(5%) scale(0.9)",
                  opacity: isFront ? 1 : 0.55,
                }}
                transition={reduce ? { duration: 0 } : SPRING_SNAPPY}
              >
                <Phone shot={p.shot} locale={locale} />
              </motion.button>
            );
          })}
        </motion.div>
        <div className="pointer-events-none absolute bottom-4 right-4 font-mono text-[10.5px] text-[#8B8D98]">
          {locale === "es" ? "Toca la pantalla de atrás" : "Tap the screen behind"}
        </div>
      </div>
    );
  }

  const variants = VARIANTS[featureId];
  const shot = variants ? variants[variant]?.shot ?? variants[0].shot : SHOT_BY_KEY[shotKey] ?? SHOTS.home;

  return (
    <div className="relative h-[340px] overflow-hidden pt-2">
      {variants && (
        <div className="absolute left-0 top-0 z-10">
          <Segmented
            id={`bento-${featureId}`}
            options={variants.map((v) => v.label[locale])}
            value={variant}
            onChange={setVariant}
            reduce={reduce}
          />
        </div>
      )}
      <motion.div {...rise} className="flex justify-center pt-12">
        <Phone shot={shot} locale={locale} className="w-[220px] hover-elevate" />
      </motion.div>
    </div>
  );
}

type GalleryItem = {
  key: string;
  label: Record<Locale, string>;
  desc: Record<Locale, string>;
  asset: MediaAsset;
  isVideo?: boolean;
};

const GALLERY: GalleryItem[] = [
  {
    key: "home",
    label: { en: "Debt overview", es: "Resumen de tus deudas" },
    desc: {
      en: "Home overview in PLN and EUR with total balances across all your groups.",
      es: "Vista principal en PLN y EUR con el balance total de tus deudas y grupos.",
    },
    asset: SHOTS.home,
  },
  {
    key: "group",
    label: { en: "Group expenses", es: "Gastos de grupo" },
    desc: {
      en: "Shared expenses in Piso Kraków, open supermarket receipts, and per-person balances.",
      es: "Gastos compartidos en Piso Kraków, tickets abiertos del súper y saldos por persona.",
    },
    asset: SHOTS.group,
  },
  {
    key: "currency",
    label: { en: "32 currencies", es: "32 divisas" },
    desc: {
      en: "Market and Revolut rates with an optional +1% bank fee, NBP as fallback.",
      es: "Tipos de mercado y Revolut con +1% bancario opcional, NBP como respaldo.",
    },
    asset: SHOTS.currency,
  },
  {
    key: "expense",
    label: { en: "Split expense", es: "Dividir gasto" },
    desc: { en: "Per-person share calculated in exact minor units.", es: "Parte por persona calculada en céntimos exactos." },
    asset: SHOTS.expense,
  },
  {
    key: "misGastos",
    label: { en: "Mis gastos", es: "Mis gastos" },
    desc: { en: "Personal monthly budget rhythm and category progress in PLN.", es: "Ritmo de gasto mensual personal y progreso por categoría en PLN." },
    asset: SHOTS.misGastos,
  },
  {
    key: "captura",
    label: { en: "Captura & Bizum", es: "Captura y Bizum" },
    desc: {
      en: "Kotlin notification listener: captures card payments and auto-settles debts when receiving a Bizum.",
      es: "Lector de notificaciones en Kotlin: captura pagos de tarjeta y salda deudas al recibir un Bizum.",
    },
    asset: SHOTS.captura,
  },
  {
    key: "itinerary",
    label: { en: "Trip timeline", es: "Itinerario" },
    desc: { en: "Flights, lodging, and activities on one group timeline.", es: "Vuelos, alojamiento y actividades en un único cronograma." },
    asset: SHOTS.itinerary,
  },
  {
    key: "pass",
    label: { en: "Offline pass", es: "Pase offline" },
    desc: { en: "High-contrast QR and Aztec codes rendered locally with BWIP-JS.", es: "Códigos QR y Aztec de alto contraste generados en local con BWIP-JS." },
    asset: SHOTS.pass,
  },
  {
    key: "settled",
    label: { en: "Settled", es: "Liquidado" },
    desc: { en: "Zero balance after Revolut, Bizum, or BLIK transfers.", es: "Saldo cero tras transferencias por Revolut, Bizum o BLIK." },
    asset: SHOTS.settled,
  },
  {
    key: "wrapped",
    label: { en: "Trip wrapped", es: "Resumen del viaje" },
    desc: { en: "Spending analytics and top contributor for the whole trip.", es: "Métricas de gasto y mayor pagador de todo el viaje." },
    asset: SHOTS.wrapped,
  },
  {
    key: "video",
    label: { en: "Trip flow video", es: "Vídeo de viaje" },
    desc: { en: "Recorded interaction of the offline itinerary and wallet.", es: "Grabación real del itinerario y la cartera offline." },
    asset: ASSETS.krakount.tripPoster,
    isVideo: true,
  },
];

function ScreenGallery({ locale }: { locale: Locale }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const current = GALLERY[active] ?? GALLERY[0];

  return (
    <div id="gallery" className="mt-24 scroll-mt-20 border-t border-[#26272F] pt-16">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
        <motion.h3
          {...revealProps(reduce)}
          className="text-balance text-[clamp(1.5rem,2.6vw,2rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#EDEDEF] lg:col-span-5"
        >
          {locale === "es" ? "Cada pantalla, sacada de producción." : "Every screen, straight from production."}
        </motion.h3>
        <div className="min-h-[72px] lg:col-span-7" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.key}
              initial={{ opacity: 0, transform: reduce ? "none" : "translateY(6px)" }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
            >
              <p className="font-mono text-[11px] tabular-nums text-[#8B8D98]">
                {String(active + 1).padStart(2, "0")} / {String(GALLERY.length).padStart(2, "0")}
              </p>
              <p className="mt-1 text-[15px] font-semibold text-[#EDEDEF]">{current.label[locale]}</p>
              <p className="mt-1 max-w-[60ch] text-[14px] leading-relaxed text-[#8B8D98]">{current.desc[locale]}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <LayoutGroup id="krakount-gallery">
        <div className="no-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          {GALLERY.map((item, i) => {
            const selected = i === active;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={selected}
                aria-label={item.label[locale]}
                className="group relative w-[150px] shrink-0 snap-start text-left sm:w-[170px]"
              >
                <div
                  className={`relative rounded-[24px] border bg-[#17181E] p-1 transition-[border-color,opacity] duration-200 ${
                    selected ? "border-[#F5A524]/70" : "border-[#26272F] opacity-70 group-hover:opacity-100"
                  }`}
                >
                  <div className="relative aspect-[780/1688] overflow-hidden rounded-[20px] bg-[#0E0F13]">
                    {item.isVideo && selected ? (
                      <video
                        src={ASSETS.krakount.tripMobileLoop.src}
                        poster={ASSETS.krakount.tripMobileLoop.poster}
                        width={ASSETS.krakount.tripMobileLoop.width}
                        height={ASSETS.krakount.tripMobileLoop.height}
                        autoPlay
                        muted
                        loop
                        playsInline
                        aria-label={ASSETS.krakount.tripMobileLoop.alt[locale]}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <img
                        src={item.asset.src}
                        alt={item.asset.alt[locale]}
                        width={item.asset.width}
                        height={item.asset.height}
                        loading="lazy"
                        draggable={false}
                        className="absolute inset-0 h-full w-full object-cover object-top"
                      />
                    )}
                    {item.isVideo && !selected && (
                      <span className="absolute inset-0 grid place-items-center bg-[#0E0F13]/40">
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#F5A524] text-[#16130A]">
                          <Play size={14} weight="fill" aria-hidden="true" />
                        </span>
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 px-1">
                  {selected && (
                    <motion.span
                      layoutId="krakount-gallery-dot"
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-[#F5A524]"
                      transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                    />
                  )}
                  <span className={`truncate text-[12.5px] font-semibold ${selected ? "text-[#EDEDEF]" : "text-[#8B8D98]"}`}>
                    {item.label[locale]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </LayoutGroup>
    </div>
  );
}

export function KrakountFeatureBento() {
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const es = locale === "es";

  return (
    <div id="features" className="scroll-mt-16 border-t border-[#26272F] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div {...revealProps(reduce)} className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
          <h2 className="text-balance text-[clamp(1.9rem,3.4vw,2.75rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-[#EDEDEF] lg:col-span-6">
            {es ? "Cuatro piezas, una app a una mano." : "Four pieces, one thumb-driven app."}
          </h2>
          <p className="max-w-[60ch] text-pretty text-[15px] leading-relaxed text-[#8B8D98] lg:col-span-6">
            {es
              ? "Diseñada en Cracovia para la fricción real de vivir fuera: tickets del súper complejos, deudas en varias divisas y viajes en grupo sin depender de la cobertura."
              : "Built in Kraków for the real friction of living abroad: dense supermarket receipts, debts across currencies, and group trips that cannot depend on signal."}
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[#26272F] bg-[#26272F] lg:grid-cols-12">
          {KRAKOUNT_PAGE.features.map((feature, idx) => (
            <motion.article
              key={feature.id}
              {...revealProps(reduce, 0.05 * (idx % 2))}
              className={`flex flex-col bg-[#0E0F13] px-6 pt-8 sm:px-8 sm:pt-10 ${SPANS[idx] ?? "lg:col-span-6"}`}
            >
              <h3 className="text-[1.3rem] font-bold leading-snug tracking-[-0.02em] text-[#EDEDEF]">
                {feature.title[locale]}
              </h3>
              <p className="mt-3 max-w-[58ch] text-[14.5px] leading-relaxed text-[#8B8D98]">{feature.body[locale]}</p>
              <div className="mt-8">
                <FeatureStage featureId={feature.id} shotKey={feature.shotKey} locale={locale} />
              </div>
            </motion.article>
          ))}
        </div>

        <ScreenGallery locale={locale} />
      </div>
    </div>
  );
}
