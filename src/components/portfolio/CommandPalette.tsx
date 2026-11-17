"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { usePathname, useRouter } from "next/navigation";
import { CV_PATH, EMAIL, GITHUB_URL, LINKEDIN_URL, WARI_URL } from "@/content/links";
import { CASES, HOME_SECTIONS } from "@/content/pages";

type Category = "pages" | "navigate" | "links" | "actions";

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
  pages: { en: "Pages", es: "Páginas" },
  navigate: { en: "Sections", es: "Secciones" },
  links: { en: "Demos and links", es: "Demos y enlaces" },
  actions: { en: "Actions", es: "Acciones" },
};

function scrollToSection(id: string) {
  const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(id)?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
}

const norm = (p: string) => (p.endsWith("/") ? p : `${p}/`);

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
  const pathname = usePathname();

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
    const here = norm(pathname || "/");
    /** Same page: scroll. Another page: a client navigation (the language and the bar persist). */
    const go = (path: string, hash?: string) => {
      close();
      if (norm(path) === here) {
        if (hash) scrollToSection(hash);
        else window.scrollTo({ top: 0, behavior: "auto" });
      } else {
        router.push(hash ? `${path}#${hash}` : path);
      }
    };
    const pageItem = (id: string, path: string, title: string, keywords: string): PaletteItem => ({
      id: `page-${id}`,
      title,
      hint: path,
      category: "pages",
      icon: <ArrowRight size={15} aria-hidden="true" />,
      keywords,
      action: () => go(path),
    });
    const sectionItem = (path: string, id: string, title: string, keywords: string): PaletteItem => ({
      id: `nav-${path}-${id}`,
      title,
      hint: `${path === "/" ? "" : path.replace(/\/$/, "")}#${id}`,
      category: "navigate",
      icon: <ArrowRight size={15} aria-hidden="true" />,
      keywords,
      action: () => go(path, id),
    });

    return [
      pageItem("home", "/", es ? "Inicio" : "Home", "home inicio start hero"),
      ...CASES.map((c) => pageItem(c.id, c.path, `${c.name}: ${c.headline[locale]}`, c.keywords)),
      ...HOME_SECTIONS.filter((x) => x.id !== "hero").map((x) => sectionItem("/", x.id, x.title[locale], x.keywords)),
      ...CASES.flatMap((c) => c.sections.filter((x) => x.id !== c.id).map((x) => sectionItem(c.path, x.id, x.title[locale], x.keywords))),
      {
        id: "nav-contact",
        title: es ? "Contacto" : "Contact",
        hint: "#contacto",
        category: "navigate",
        icon: <ArrowRight size={15} aria-hidden="true" />,
        keywords: "contact contacto footer email",
        action: () => {
          close();
          scrollToSection("contacto");
        },
      },
      {
        id: "route-wari",
        title: es ? "Abrir la web de Wari" : "Open the Wari website",
        hint: "wariapp.es",
        category: "links",
        icon: <ArrowSquareOut size={15} className="text-accent" aria-hidden="true" />,
        keywords: "wari warikan web website app pwa",
        action: () => {
          close();
          openExternal(WARI_URL);
        },
      },
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
        title: es ? "Panel de Barber Bot" : "Barber Bot panel",
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
          openExternal(GITHUB_URL);
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
          openExternal(LINKEDIN_URL);
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
          openExternal(CV_PATH);
        },
      },
      {
        id: "action-copy-email",
        title: copied ? (es ? "Email copiado" : "Email copied") : es ? "Copiar email" : "Copy email",
        hint: EMAIL,
        category: "actions",
        icon: copied ? (
          <Check size={15} className="text-accent" aria-hidden="true" />
        ) : (
          <Copy size={15} aria-hidden="true" />
        ),
        keywords: "copy email mail contact",
        action: () => {
          navigator.clipboard?.writeText(EMAIL).then(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, copied, toggleLocale, pathname]);

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
      className="fixed inset-0 z-50 flex items-start justify-center bg-[#07080B]/70 p-4 pt-[14vh]"
      onMouseDown={close}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={locale === "es" ? "Paleta de comandos" : "Command palette"}
        className="flex w-full max-w-[560px] flex-col overflow-hidden rounded-2xl border border-[#1F232D] bg-[#0E1015] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.95)]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-[#1F232D] px-4">
          <MagnifyingGlass size={16} className="shrink-0 text-[#7B8190]" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder={locale === "es" ? "Busca una sección, demo o acción" : "Search a section, demo, or action"}
            className="h-12 w-full bg-transparent text-[14px] text-[#ECEDF0] placeholder:text-[#7B8190] focus:outline-none focus-visible:outline-none"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-palette-list"
            aria-activedescendant={filteredItems[selectedIndex] ? `cmd-${filteredItems[selectedIndex].id}` : undefined}
          />
          <kbd className="rounded-md border border-[#1F232D] px-1.5 py-0.5 font-mono text-[10px] text-[#8A8F9C]">Esc</kbd>
        </div>

        <div ref={listRef} id="command-palette-list" role="listbox" className="max-h-[360px] overflow-y-auto p-1.5">
          {groups.length === 0 ? (
            <p className="px-3 py-10 text-center text-[13px] text-[#8A8F9C]">
              {locale === "es" ? "Nada coincide con esa búsqueda." : "Nothing matches that search."}
            </p>
          ) : (
            groups.map((group) => (
              <div key={group.category} className="pb-1">
                <p className="px-3 pb-1 pt-2.5 font-mono text-[10.5px] text-[#7B8190]">
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
                        isSelected ? "bg-[#151820] text-[#ECEDF0]" : "text-[#B4BAC6]"
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span className={isSelected ? "text-[#ECEDF0]" : "text-[#7B8190]"}>{item.icon}</span>
                        <span className="truncate">{item.title}</span>
                      </span>
                      {item.hint && <span className="shrink-0 font-mono text-[11px] text-[#7B8190]">{item.hint}</span>}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="flex items-center gap-4 border-t border-[#1F232D] px-4 py-2.5 font-mono text-[10.5px] text-[#7B8190]">
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
