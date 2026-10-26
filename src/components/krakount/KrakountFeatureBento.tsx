"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Scan,
  Scales,
  AirplaneTakeoff,
  DeviceMobile,
  Play,
  CheckCircle,
  Eye,
} from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import { KRAKOUNT_PAGE } from "@/content/krakount-data";
import { ASSETS } from "@/content/assets";

export function KrakountFeatureBento() {
  const { locale } = useLocale();

  // Gallery interactive active state
  const [activeGalleryKey, setActiveGalleryKey] = useState<
    "home" | "currency" | "pass" | "settled" | "wrapped" | "video"
  >("home");

  const galleryItems = [
    {
      key: "home" as const,
      label: { en: "Group Expenses", es: "Gastos de Grupo" },
      desc: {
        en: "Home overview in PLN & EUR with instant one-tap expense creation.",
        es: "Vista principal en PLN y EUR con registro de gastos en un toque.",
      },
      asset: ASSETS.krakount.shots.home,
    },
    {
      key: "currency" as const,
      label: { en: "NBP 32 Currencies", es: "32 Divisas NBP" },
      desc: {
        en: "Official National Bank of Poland Table A rates with bank fee offset.",
        es: "Tipos de cambio oficiales del Banco Nacional de Polonia con ajuste de comisión.",
      },
      asset: ASSETS.krakount.shots.currency,
    },
    {
      key: "pass" as const,
      label: { en: "Offline Boarding Pass", es: "Pase de Embarque Offline" },
      desc: {
        en: "High-contrast QR and Aztec barcode generated locally with BWIP-JS.",
        es: "Códigos Aztec y QR de alto contraste renderizados localmente con BWIP-JS.",
      },
      asset: ASSETS.krakount.shots.pass,
    },
    {
      key: "settled" as const,
      label: { en: "Confirmed Settlement", es: "Liquidación Confirmada" },
      desc: {
        en: "Zero-balance state after instant Revolut, Bizum, or BLIK transfers.",
        es: "Estado de saldo cero tras transferencias instantáneas por Revolut, Bizum o BLIK.",
      },
      asset: ASSETS.krakount.shots.settled,
    },
    {
      key: "wrapped" as const,
      label: { en: "Trip Wrapped", es: "Resumen del Viaje" },
      desc: {
        en: "Spending analytics, top contributor breakdown, and shared trip memories.",
        es: "Métricas de gasto del grupo, desglose de pagadores y recuerdos compartidos.",
      },
      asset: ASSETS.krakount.shots.wrapped,
    },
    {
      key: "video" as const,
      label: { en: "Trip Video Tour", es: "Tour de Viajes en Video" },
      desc: {
        en: "Recorded interaction of the offline itinerary and mobile wallet.",
        es: "Grabación real del flujo de itinerario y pases QR sin conexión.",
      },
      isVideo: true,
    },
  ];

  return (
    <section className="py-20 bg-[#0E0F13] border-t border-[#26272F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.02em] text-[#EDEDEF]">
            {locale === "es"
              ? "Arquitectura de Producto: Cuatro Pilares Nativos"
              : "Product Architecture: Four Native Pillars"}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#8B8D98] leading-relaxed">
            {locale === "es"
              ? "Diseñado en Cracovia para resolver los problemas reales de convivencia internacional: tickets de compra complejos, multidivisa sin comisiones ocultas y viajes en grupo sin depender de conexión."
              : "Built in Kraków to solve real international living friction: complex supermarket receipts, true multi-currency settlement, and group travel with zero offline anxiety."}
          </p>
        </div>

        {/* Asymmetric 4-Card Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Card 1: Receipt OCR (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-[#17181E] border border-[#26272F] rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover-elevate overflow-hidden relative group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#1F2027] border border-[#26272F] flex items-center justify-center text-[#F5A524] mb-4">
                <Scan size={22} weight="bold" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#EDEDEF]">
                {KRAKOUNT_PAGE.features[0].title[locale]}
              </h3>
              <p className="mt-3 text-sm sm:text-base text-[#8B8D98] leading-relaxed">
                {KRAKOUNT_PAGE.features[0].body[locale]}
              </p>
            </div>

            {/* Visual stage: Receipt shot + floating share pop */}
            <div className="mt-8 pt-6 border-t border-[#26272F]/60 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              <div className="sm:col-span-7 rounded-xl overflow-hidden border border-[#26272F] bg-[#0E0F13] shadow-lg">
                <Image
                  src={ASSETS.krakount.shots.receipt.src}
                  alt={ASSETS.krakount.shots.receipt.alt[locale]}
                  width={ASSETS.krakount.shots.receipt.width}
                  height={ASSETS.krakount.shots.receipt.height}
                  className="w-full h-auto object-cover max-h-72"
                />
              </div>
              <div className="sm:col-span-5 rounded-xl overflow-hidden border border-[#26272F] bg-[#1F2027] p-2 shadow-lg hover-elevate">
                <div className="text-[10px] font-semibold text-[#8B8D98] mb-1.5 px-1">
                  {locale === "es" ? "Reclamo en Tiempo Real" : "Realtime Claiming"}
                </div>
                <Image
                  src={ASSETS.krakount.pops.share.src}
                  alt={ASSETS.krakount.pops.share.alt[locale]}
                  width={ASSETS.krakount.pops.share.width}
                  height={ASSETS.krakount.pops.share.height}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Honest Balances (lg:col-span-5) */}
          <div className="lg:col-span-5 bg-[#17181E] border border-[#26272F] rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover-elevate overflow-hidden relative group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#1F2027] border border-[#26272F] flex items-center justify-center text-[#3DD68C] mb-4">
                <Scales size={22} weight="bold" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#EDEDEF]">
                {KRAKOUNT_PAGE.features[1].title[locale]}
              </h3>
              <p className="mt-3 text-sm sm:text-base text-[#8B8D98] leading-relaxed">
                {KRAKOUNT_PAGE.features[1].body[locale]}
              </p>
            </div>

            {/* Visual stage: Balances matrix + balance pop */}
            <div className="mt-8 pt-6 border-t border-[#26272F]/60 flex flex-col gap-3">
              <div className="rounded-xl overflow-hidden border border-[#26272F] bg-[#0E0F13] shadow-lg max-h-64">
                <Image
                  src={ASSETS.krakount.shots.balances.src}
                  alt={ASSETS.krakount.shots.balances.alt[locale]}
                  width={ASSETS.krakount.shots.balances.width}
                  height={ASSETS.krakount.shots.balances.height}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Group Trips & Offline Wallet (lg:col-span-5) */}
          <div className="lg:col-span-5 bg-[#17181E] border border-[#26272F] rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover-elevate overflow-hidden relative group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#1F2027] border border-[#26272F] flex items-center justify-center text-[#F5A524] mb-4">
                <AirplaneTakeoff size={22} weight="bold" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#EDEDEF]">
                {KRAKOUNT_PAGE.features[2].title[locale]}
              </h3>
              <p className="mt-3 text-sm sm:text-base text-[#8B8D98] leading-relaxed">
                {KRAKOUNT_PAGE.features[2].body[locale]}
              </p>
            </div>

            {/* Visual stage: Flight card */}
            <div className="mt-8 pt-6 border-t border-[#26272F]/60 flex flex-col gap-3">
              <div className="rounded-xl overflow-hidden border border-[#26272F] bg-[#0E0F13] shadow-lg max-h-64">
                <Image
                  src={ASSETS.krakount.shots.flight.src}
                  alt={ASSETS.krakount.shots.flight.alt[locale]}
                  width={ASSETS.krakount.shots.flight.width}
                  height={ASSETS.krakount.shots.flight.height}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>

          {/* Card 4: Android NotificationListener & MCP (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-[#17181E] border border-[#26272F] rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover-elevate overflow-hidden relative group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#1F2027] border border-[#26272F] flex items-center justify-center text-[#3DD68C] mb-4">
                <DeviceMobile size={22} weight="bold" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#EDEDEF]">
                {KRAKOUNT_PAGE.features[3].title[locale]}
              </h3>
              <p className="mt-3 text-sm sm:text-base text-[#8B8D98] leading-relaxed">
                {KRAKOUNT_PAGE.features[3].body[locale]}
              </p>
            </div>

            {/* Visual stage: Itinerary screenshot + pass pop */}
            <div className="mt-8 pt-6 border-t border-[#26272F]/60 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              <div className="sm:col-span-7 rounded-xl overflow-hidden border border-[#26272F] bg-[#0E0F13] shadow-lg">
                <Image
                  src={ASSETS.krakount.shots.itinerary.src}
                  alt={ASSETS.krakount.shots.itinerary.alt[locale]}
                  width={ASSETS.krakount.shots.itinerary.width}
                  height={ASSETS.krakount.shots.itinerary.height}
                  className="w-full h-auto object-cover max-h-72"
                />
              </div>
              <div className="sm:col-span-5 rounded-xl overflow-hidden border border-[#26272F] bg-[#1F2027] p-2 shadow-lg hover-elevate">
                <div className="text-[10px] font-semibold text-[#8B8D98] mb-1.5 px-1">
                  {locale === "es" ? "Pase Aztec Offline" : "Offline Aztec Pass"}
                </div>
                <Image
                  src={ASSETS.krakount.pops.pass.src}
                  alt={ASSETS.krakount.pops.pass.alt[locale]}
                  width={ASSETS.krakount.pops.pass.width}
                  height={ASSETS.krakount.pops.pass.height}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Screen Gallery Strip */}
        <div className="mt-20 pt-16 border-t border-[#26272F]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-2xl font-extrabold text-[#EDEDEF]">
                {locale === "es"
                  ? "Galería de Producción: Explora Cada Pantalla"
                  : "Production Gallery: Explore Every Screen"}
              </h3>
              <p className="text-xs sm:text-sm text-[#8B8D98] mt-1">
                {locale === "es"
                  ? "Capturas reales en alta resolución de la PWA instalada en iOS y Android."
                  : "Real high-DPI captures of the PWA installed on iOS and Android devices."}
              </p>
            </div>
          </div>

          {/* Interactive Navigation Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
            {galleryItems.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveGalleryKey(item.key)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap press-scale transition-colors ${
                  activeGalleryKey === item.key
                    ? "bg-[#F5A524] text-[#16130A] shadow-md"
                    : "bg-[#17181E] text-[#8B8D98] hover:text-[#EDEDEF] border border-[#26272F]"
                }`}
              >
                {item.isVideo && <Play size={13} weight="fill" />}
                <span>{item.label[locale]}</span>
              </button>
            ))}
          </div>

          {/* Active Screen Display Stage */}
          <div className="mt-6 bg-[#17181E] border border-[#26272F] rounded-2xl p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left Description */}
            <div className="lg:max-w-md">
              {(() => {
                const current =
                  galleryItems.find((i) => i.key === activeGalleryKey) || galleryItems[0];
                return (
                  <div>
                    <span className="text-xs font-mono font-bold text-[#F5A524] uppercase tracking-wider block mb-2">
                      {current.label[locale]}
                    </span>
                    <h4 className="text-xl sm:text-2xl font-bold text-[#EDEDEF]">
                      {current.label[locale]}
                    </h4>
                    <p className="mt-3 text-sm sm:text-base text-[#8B8D98] leading-relaxed">
                      {current.desc[locale]}
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-xs text-[#8B8D98]">
                      <CheckCircle size={16} className="text-[#3DD68C]" weight="bold" />
                      <span>
                        {locale === "es"
                          ? "Verificado en producción con usuarios Erasmus reales"
                          : "Verified in production with real Erasmus users"}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Right Media Stage */}
            <div className="max-w-[320px] w-full bg-[#0E0F13] border border-[#26272F] rounded-[2rem] p-2 shadow-2xl overflow-hidden hover-elevate">
              {activeGalleryKey === "video" ? (
                <video
                  src={ASSETS.krakount.tripMobileLoop.src}
                  poster={ASSETS.krakount.tripMobileLoop.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-auto aspect-[608/1080] object-cover rounded-[1.6rem]"
                  aria-label={ASSETS.krakount.tripMobileLoop.alt[locale]}
                />
              ) : (
                (() => {
                  const current =
                    galleryItems.find((i) => i.key === activeGalleryKey) || galleryItems[0];
                  if (!current.asset) return null;
                  return (
                    <Image
                      src={current.asset.src}
                      alt={current.asset.alt[locale]}
                      width={current.asset.width}
                      height={current.asset.height}
                      className="w-full h-auto aspect-[780/1688] object-cover rounded-[1.6rem]"
                    />
                  );
                })()
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
