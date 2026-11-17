"use client";

import React, { useLayoutEffect, useRef, useState } from "react";

/**
 * Renders a fixed-size design (for example 1200x740) and scales it to the
 * width of its container, so a recreated interface keeps its composition at
 * any viewport. Only `transform` changes; the box reserves its height through
 * aspect-ratio, so there is no layout shift before the first measure.
 */
export function ScaledStage({
  width,
  height,
  className,
  children,
  label,
}: {
  width: number;
  height: number;
  className?: string;
  children: React.ReactNode;
  label?: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / width);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);

  return (
    <div
      ref={boxRef}
      role={label ? "img" : undefined}
      aria-label={label}
      className={`relative w-full overflow-hidden ${className ?? ""}`}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <div
        aria-hidden={label ? true : undefined}
        className="absolute left-0 top-0 origin-top-left"
        style={{ width, height, transform: `scale(${scale ?? 0})`, opacity: scale ? 1 : 0 }}
      >
        {children}
      </div>
    </div>
  );
}
