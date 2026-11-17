/**
 * WebGL1 host for the Warp demo. One canvas holds the recreated PC screen (a
 * texture painted with Canvas 2D), the black-hole portals on its top edge with
 * the lens over that screen, the "a los dos" merge, and the white holes that
 * open over the devices that receive. Everything is in CSS px; the engine scales
 * by its pixel ratio.
 *
 * The loop only runs while something moves (a portal open or closing, a pulse,
 * a merge, a white hole) and while the canvas is on screen; otherwise the last
 * frame stays. With `still` (reduced motion) every change is drawn once, with no
 * waves or growth.
 */

import { AE1_BLANCO, AE1_NEGRO_LENTE, BINARIO, SCREEN_FRAG, WARP_VERTEX } from "./warp-shaders";
import { FUSION_MS, fusionAt } from "./warp-fusion";

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WarpLayout {
  width: number;
  height: number;
  screen: Rect;
  /** Portal centres (CSS px, canvas space) and the shared shadow radius. */
  portals: { id: string; x: number; y: number }[];
  R: number;
  /** Device screens that can receive (CSS px, canvas space). */
  devices: Record<string, Rect>;
}

interface Program {
  p: WebGLProgram;
  u: Map<string, WebGLUniformLocation | null>;
}

interface PortalState {
  id: string;
  x: number;
  y: number;
  vis: number;
  target: number;
  en: number;
  enTarget: number;
  pulse: number;
  spin: number;
  pull: number;
}

interface WhiteHole {
  device: string;
  t: number;
}

const WHITE_LIFE = 2.3;

export class WarpEngine {
  private gl: WebGLRenderingContext;
  private canvas: HTMLCanvasElement;
  private progs: Record<"screen" | "negro" | "blanco" | "binario", Program>;
  private tex: WebGLTexture;
  private dpr: number;
  private layout: WarpLayout | null = null;
  private portals: PortalState[] = [];
  private whites: WhiteHole[] = [];
  private fusion: { a: string; b: string; p: number; target: number; pulse: number } | null = null;
  private raf = 0;
  private last = 0;
  private t = 0;
  private visible = true;
  private io: IntersectionObserver;
  private dirty = true;
  /** Overlay mode: no screen pass and no lens, only the holes over whatever is behind the canvas. */
  private bare = false;
  readonly still: boolean;

