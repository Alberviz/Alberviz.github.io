"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  MagnifyingGlass,
  ArrowRight,
  ArrowSquareOut,
  Copy,
  Check,
  Globe,
  FilePdf,
  GithubLogo,
  LinkedinLogo,
  Command,
  X,
} from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import { PROFILE } from "@/content/portfolio-data";

interface PaletteItem {
  id: string;
  title: string;
  category: "Navigation" | "Demos & Links" | "Actions";
  icon: React.ReactNode;
  keywords: string;
  action: () => void;
}

export function CommandPalette() {
  const { locale, toggleLocale } = useLocale();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Global listeners for ⌘K / Ctrl+K and custom event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => {
      setIsOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setCopied(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [isOpen]);

  const copyEmail = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const closePalette = () => {
    setIsOpen(false);
  };

  const items: PaletteItem[] = useMemo(
    () => [
      // Navigation
      {
        id: "nav-krakount",
        title: locale === "en" ? "Jump to Krakount Showcase (/krakount)" : "Ir a Krakount Showcase (/krakount)",
        category: "Navigation",
        icon: <ArrowRight size={16} className="text-[#F5A524]" weight="bold" />,
        keywords: "krakount polish receipt travel ocr expense splitwise kazimierz",
        action: () => {
          closePalette();
          router.push("/krakount");
        },
      },
      {
        id: "nav-work",
        title: locale === "en" ? "Jump to Krakount Spotlight (#work)" : "Ir a Krakount Spotlight (#work)",
        category: "Navigation",
        icon: <ArrowRight size={16} className="text-[#10B981]" weight="bold" />,
        keywords: "work spotlight krakount projects",
        action: () => {
          closePalette();
          const el = document.getElementById("work");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        },
      },
      {
        id: "nav-systems",
        title: locale === "en" ? "Jump to Home Lab & Wealth (#systems)" : "Ir a Home Lab y Finanzas (#systems)",
        category: "Navigation",
        icon: <ArrowRight size={16} className="text-[#10B981]" weight="bold" />,
        keywords: "systems homelab aurora ghostfolio wealth raspberry pi hermes",
        action: () => {
          closePalette();
          const el = document.getElementById("systems");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        },
      },
      {
        id: "nav-studies",
        title: locale === "en" ? "Jump to Systems & Work (#case-studies)" : "Ir a Sistemas y Proyectos (#case-studies)",
        category: "Navigation",
        icon: <ArrowRight size={16} className="text-[#10B981]" weight="bold" />,
        keywords: "studies mycrohnie gargantua shader usb hid drivers hackyeah",
        action: () => {
          closePalette();
          const el = document.getElementById("case-studies");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        },
      },
      {
        id: "nav-background",
        title: locale === "en" ? "Jump to Background & Rigor (#background)" : "Ir a Trayectoria y Rigor (#background)",
        category: "Navigation",
        icon: <ArrowRight size={16} className="text-[#10B981]" weight="bold" />,
        keywords: "background stel order education math olimpiada umu krakow",
        action: () => {
          closePalette();
          const el = document.getElementById("background");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        },
      },
      // Demos & External Links
      {
        id: "link-mycrohnie",
        title: locale === "en" ? "Open Live MyCrohnie App (HackYeah 2026)" : "Abrir App MyCrohnie en Vivo (HackYeah 2026)",
        category: "Demos & Links",
        icon: <ArrowSquareOut size={16} className="text-[#10B981]" weight="bold" />,
        keywords: "mycrohnie crohn hackyeah live vercel app demo",
        action: () => {
          closePalette();
          window.open("https://mycrohnie.vercel.app", "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "link-closhare",
        title: locale === "en" ? "Open Live CloShare PWA (WebGPU AI)" : "Abrir PWA CloShare en Vivo (WebGPU IA)",
        category: "Demos & Links",
        icon: <ArrowSquareOut size={16} className="text-[#10B981]" weight="bold" />,
        keywords: "closhare clothes tricount pwa webgpu live app",
        action: () => {
          closePalette();
          window.open("https://closhare-indol.vercel.app", "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "link-barber",
        title: locale === "en" ? "Open Live Juan Barber Bot Panel" : "Abrir Panel de Juan Barber Bot",
        category: "Demos & Links",
        icon: <ArrowSquareOut size={16} className="text-[#10B981]" weight="bold" />,
        keywords: "barber bot telegram groq whisper booking production",
        action: () => {
          closePalette();
          window.open("https://barber-bot-zeta.vercel.app", "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "link-github",
        title: "Open GitHub Profile (@Alberviz)",
        category: "Demos & Links",
        icon: <GithubLogo size={16} weight="bold" />,
        keywords: "github alberviz code repos source open",
        action: () => {
          closePalette();
          window.open(PROFILE.githubUrl, "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "link-linkedin",
        title: "Open LinkedIn Profile",
        category: "Demos & Links",
        icon: <LinkedinLogo size={16} weight="bold" />,
        keywords: "linkedin profile alberto vizcaino connect",
        action: () => {
          closePalette();
          window.open(PROFILE.linkedinUrl, "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "link-cv",
        title: locale === "en" ? "Download CV (PDF)" : "Descargar CV (PDF)",
        category: "Demos & Links",
        icon: <FilePdf size={16} className="text-[#10B981]" weight="bold" />,
        keywords: "cv resume pdf curriculum vitae download",
        action: () => {
          closePalette();
          window.open(PROFILE.cvPath, "_blank", "noopener,noreferrer");
        },
      },
      // Actions
      {
        id: "action-copy-email",
        title: copied
          ? (locale === "en" ? "Copied albvizpon@gmail.com!" : "¡Copiado albvizpon@gmail.com!")
          : (locale === "en" ? "Copy Email (albvizpon@gmail.com)" : "Copiar Email (albvizpon@gmail.com)"),
        category: "Actions",
        icon: copied ? (
          <Check size={16} className="text-[#10B981]" weight="bold" />
        ) : (
          <Copy size={16} weight="bold" />
        ),
        keywords: "copy email mail contact albvizpon gmail",
        action: () => {
          copyEmail();
        },
      },
      {
        id: "action-toggle-locale",
        title: locale === "en" ? "Switch language to Spanish (ES)" : "Cambiar idioma a Inglés (EN)",
        category: "Actions",
        icon: <Globe size={16} className="text-[#10B981]" weight="bold" />,
        keywords: "language idioma switch english spanish toggle",
        action: () => {
          toggleLocale();
          closePalette();
        },
      },
    ],
    [locale, router, copied, toggleLocale]
  );

  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    const lower = query.toLowerCase().trim();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(lower) ||
        item.keywords.toLowerCase().includes(lower) ||
        item.category.toLowerCase().includes(lower)
    );
  }, [query, items]);

  // Adjust selection bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredItems.length]);

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev <= 0 ? Math.max(0, filteredItems.length - 1) : prev - 1
      );
    } else if (e.key === "Enter" && filteredItems.length > 0) {
      e.preventDefault();
      filteredItems[selectedIndex]?.action();
    }
  };

  // 0ms Raycast Principle: Render nothing when closed, instant mount when open
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#090A0D]/75 backdrop-blur-sm flex items-start justify-center pt-[12vh] sm:pt-[15vh] p-4"
      onClick={closePalette}
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
    >
      <div
        className="w-full max-w-xl bg-[#111318] border border-[#232732] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#232732] bg-[#0E0F13]">
          <MagnifyingGlass size={18} className="text-[#8E95A5] shrink-0" weight="bold" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder={
              locale === "en"
                ? "Type a command, page, or search term..."
                : "Escribe un comando, página o búsqueda..."
            }
            className="w-full bg-transparent text-sm text-[#ECEEF2] placeholder-[#8E95A5] focus:outline-none font-sans"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-[#8E95A5] hover:text-[#ECEEF2] p-1"
              aria-label="Clear query"
            >
              <X size={14} />
            </button>
          )}
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono text-[#8E95A5] bg-[#171A21] border border-[#232732]">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="max-h-80 overflow-y-auto p-2 space-y-1 divide-y-0"
        >
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#8E95A5] font-mono">
              {locale === "en"
                ? "No matching commands or destinations found."
                : "No se encontraron comandos o destinos coincidentes."}
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between gap-3 text-xs sm:text-sm font-sans transition-colors ${
                    isSelected
                      ? "bg-[#171A21] text-[#ECEEF2] border border-[#232732]"
                      : "text-[#8E95A5] hover:text-[#ECEEF2] border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <span className="shrink-0">{item.icon}</span>
                    <span className="truncate font-medium">{item.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#8E95A5] bg-[#090A0D] px-2 py-0.5 rounded shrink-0 border border-[#232732]">
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer Hints */}
        <div className="border-t border-[#232732] px-4 py-2.5 bg-[#0E0F13] flex items-center justify-between text-[11px] font-mono text-[#8E95A5]">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <span className="text-[#10B981]">0ms Instant Response</span>
        </div>
      </div>
    </div>
  );
}
