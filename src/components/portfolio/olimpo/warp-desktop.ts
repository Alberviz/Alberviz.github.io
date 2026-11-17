/**
 * The recreated PC screen for the Warp demo, painted with Canvas 2D and uploaded
 * as the texture the portals bend. Hyprland-style top bar, a file manager whose
 * file area is left empty (the real, draggable tiles are DOM on top of it) and a
 * terminal. Invented content only. Window rectangles are shared with the DOM so
 * the tiles land inside the painted window.
 */

export interface Frac {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function desktopWindows(compact: boolean) {
  return compact
    ? {
        files: { x: 0.04, y: 0.27, w: 0.92, h: 0.67 } as Frac,
        sidebar: 0,
        terminal: null as Frac | null,
      }
    : {
        files: { x: 0.05, y: 0.27, w: 0.56, h: 0.63 } as Frac,
        sidebar: 0.25,
        terminal: { x: 0.65, y: 0.25, w: 0.3, h: 0.4 } as Frac | null,
      };
}

/** The file area inside the file manager (fractions of the screen). */
export function fileArea(compact: boolean): Frac {
  const { files, sidebar } = desktopWindows(compact);
  const title = 0.075;
  const x = files.x + files.w * sidebar;
  return { x: x + 0.012, y: files.y + title + 0.03, w: files.w * (1 - sidebar) - 0.024, h: files.h - title - 0.05 };
}

const hash = (n: number) => {
  const s = Math.sin(n * 12.9898) * 43758.5453;
  return s - Math.floor(s);
};

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function paintDesktop(
  canvas: HTMLCanvasElement,
  cssW: number,
  cssH: number,
  dpr: number,
  opts: { compact: boolean; locale: "en" | "es" }
) {
  const W = Math.max(1, Math.round(cssW * dpr));
  const H = Math.max(1, Math.round(cssH * dpr));
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const u = W / 1000;
  const es = opts.locale === "es";
  const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";
  const sans = "system-ui, -apple-system, Segoe UI, sans-serif";

  // Wallpaper: deep space with a warm accretion glow low on the right.
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#0b0e18");
  g.addColorStop(1, "#05060a");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W * 0.86, H * 1.05, 0, W * 0.86, H * 1.05, W * 0.55);
  glow.addColorStop(0, "rgba(242,179,111,0.22)");
  glow.addColorStop(0.5, "rgba(242,140,70,0.06)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 140; i++) {
    const x = hash(i) * W;
    const y = hash(i + 91.7) * H;
    const r = (0.4 + hash(i + 7.3) * 1.1) * dpr;
    ctx.fillStyle = `rgba(236,237,240,${0.15 + hash(i + 3.1) * 0.5})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Top bar: workspaces, clock, status. The portals open right under it.
  const barH = Math.max(18 * dpr, H * 0.06);
  ctx.fillStyle = "rgba(14,16,22,0.92)";
  ctx.fillRect(0, 0, W, barH);
  ctx.fillStyle = "rgba(236,237,240,0.06)";
  ctx.fillRect(0, barH - dpr, W, dpr);
  const cy = barH / 2;
  const dot = Math.max(3 * dpr, barH * 0.16);
  for (let i = 0; i < 5; i++) {
    const x = W * 0.025 + i * dot * 3.6;
    if (i === 1) {
      ctx.fillStyle = "#F2B36F";
      rr(ctx, x - dot, cy - dot, dot * 4, dot * 2, dot);
      ctx.fill();
    } else {
      ctx.fillStyle = "rgba(236,237,240,0.35)";
      ctx.beginPath();
      ctx.arc(x + (i > 1 ? dot * 2 : 0), cy, dot * 0.9, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.fillStyle = "rgba(236,237,240,0.9)";
  ctx.font = `600 ${Math.round(barH * 0.42)}px ${sans}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("21:47", W / 2, cy + dpr * 0.5);
  ctx.textAlign = "right";
  ctx.font = `${Math.round(barH * 0.36)}px ${mono}`;
  ctx.fillStyle = "rgba(236,237,240,0.55)";
  ctx.fillText(es ? "mié 18 nov" : "Wed 18 Nov", W * 0.975, cy + dpr * 0.5);

  const { files, sidebar, terminal } = desktopWindows(opts.compact);
  const win = (f: { x: number; y: number; w: number; h: number }, title: string) => {
    const x = f.x * W;
    const y = f.y * H;
    const w = f.w * W;
    const h = f.h * H;
    const r = 12 * u * (opts.compact ? 1.6 : 1);
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.55)";
    ctx.shadowBlur = 30 * u;
    ctx.shadowOffsetY = 12 * u;
    ctx.fillStyle = "rgba(16,18,26,0.96)";
    rr(ctx, x, y, w, h, r);
    ctx.fill();
    ctx.restore();
    ctx.strokeStyle = "rgba(236,237,240,0.09)";
    ctx.lineWidth = dpr;
    rr(ctx, x, y, w, h, r);
    ctx.stroke();
    const th = 0.075 * H;
    ctx.fillStyle = "rgba(236,237,240,0.05)";
    ctx.fillRect(x + dpr, y + th - dpr, w - 2 * dpr, dpr);
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = "rgba(236,237,240,0.18)";
      ctx.beginPath();
      ctx.arc(x + th * 0.45 + i * th * 0.36, y + th / 2, th * 0.1, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "rgba(236,237,240,0.85)";
    ctx.font = `600 ${Math.round(th * 0.36)}px ${sans}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(title, x + w / 2, y + th / 2 + dpr * 0.5);
    return { x, y, w, h, th };
  };

  const fm = win(files, es ? "Descargas" : "Downloads");
  if (sidebar > 0) {
    const sw = fm.w * sidebar;
    ctx.fillStyle = "rgba(236,237,240,0.03)";
    ctx.fillRect(fm.x + dpr, fm.y + fm.th, sw, fm.h - fm.th - dpr);
    const items = es ? ["Inicio", "Descargas", "Imágenes", "Vídeos", "Olimpo"] : ["Home", "Downloads", "Pictures", "Videos", "Olimpo"];
    ctx.font = `${Math.round(fm.th * 0.32)}px ${sans}`;
    ctx.textAlign = "left";
    items.forEach((t, i) => {
      const yy = fm.y + fm.th + fm.th * (0.7 + i * 0.62);
      if (i === 1) {
        ctx.fillStyle = "rgba(242,179,111,0.14)";
        rr(ctx, fm.x + sw * 0.08, yy - fm.th * 0.26, sw * 0.84, fm.th * 0.52, fm.th * 0.2);
        ctx.fill();
      }
      ctx.fillStyle = i === 1 ? "#F2B36F" : "rgba(236,237,240,0.6)";
      ctx.fillText(t, fm.x + sw * 0.18, yy + dpr * 0.5);
    });
  }

  if (terminal) {
    const tm = win(terminal, "kitty");
    const lines = [
      ["$ ", "warp lanzar"],
      ["  ", es ? "3 destinos · móvil, tablet, tele" : "3 targets · phone, tablet, TV"],
      ["$ ", "olimpo enviar --a movil"],
      ["  ", es ? "enviado · 1 archivo" : "sent · 1 file"],
      ["$ ", ""],
    ];
    ctx.font = `${Math.round(tm.th * 0.32)}px ${mono}`;
    ctx.textAlign = "left";
    lines.forEach(([pre, txt], i) => {
      const yy = tm.y + tm.th + tm.th * (0.75 + i * 0.6);
      ctx.fillStyle = pre.trim() ? "#F2B36F" : "rgba(236,237,240,0.4)";
      ctx.fillText(pre, tm.x + tm.th * 0.4, yy);
      ctx.fillStyle = "rgba(236,237,240,0.75)";
      ctx.fillText(txt, tm.x + tm.th * 0.4 + ctx.measureText(pre).width, yy);
    });
  }
}
