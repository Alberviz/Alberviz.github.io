"use client";

import React, { useEffect, useRef, useState } from "react";
import {AnimatePresence, motion} from "motion/react";
import { ArrowUpRight, Check, Copy } from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import { CONTACT } from "@/content/site-copy";
import { PROFILE } from "@/content/portfolio-data";
import { CV_PATH, EMAIL, GITHUB_URL, LINKEDIN_URL, WARI_URL } from "@/content/links";
import { SPRING_SNAPPY, useReducedMotionSafe } from "@/lib/motion";

export function PortfolioFooter() {
  const { locale } = useLocale();
  const reduce = useReducedMotionSafe();
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
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
    { label: "GitHub", href: GITHUB_URL },
    { label: "LinkedIn", href: LINKEDIN_URL },
    { label: CONTACT.cv[locale], href: CV_PATH },
  ];

  const linkClass =
    "inline-flex items-center gap-1.5 text-[15px] text-muted transition-colors duration-150 hover:text-ink focus-visible:text-ink";

  return (
    <footer
      id="contacto"
      data-scene="contact"
      className="footer-horizon relative isolate overflow-hidden border-t border-line bg-bg pb-32 pt-[var(--spacing-section)] md:pb-10"
    >
      <div aria-hidden="true" className="grain pointer-events-none absolute inset-0 -z-10" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <h2 className="font-display text-balance text-[clamp(2rem,4.4vw,3.5rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-ink">
          {CONTACT.heading[locale]}
        </h2>
        <p className="mt-4 max-w-[48ch] text-pretty text-base leading-relaxed text-muted sm:text-lg">
          {CONTACT.sub[locale]}
        </p>

        {/* The email is the call to action: big, a real mailto, and one tap to copy */}
        <div className="mt-12 flex flex-col items-start gap-5 sm:mt-14">
          <a
            href={`mailto:${EMAIL}`}
            className="link-rule font-display text-[clamp(1.4rem,7vw,4.4rem)] font-semibold leading-none tracking-[-0.035em] text-ink transition-colors duration-150 hover:text-accent"
          >
            {EMAIL}
          </a>
          <button
            type="button"
            onClick={copyEmail}
            className="press-scale inline-flex h-11 items-center gap-2.5 rounded-full border border-ink/20 px-5 text-sm font-medium text-ink transition-colors duration-150 hover:border-ink/45"
          >
            <span className="relative grid size-4 place-items-center">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.span
                  key={copied ? "check" : "copy"}
                  className="grid place-items-center"
                  {...swap}
                  transition={SPRING_SNAPPY}
                >
                  {copied ? <Check size={16} weight="bold" className="text-accent" /> : <Copy size={16} />}
                </motion.span>
              </AnimatePresence>
            </span>
            {/* Both labels share one grid cell so the button never changes width */}
            <span className="grid [grid-template-areas:'label']">
              <span
                aria-hidden={copied}
                className={`[grid-area:label] transition-opacity duration-150 ${copied ? "opacity-0" : "opacity-100"}`}
              >
                {CONTACT.copy[locale]}
              </span>
              <span
                aria-hidden={!copied}
                className={`[grid-area:label] text-accent transition-opacity duration-150 ${copied ? "opacity-100" : "opacity-0"}`}
              >
                {CONTACT.copied[locale]}
              </span>
            </span>
            <span className="sr-only" aria-live="polite">
              {copied ? CONTACT.copied[locale] : ""}
            </span>
          </button>
        </div>

        <nav aria-label={locale === "es" ? "Enlaces" : "Links"} className="mt-12">
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-3">
            {links.map((link) => (
              <li key={link.label}>
                <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {link.label}
                  <ArrowUpRight size={13} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-20 flex flex-col gap-3 border-t border-line pt-6 text-[13px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            {CONTACT.signature[locale]}
            <span aria-hidden="true" className="mx-2 text-line">
              /
            </span>
            <a
              href={WARI_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="link-rule text-ink"
            >
              {CONTACT.signatureLink[locale]}
            </a>
          </p>
          <p className="font-mono text-[11px]">{PROFILE.currentLocation[locale]}</p>
        </div>
      </div>
    </footer>
  );
}
