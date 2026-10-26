"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowElbowDownLeft,
  ArrowRight,
  ArrowSquareOut,
  ArrowUp,
  Check,
  Copy,
  FilePdf,
  GithubLogo,
  Globe,
  LinkedinLogo,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import type { Locale } from "@/lib/i18n-context";
import { PROFILE } from "@/content/portfolio-data";

type Category = "navigate" | "links" | "actions";

interface PaletteItem {
  id: string;
  title: string;
  hint?: string;
  category: Category;
  icon: React.ReactNode;
  keywords: string;
  action: () => void;
}

const CATEGORY_LABEL: Record<Category, Record<Locale, string>> = {
  navigate: { en: "Navigate", es: "Navegar" },
  links: { en: "Demos and links", es: "Demos y enlaces" },
  actions: { en: "Actions", es: "Acciones" },
};

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function openExternal(href: string) {
  window.open(href, "_blank", "noopener,noreferrer");
}

/**
 * Command menu. Opened by keyboard dozens of times a day, so it has zero
 * open/close animation (Raycast principle): it mounts and unmounts instantly.
 */
export function CommandPalette() {
  const { locale, toggleLocale } = useLocale();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    const handleCustomOpen = () => setIsOpen(true);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleCustomOpen);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      returnFocusRef.current = document.activeElement as HTMLElement | null;
      setQuery("");
      setSelectedIndex(0);
      setCopied(false);
      inputRef.current?.focus();
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previousOverflow;
        returnFocusRef.current?.focus?.();
      };
    }
  }, [isOpen]);

  const close = () => setIsOpen(false);

  const items: PaletteItem[] = useMemo(() => {
    const es = locale === "es";
    const nav = (id: string, title: string, keywords: string): PaletteItem => ({
      id: `nav-${id}`,
      title,
      hint: `#${id}`,
      category: "navigate",
      icon: <ArrowRight size={15} aria-hidden="true" />,
      keywords,
      action: () => {
        close();
        scrollToSection(id);
      },
    });

    return [
      {
        id: "route-krakount",
        title: es ? "Abrir la página de Krakount" : "Open the Krakount page",
        hint: "/krakount",
        category: "navigate",
        icon: <ArrowRight size={15} className="text-[#F5A524]" aria-hidden="true" />,
        keywords: "krakount receipt ocr expenses split trips kazimierz pwa",
        action: () => {
          close();
          router.push("/krakount/");
        },
      },
      nav("work", es ? "Krakount en resumen" : "Krakount spotlight", "work spotlight krakount flagship"),
      nav("systems", es ? "Patrimonio en la Raspberry Pi" : "Wealth on the Raspberry Pi", "systems homelab aurora ghostfolio wealth raspberry pi"),
      nav("health", es ? "Hub de salud" : "Health hub", "health salud gym opengym amazfit gts2 watch reloj telegram comidas creatina"),
      nav("desktop", es ? "Escritorio Linux con IA" : "AI Linux desktop", "desktop linux hyprland quickshell caelestia gargantua laura shader webgl rgb hidraw reverse engineering cuerpo"),
      nav("case-studies", es ? "Proyectos seleccionados" : "Selected work", "work mycrohnie hackyeah closhare barber applied ai"),
      nav("background", es ? "Trayectoria" : "Background", "background stel order education olympiad umu agh"),
      {
        id: "link-mycrohnie",
        title: es ? "MyCrohnie en vivo" : "MyCrohnie live app",
        category: "links",
        icon: <ArrowSquareOut size={15} aria-hidden="true" />,
        keywords: "mycrohnie crohn hackyeah live demo",
        action: () => {
          close();
          openExternal("https://mycrohnie.vercel.app");
        },
      },
      {
        id: "link-closhare",
        title: es ? "CloShare en vivo" : "CloShare live app",
        category: "links",
        icon: <ArrowSquareOut size={15} aria-hidden="true" />,
        keywords: "closhare wardrobe pwa webgpu live",
        action: () => {
          close();
          openExternal("https://closhare-indol.vercel.app");
        },
      },
      {
        id: "link-barber",
        title: es ? "Panel de Juan Barber Bot" : "Juan Barber Bot panel",
        category: "links",
        icon: <ArrowSquareOut size={15} aria-hidden="true" />,
        keywords: "barber bot telegram booking production",
        action: () => {
          close();
          openExternal("https://barber-bot-zeta.vercel.app");
        },
      },
      {
        id: "link-github",
        title: "GitHub",
        hint: "@Alberviz",
        category: "links",
        icon: <GithubLogo size={15} aria-hidden="true" />,
        keywords: "github code repos source",
        action: () => {
          close();
          openExternal(PROFILE.githubUrl);
        },
      },
      {
        id: "link-linkedin",
        title: "LinkedIn",
        category: "links",
        icon: <LinkedinLogo size={15} aria-hidden="true" />,
        keywords: "linkedin profile connect",
        action: () => {
          close();
          openExternal(PROFILE.linkedinUrl);
        },
      },
      {
        id: "link-cv",
        title: es ? "Descargar CV" : "Download CV",
        hint: "PDF",
        category: "links",
        icon: <FilePdf size={15} aria-hidden="true" />,
        keywords: "cv resume pdf curriculum",
        action: () => {
          close();
          openExternal(PROFILE.cvPath);
        },
      },
      {
        id: "action-copy-email",
        title: copied ? (es ? "Email copiado" : "Email copied") : es ? "Copiar email" : "Copy email",
        hint: PROFILE.email,
        category: "actions",
        icon: copied ? (
          <Check size={15} className="text-[#10B981]" aria-hidden="true" />
        ) : (
          <Copy size={15} aria-hidden="true" />
        ),
        keywords: "copy email mail contact",
        action: () => {
          navigator.clipboard?.writeText(PROFILE.email).then(() => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1800);
          });
        },
      },
      {
        id: "action-toggle-locale",
        title: es ? "Switch to English" : "Cambiar a español",
        hint: es ? "EN" : "ES",
        category: "actions",
        icon: <Globe size={15} aria-hidden="true" />,
        keywords: "language idioma english spanish",
        action: () => {
          toggleLocale();
          close();
        },
      },
    ];
  }, [locale, router, copied, toggleLocale]);

  const filteredItems = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.keywords.includes(q) ||
        (item.hint ?? "").toLowerCase().includes(q)
    );
  }, [query, items]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${selectedIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex, isOpen]);

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    const count = filteredItems.length;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (count ? (prev + 1) % count : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (count ? (prev - 1 + count) % count : 0));
    } else if (e.key === "Enter" && count > 0) {
      e.preventDefault();
      filteredItems[selectedIndex]?.action();
    } else if (e.key === "Tab") {
      e.preventDefault();
    }
  };

  if (!isOpen) return null;

  let runningIndex = -1;
  const groups = (Object.keys(CATEGORY_LABEL) as Category[])
    .map((category) => ({ category, entries: filteredItems.filter((i) => i.category === category) }))
    .filter((g) => g.entries.length > 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-[#090A0D]/70 p-4 pt-[14vh]"
      onMouseDown={close}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={locale === "es" ? "Paleta de comandos" : "Command palette"}
        className="flex w-full max-w-[560px] flex-col overflow-hidden rounded-2xl border border-[#232732] bg-[#0F1115] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.95)]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-[#232732] px-4">
          <MagnifyingGlass size={16} className="shrink-0 text-[#5D6474]" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder={locale === "es" ? "Busca una sección, demo o acción" : "Search a section, demo, or action"}
            className="h-12 w-full bg-transparent text-[14px] text-[#ECEEF2] placeholder:text-[#5D6474] focus:outline-none focus-visible:outline-none"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-palette-list"
            aria-activedescendant={filteredItems[selectedIndex] ? `cmd-${filteredItems[selectedIndex].id}` : undefined}
          />
          <kbd className="rounded-md border border-[#232732] px-1.5 py-0.5 font-mono text-[10px] text-[#8E95A5]">Esc</kbd>
        </div>

        <div ref={listRef} id="command-palette-list" role="listbox" className="max-h-[360px] overflow-y-auto p-1.5">
          {groups.length === 0 ? (
            <p className="px-3 py-10 text-center text-[13px] text-[#8E95A5]">
              {locale === "es" ? "Nada coincide con esa búsqueda." : "Nothing matches that search."}
            </p>
          ) : (
            groups.map((group) => (
              <div key={group.category} className="pb-1">
                <p className="px-3 pb-1 pt-2.5 font-mono text-[10.5px] text-[#5D6474]">
                  {CATEGORY_LABEL[group.category][locale]}
                </p>
                {group.entries.map((item) => {
                  runningIndex += 1;
                  const idx = runningIndex;
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      id={`cmd-${item.id}`}
                      data-index={idx}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={item.action}
                      onMouseMove={() => setSelectedIndex(idx)}
                      className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-[13.5px] ${
                        isSelected ? "bg-[#171A21] text-[#ECEEF2]" : "text-[#B4BAC6]"
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span className={isSelected ? "text-[#ECEEF2]" : "text-[#5D6474]"}>{item.icon}</span>
                        <span className="truncate">{item.title}</span>
                      </span>
                      {item.hint && <span className="shrink-0 font-mono text-[11px] text-[#5D6474]">{item.hint}</span>}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="flex items-center gap-4 border-t border-[#232732] px-4 py-2.5 font-mono text-[10.5px] text-[#5D6474]">
          <span className="inline-flex items-center gap-1">
            <ArrowUp size={11} aria-hidden="true" />
            <ArrowDown size={11} aria-hidden="true" />
            {locale === "es" ? "mover" : "move"}
          </span>
          <span className="inline-flex items-center gap-1">
            <ArrowElbowDownLeft size={11} aria-hidden="true" />
            {locale === "es" ? "abrir" : "open"}
          </span>
          <span className="ml-auto">Ctrl / Cmd K</span>
        </div>
      </div>
    </div>
  );
}