  static create(canvas: HTMLCanvasElement, still: boolean): WarpEngine | null {
    let gl: WebGLRenderingContext | null = null;
    try {
      gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false }) as WebGLRenderingContext | null;
    } catch {
      gl = null;
    }
    if (!gl) return null;
    try {
      return new WarpEngine(canvas, gl, still);
    } catch {
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      return null;
    }
  }

  private constructor(canvas: HTMLCanvasElement, gl: WebGLRenderingContext, still: boolean) {
    this.canvas = canvas;
    this.gl = gl;
    this.still = still;
    this.dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 640 ? 1.25 : 1.5);
    this.progs = {
      screen: this.compile(SCREEN_FRAG),
      negro: this.compile(AE1_NEGRO_LENTE),
      blanco: this.compile(AE1_BLANCO),
      binario: this.compile(BINARIO),
    };
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const tex = gl.createTexture();
    if (!tex) throw new Error("texture");
    this.tex = tex;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([5, 6, 10, 255]));
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    this.io = new IntersectionObserver(
      ([e]) => {
        this.visible = e.isIntersecting;
        if (this.visible) this.kick();
      },
      { rootMargin: "80px" }
    );
    this.io.observe(canvas);
  }

  private compile(frag: string): Program {
    const gl = this.gl;
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) throw new Error("shader");
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "compile");
      return s;
    };
    const p = gl.createProgram();
    if (!p) throw new Error("program");
    gl.attachShader(p, sh(gl.VERTEX_SHADER, WARP_VERTEX));
    gl.attachShader(p, sh(gl.FRAGMENT_SHADER, frag));
    gl.bindAttribLocation(p, 0, "a");
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) ?? "link");
    return { p, u: new Map() };
  }

  private use(prog: Program, uniforms: Record<string, number | readonly number[]>) {
    const gl = this.gl;
    gl.useProgram(prog.p);
    for (const [k, v] of Object.entries(uniforms)) {
      if (!prog.u.has(k)) prog.u.set(k, gl.getUniformLocation(prog.p, k));
      const l = prog.u.get(k);
      if (!l) continue;
      if (typeof v === "number") gl.uniform1f(l, v);
      else if (v.length === 2) gl.uniform2f(l, v[0], v[1]);
    }
    if (!prog.u.has("bg")) prog.u.set("bg", gl.getUniformLocation(prog.p, "bg"));
    const bg = prog.u.get("bg");
    if (bg) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.tex);
      gl.uniform1i(bg, 0);
    }
  }

  /** Canvas px rectangle (bottom-left origin) for gl.scissor, clipped to the canvas. */
  private scissor(r: Rect) {
    const d = this.dpr;
    const H = this.canvas.height;
    const x0 = Math.max(0, Math.floor(r.x * d));
    const y0 = Math.max(0, Math.floor(r.y * d));
    const x1 = Math.min(this.canvas.width, Math.ceil((r.x + r.w) * d));
    const y1 = Math.min(H, Math.ceil((r.y + r.h) * d));
    if (x1 <= x0 || y1 <= y0) return false;
    this.gl.scissor(x0, H - y1, x1 - x0, y1 - y0);
    return true;
  }

  setLayout(layout: WarpLayout) {
    this.layout = layout;
    const w = Math.max(1, Math.round(layout.width * this.dpr));
    const h = Math.max(1, Math.round(layout.height * this.dpr));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    const old = new Map(this.portals.map((p) => [p.id, p]));
    this.portals = layout.portals.map((p) => {
      const o = old.get(p.id);
      return o
        ? { ...o, x: p.x, y: p.y }
        : { id: p.id, x: p.x, y: p.y, vis: 0, target: 0, en: 0.45, enTarget: 0.45, pulse: 0, spin: 0, pull: 0 };
    });
    this.kick();
  }

  /** Uploads the painted desktop (a 2D canvas the size of the screen rect × dpr). */
  setDesktop(image: HTMLCanvasElement) {
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    this.kick();
  }

  setBare(bare: boolean) {
    this.bare = bare;
    this.kick();
  }

  get pixelRatio() {
    return this.dpr;
  }

  /** Opens (1) or closes (0) the portals; `only` limits which ones open. */
  open(on: boolean, only?: string[]) {
    for (const p of this.portals) {
      p.target = on && (!only || only.includes(p.id)) ? 1 : 0;
      if (this.still) p.vis = p.target;
    }
    if (!on) this.unfuse(true);
    this.kick();
  }

  hover(id: string | null) {
    for (const p of this.portals) p.enTarget = p.id === id ? 1 : 0.45;
    this.kick();
  }

  swallow(id: string) {
    if (this.still) return this.kick();
    if (this.fusion && (this.fusion.a === id || this.fusion.b === id || id === "fused")) {
      this.fusion.pulse = 1;
    } else {
      const p = this.portals.find((q) => q.id === id);
      if (p) {
        p.pulse = 1;
        p.en = 1;
      }
    }
    this.kick();
  }

  spit(device: string) {
    const w = { device, t: 0 };
    this.whites.push(w);
    if (this.still) {
      window.setTimeout(() => {
        this.whites = this.whites.filter((x) => x !== w);
        this.kick();
      }, 1200);
    }
    this.kick();
  }

  fuse(a: string, b: string) {
    this.fusion = { a, b, p: this.still ? 1 : 0, target: 1, pulse: 0 };
    this.kick();
  }

  unfuse(now = false) {
    if (!this.fusion) return;
    if (now || this.still) this.fusion = null;
    else this.fusion.target = 0;
    this.kick();
  }

  /** Centre and radius of the merged hole, when there is one. */
  fusedCentre() {
    if (!this.fusion || !this.layout) return null;
    const a = this.portals.find((p) => p.id === this.fusion!.a);
    const b = this.portals.find((p) => p.id === this.fusion!.b);
    if (!a || !b) return null;
    return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, R: this.layout.R * 1.3 };
  }

  private busy() {
    if (this.dirty) return true;
    if (this.still) return false;
    if (this.whites.length) return true;
    if (this.fusion && (this.fusion.p !== this.fusion.target || this.fusion.p > 0)) return true;
    return this.portals.some((p) => p.vis > 0.001 || p.target > 0 || p.pulse > 0);
  }

  private kick() {
    this.dirty = true;
    if (!this.raf && this.visible) {
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.frame);
    }
  }

  private frame = (now: number) => {
    this.raf = 0;
    if (!this.visible || document.hidden) return;
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    this.step(this.still ? 0 : dt);
    this.draw();
    this.dirty = false;
    if (this.busy()) this.raf = requestAnimationFrame(this.frame);
  };

  private step(dt: number) {
    this.t += dt;
    for (const p of this.portals) {
      // Born from a point: visibility eases toward its target (0.55 s to open, 0.35 s to close).
      const rate = p.target > p.vis ? dt / 0.55 : dt / 0.35;
      p.vis = p.target > p.vis ? Math.min(p.target, p.vis + rate) : Math.max(p.target, p.vis - rate);
      p.en += (p.enTarget - p.en) * Math.min(1, dt * 6);
      p.pulse = Math.max(0, p.pulse - dt / 0.9);
      p.spin += dt * (0.5 + 4 * p.pulse + 1.2 * (p.en - 0.45));
      p.pull += dt * (0.15 + 1.5 * p.pulse);
    }
    if (this.fusion) {
      const f = this.fusion;
      const k = dt / (FUSION_MS / 1000);
      f.p = f.target > f.p ? Math.min(1, f.p + k) : Math.max(0, f.p - k);
      f.pulse = Math.max(0, f.pulse - dt / 0.9);
      if (f.target === 0 && f.p === 0) this.fusion = null;
    }
    if (!this.still) {
      for (const w of this.whites) w.t += dt;
      this.whites = this.whites.filter((w) => w.t < WHITE_LIFE);
    }
  }

  private common(R: number) {
    const L = this.layout!;
    const d = this.dpr;
    return {
      uRes: [this.canvas.width, this.canvas.height],
      U: d * Math.max(0.7, R / 40),
      T: this.t,
      scrO: [L.screen.x * d, L.screen.y * d],
      scrS: [L.screen.w * d, L.screen.h * d],
    } as const;
  }

  private draw() {
    const gl = this.gl;
    const L = this.layout;
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.disable(gl.SCISSOR_TEST);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (!L) return;
    const d = this.dpr;
    const ease = (x: number) => 1 - Math.pow(1 - x, 3);

    // 1. The screen.
    if (!this.bare) {
      this.use(this.progs.screen, {
        uRes: [this.canvas.width, this.canvas.height],
        scrO: [L.screen.x * d, L.screen.y * d],
        scrS: [L.screen.w * d, L.screen.h * d],
      });
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    gl.enable(gl.SCISSOR_TEST);
    const f = this.fusion;
    const inFusion = (id: string) => !!f && (f.a === id || f.b === id) && f.p > 0;

    // 2. Black holes with the lens, each clipped to its box inside the screen.
    for (const p of this.portals) {
      if (p.vis <= 0.001 || inFusion(p.id)) continue;
      const R = L.R * (this.still ? 1 : 0.15 + 0.85 * ease(p.vis));
      const box = { x: p.x - 9 * R, y: Math.max(L.screen.y, p.y - 9 * R), w: 18 * R, h: 18 * R };
      const clip = intersect(box, L.screen);
      if (!clip || !this.scissor(clip)) continue;
      this.use(this.progs.negro, {
        ...this.common(R),
        uC: [p.x * d, p.y * d],
        R: R * d,
        en: p.en,
        vis: Math.min(1, p.vis * 1.2),
        pulse: p.pulse,
        spin: p.spin,
        pull: p.pull,
        closing: 0,
        estrellas: 0.55,
        reposo: 0,
        discoReposo: 0.13,
        lente: this.bare ? 0 : 1,
      });
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    // 3. "A los dos": the pair merges into one bigger hole.
    if (f && f.p > 0) {
      const a = this.portals.find((q) => q.id === f.a);
      const b = this.portals.find((q) => q.id === f.b);
      if (a && b && this.scissor(L.screen)) {
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2;
        const sep0 = Math.hypot(b.x - a.x, b.y - a.y);
        const s = fusionAt(f.p, sep0, L.R);
        const ca = Math.cos(s.ang);
        const sa = Math.sin(s.ang);
        const hx = (s.sep / 2) * ca;
        const hy = (s.sep / 2) * sa;
        this.use(this.progs.binario, {
          ...this.common(s.R),
          uC: [(mx - hx) * d, (my - hy) * d],
          uC2: [(mx + hx) * d, (my + hy) * d],
          R: s.R * d,
          en: Math.min(1, s.en + 0.3 * f.pulse),
          vis: Math.min(a.vis, b.vis, 1),
          pulse: f.pulse,
          spin: a.spin,
          pull: a.pull,
          closing: 0,
          fase: s.ang,
          uno: s.uno,
          onda: s.onda,
          oval: s.oval,
          estrellas: 0.55,
        });
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
    }

    // 4. White holes over the devices that receive.
    for (const w of this.whites) {
      const dev = L.devices[w.device];
      if (!dev || !this.scissor(dev)) continue;
      const life = this.still ? 0.6 : w.t;
      const R = Math.min(dev.w, dev.h) * 0.13;
      const vis = this.still ? 1 : Math.min(1, life / 0.32) * (1 - smooth(1.75, WHITE_LIFE, life));
      const pulse = this.still ? 0 : life < 0.35 ? 0 : Math.max(0, 1 - (life - 0.35) / 0.9);
      const closing = this.still ? 0 : smooth(1.3, 2.0, life);
      const d2 = this.dpr;
      this.use(this.progs.blanco, {
        uRes: [this.canvas.width, this.canvas.height],
        U: d2 * Math.max(0.7, R / 40),
        T: this.t,
        scrO: [dev.x * d2, dev.y * d2],
        scrS: [dev.w * d2, dev.h * d2],
        uC: [(dev.x + dev.w / 2) * d2, (dev.y + dev.h / 2) * d2],
        R: R * d2 * (0.2 + 0.8 * Math.min(1, life / 0.32)),
        en: 0.9,
        vis,
        pulse,
        spin: life * 1.4,
        pull: life,
        closing,
        estrellas: 0.6,
      });
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    gl.disable(gl.SCISSOR_TEST);
  }

  dispose() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.io.disconnect();
    const gl = this.gl;
    for (const p of Object.values(this.progs)) gl.deleteProgram(p.p);
    gl.deleteTexture(this.tex);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  }
}

function smooth(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

function intersect(a: Rect, b: Rect): Rect | null {
  const x0 = Math.max(a.x, b.x);
  const y0 = Math.max(a.y, b.y);
  const x1 = Math.min(a.x + a.w, b.x + b.w);
  const y1 = Math.min(a.y + a.h, b.y + b.h);
  return x1 > x0 && y1 > y0 ? { x: x0, y: y0, w: x1 - x0, h: y1 - y0 } : null;
}
