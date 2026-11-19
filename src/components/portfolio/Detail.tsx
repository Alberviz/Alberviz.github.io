"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { Plus } from "@phosphor-icons/react";

/**
 * "See the detail": the third layer of a case page. The summary stays on screen and
 * everything a technical reader wants sits behind one tap. The content is always in
 * the DOM (find-in-page and anchors keep working); it is only hidden, and only below
 * 1024 px (a class, not the hidden attribute: Tailwind forces that one to display
 * none). From 1024 px up it is simply shown (CSS only: no toggle, no flash). An anchor that points inside
 * it opens it. No height animation: it appears with a short fade (none under
 * reduced motion).
 */
export function Detail({
  label,
  closeLabel,
  className = "",
  children,
}: {
  label: string;
  closeLabel: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const openIfAnchored = () => {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      if (!hash) return;
      const el = document.getElementById(hash);
      if (el && panelRef.current?.contains(el)) {
        setOpen(true);
        requestAnimationFrame(() => el.scrollIntoView());
      }
    };
    openIfAnchored();
    window.addEventListener("hashchange", openIfAnchored);
    return () => window.removeEventListener("hashchange", openIfAnchored);
  }, []);

  return (
    <div className={className}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="press-scale group inline-flex min-h-11 items-center gap-2.5 rounded-full border border-line px-4 py-2 text-[13.5px] text-ink transition-colors duration-150 hover:border-ink/30 hover:bg-surface lg:hidden"
      >
        <Plus
          size={14}
          weight="bold"
          aria-hidden="true"
          className="text-accent transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
        />
        {open ? closeLabel : label}
      </button>
      <div id={panelId} ref={panelRef} className={`mt-8 lg:mt-0 ${open ? "detail-in" : "max-lg:hidden"}`}>
        {children}
      </div>
    </div>
  );
}
