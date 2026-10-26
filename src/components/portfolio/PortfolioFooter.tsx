"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight, Check, Copy } from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import { PROFILE } from "@/content/portfolio-data";
import { SPRING_SNAPPY } from "@/lib/motion";

export function PortfolioFooter() {
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
    } catch {
      return;
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
  };

  const swap = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, transform: "translateY(6px) scale(0.96)" },
        animate: { opacity: 1, transform: "translateY(0px) scale(1)" },
        exit: { opacity: 0, transform: "translateY(-6px) scale(0.96)" },
      };

  const links = [
    { label: "CV (PDF)", href: PROFILE.cvPath, external: true },
    { label: "Krakount", href: "/krakount/", external: false },
    { label: "GitHub", href: PROFILE.githubUrl, external: true },
    { label: "LinkedIn", href: PROFILE.linkedinUrl, external: true },
  ];

  const linkClass =
    "inline-flex items-center gap-1 text-sm text-[#8E95A5] transition-colors duration-150 hover:text-[#ECEEF2] focus-visible:outline-none focus-visible:text-[#ECEEF2] focus-visible:underline underline-offset-4";

  return (
    <footer
      id="contact"
      data-scene="contact"
      className="bg-[#090A0D] pt-16 sm:pt-24 pb-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.02em] leading-[1.05] text-[#ECEEF2]">
              {locale === "en"
                ? "Open to founding teams and hard problems."
                : "Abierto a equipos fundadores y problemas difíciles."}
            </h2>
            <p className="mt-4 max-w-[52ch] text-base sm:text-lg leading-relaxed text-[#8E95A5]">
              {locale === "en"
                ? "Fellowships, early-stage startups and engineering that needs rigorous math, systems depth and full ownership."
                : "Fellowships, startups en fase temprana e ingeniería que exija rigor matemático, sistemas y propiedad completa."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <a
              href={`mailto:${PROFILE.email}`}
              className="press-scale inline-flex items-center gap-2 rounded-full bg-[#10B981] px-5 py-3 text-sm font-semibold text-[#04130D] hover:bg-[#059669] sm:text-[15px]"
            >
              {PROFILE.nav.cta[locale]}
              <ArrowRight size={16} weight="bold" />
            </a>

            <button
              type="button"
              onClick={copyEmail}
              aria-label={locale === "en" ? `Copy ${PROFILE.email}` : `Copiar ${PROFILE.email}`}
              className="press-scale inline-flex items-center gap-2.5 rounded-full border border-[#232732] bg-[#111318] px-5 py-3 text-[#ECEEF2] hover:bg-[#171A21]"
            >
              <span className="relative grid size-4 place-items-center">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.span
                    key={copied ? "check" : "copy"}
                    className="grid place-items-center"
                    {...swap}
                    transition={SPRING_SNAPPY}
                  >
                    {copied ? (
                      <Check size={16} weight="bold" className="text-[#10B981]" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </motion.span>
                </AnimatePresence>
              </span>
              {/* Both labels share one grid cell so the button never changes width */}
              <span className="grid font-mono text-xs sm:text-sm [grid-template-areas:'label']">
                <span
                  aria-hidden={copied}
                  className={`[grid-area:label] transition-opacity duration-150 ${copied ? "opacity-0" : "opacity-100"}`}
                >
                  {PROFILE.email}
                </span>
                <span
                  aria-hidden={!copied}
                  className={`[grid-area:label] text-[#10B981] transition-opacity duration-150 ${copied ? "opacity-100" : "opacity-0"}`}
                >
                  {locale === "en" ? "Copied" : "Copiado"}
                </span>
              </span>
              <span className="sr-only" aria-live="polite">
                {copied ? (locale === "en" ? "Email copied" : "Email copiado") : ""}
              </span>
            </button>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-5 border-t border-[#232732] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#8E95A5]">
            <span className="font-medium text-[#ECEEF2]">{PROFILE.fullName}</span>
            <span className="mx-2 text-[#2C3240]">/</span>
            {PROFILE.currentLocation[locale]}
          </p>

          <nav aria-label={locale === "en" ? "Footer" : "Pie de página"}>
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {links.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                      {link.label}
                      <ArrowUpRight size={12} />
                    </a>
                  ) : (
                    <Link href={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
