/**
 * WebGL2 host for the Gargantua pass chain, mirroring SolarField.qml:
 *   noise (once) -> geometry raymarch (once, MRT, baked in strips) -> shade (per frame)
 *   -> bloom 1/4 + 1/8 and soft edges 1/2 -> ACES composite -> stars + present.
 * Music is simulated (beats, bass, treble, progress, track change) so the disk
 * behaves like it does with a real song playing on the desktop.
 */

import {
  BLOOM_FRAG,
  COMP_FRAG,
  GEO_FRAG,
  NOISE_FRAG,
  PRESENT_FRAG,
  SHADE_FRAG,
  SOFT_FRAG,
  VERT,
} from "./gargantua-shaders";

type UniformValue = number | readonly number[];

interface Program {
  prog: WebGLProgram;
  loc: Map<string, WebGLUniformLocation | null>;
}

interface Target {
  fbo: WebGLFramebuffer;
  tex: WebGLTexture[];
  w: number;
  h: number;
}

/** Desktop-space layout (1920 x 1080), measured on the live capture. */
export const BH = { cx: 1651, cy: 97, shadow: 230 } as const;

/** Current Material You scheme on the desktop (Caelestia dynamic, dark). */
const PALETTE = {
  primary: [0xbc, 0xc8, 0xd1],
  onPrimaryContainer: [0xb7, 0xc3, 0xcc],
  primaryContainer: [0x45, 0x51, 0x58],
  tertiary: [0xd0, 0xc2, 0xd2],
  onSurface: [0xe4, 0xe2, 0xe2],
} as const;

const rgba = (c: readonly number[]) => [c[0] / 255, c[1] / 255, c[2] / 255, 1] as const;

export const TRACK = { title: "CONTIGO", artist: "Lucho RK", duration: 177, start: 94 } as const;
const BEAT = 60 / 96;
const GEO_STRIPS = 12;

export class GargantuaRenderer {
  private gl: WebGL2RenderingContext;
  private programs: Record<string, Program> = {};
  private vao: WebGLVertexArrayObject;
  private targets: Record<string, Target> = {};
  private box = { x: 0, y: 0, w: 1, h: 1 };
  private scale = 1;
  private bakeRow = 0;
  private lastBeat = -1e6;
  private beatT0 = -1e6;
  private beatT1 = -1e6;
  private beatSeed = 0.37;
  private waveT = -1e6;
  private flowT = 0;
  private lastT = -1;
  private lastLap = 0;

  readonly width: number;
  readonly height: number;

  /** Returns null when WebGL2 or float render targets are missing. */
  static create(canvas: HTMLCanvasElement, width: number, height: number): GargantuaRenderer | null {
    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      powerPreference: "high-performance",
    });
    if (!gl || !gl.getExtension("EXT_color_buffer_float")) return null;
    try {
      return new GargantuaRenderer(gl, width, height);
    } catch {
      return null;
    }
  }

  private constructor(gl: WebGL2RenderingContext, width: number, height: number) {
    this.gl = gl;
    this.width = width;
    this.height = height;
    gl.canvas.width = width;
    gl.canvas.height = height;

    const vao = gl.createVertexArray();
    const buf = gl.createBuffer();
    if (!vao || !buf) throw new Error("webgl buffers");
    this.vao = vao;
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const sources = {
      noise: NOISE_FRAG,
      geo: GEO_FRAG,
      shade: SHADE_FRAG,
      bloom: BLOOM_FRAG,
      soft: SOFT_FRAG,
      comp: COMP_FRAG,
      present: PRESENT_FRAG,
    };
    for (const [name, frag] of Object.entries(sources)) this.programs[name] = this.compile(frag);

    this.layout();
    this.allocate();
    this.bakeNoise();
  }

  /** Black hole box in canvas pixels, same formula as SolarField.qml `_bhBox`. */
  private layout() {
    const sc = this.height / 1080;
    this.scale = sc;
    const R = BH.shadow * sc;
    const cx = BH.cx * sc;
    const cy = BH.cy * sc;
    const x0 = Math.max(0, Math.floor(cx - 3.8 * R));
    const x1 = Math.min(this.width, Math.ceil(cx + 2.0 * R));
    const y0 = Math.max(0, Math.floor(cy - 2.0 * R));
    const y1 = Math.min(this.height, Math.ceil(cy + 1.9 * R));
    this.box = { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
  }

  private compile(fragSrc: string): Program {
    const gl = this.gl;
    const make = (type: number, src: string) => {
      const sh = gl.createShader(type);
      if (!sh) throw new Error("shader");
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh) ?? "compile");
      return sh;
    };
    const prog = gl.createProgram();
    if (!prog) throw new Error("program");
    gl.attachShader(prog, make(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, make(gl.FRAGMENT_SHADER, fragSrc));
    gl.bindAttribLocation(prog, 0, "aPos");
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? "link");
    return { prog, loc: new Map() };
  }

  private texture(w: number, h: number, internal: number, format: number, type: number, filter: number, wrap: number) {
    const gl = this.gl;
    const tex = gl.createTexture();
    if (!tex) throw new Error("texture");
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, type, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter === gl.NEAREST ? gl.NEAREST : gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
    return tex;
  }

  private target(name: string, w: number, h: number, kind: "rgba8" | "half" | "float", count = 1, opts?: { filter?: number; wrap?: number }) {
    const gl = this.gl;
    const fbo = gl.createFramebuffer();
    if (!fbo) throw new Error("fbo");
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    const filter = opts?.filter ?? (kind === "float" ? gl.NEAREST : gl.LINEAR);
    const wrap = opts?.wrap ?? gl.CLAMP_TO_EDGE;
    const tex: WebGLTexture[] = [];
    for (let i = 0; i < count; i++) {
      const t =
        kind === "rgba8"
          ? this.texture(w, h, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, filter, wrap)
          : kind === "half"
            ? this.texture(w, h, gl.RGBA16F, gl.RGBA, gl.HALF_FLOAT, filter, wrap)
            : this.texture(w, h, gl.RGBA32F, gl.RGBA, gl.FLOAT, filter, wrap);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, gl.TEXTURE_2D, t, 0);
      tex.push(t);
    }
    if (count > 1) gl.drawBuffers(tex.map((_, i) => gl.COLOR_ATTACHMENT0 + i));
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) throw new Error(`fbo ${name}`);
    this.targets[name] = { fbo, tex, w, h };
  }

  private allocate() {
    const gl = this.gl;
    const { w, h } = this.box;
    const q = (d: number) => [Math.ceil(w / d), Math.ceil(h / d)] as const;
    this.target("noise", 256, 256, "rgba8", 1, { wrap: gl.REPEAT });
    this.target("geo", w, h, "float", 3);
    this.target("scene", w, h, "half", 1, { filter: gl.LINEAR_MIPMAP_LINEAR });
    this.target("bloomH", ...q(4), "half");
    this.target("bloomV", ...q(4), "half");
    this.target("bloomH2", ...q(8), "half");
    this.target("bloomV2", ...q(8), "half");
    this.target("softH", ...q(2), "half");
    this.target("softV", ...q(2), "half");
    this.target("comp", w, h, "rgba8");
  }

  private use(name: string, uniforms: Record<string, UniformValue>, samplers: Record<string, WebGLTexture> = {}) {
    const gl = this.gl;
    const p = this.programs[name];
    gl.useProgram(p.prog);
    const loc = (key: string) => {
      if (!p.loc.has(key)) p.loc.set(key, gl.getUniformLocation(p.prog, key));
      return p.loc.get(key) ?? null;
    };
    for (const [key, v] of Object.entries(uniforms)) {
      const l = loc(key);
      if (!l) continue;
      if (typeof v === "number") gl.uniform1f(l, v);
      else if (v.length === 2) gl.uniform2f(l, v[0], v[1]);
      else if (v.length === 4) gl.uniform4f(l, v[0], v[1], v[2], v[3]);
    }
    Object.entries(samplers).forEach(([key, tex], unit) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      const l = loc(key);
      if (l) gl.uniform1i(l, unit);
    });
  }

  private draw(target: string | null) {
    const gl = this.gl;
    if (target) {
      const t = this.targets[target];
      gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo);
      gl.viewport(0, 0, t.w, t.h);
    } else {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, this.width, this.height);
    }
    gl.bindVertexArray(this.vao);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  private bakeNoise() {
    this.use("noise", {});
    this.draw("noise");
  }

  private get bhUniforms() {
    const sc = this.scale;
    return {
      bhRadius: BH.shadow * sc,
      bhTilt: -0.3,
      resolution: [this.box.w, this.box.h],
      bhCenter: [BH.cx * sc, BH.cy * sc],
      boxOrigin: [this.box.x, this.box.y],
      rOut: 10.5,
    } as const;
  }

  /** True once the geometry cache is complete. Bakes one strip per call. */
  bakeStep(): boolean {
    if (this.bakeRow >= GEO_STRIPS) return true;
    const gl = this.gl;
    const geo = this.targets.geo;
    const stripH = Math.ceil(geo.h / GEO_STRIPS);
    this.use("geo", { ...this.bhUniforms, elev: (6 * Math.PI) / 180, weakR: 3.0 });
    gl.enable(gl.SCISSOR_TEST);
    gl.scissor(0, this.bakeRow * stripH, geo.w, stripH);
    this.draw("geo");
    gl.disable(gl.SCISSOR_TEST);
    this.bakeRow += 1;
    return this.bakeRow >= GEO_STRIPS;
  }

  /** Song position in seconds at time t. */
  trackPosition(t: number) {
    return (TRACK.start + t) % TRACK.duration;
  }

  private music(t: number) {
    const lap = Math.floor((TRACK.start + t) / TRACK.duration);
    if (lap !== this.lastLap) {
      this.lastLap = lap;
      this.waveT = t;
    }
    const beatIndex = Math.floor(t / BEAT);
    const beatTime = beatIndex * BEAT;
    if (beatTime !== this.lastBeat) {
      this.lastBeat = beatTime;
      if (beatIndex % 2 === 0) {
        this.beatT1 = this.beatT0;
        this.beatT0 = beatTime;
        this.beatSeed = (beatIndex * 0.618034) % 1;
      }
    }
    const kick = t - beatTime;
    const energy = 0.62;
    if (this.lastT >= 0) {
      const dt = t - this.lastT;
      if (dt > 0 && dt < 2) this.flowT += dt * (1 + 0.9 * energy);
    }
    this.lastT = t;
    return {
      musicActive: 1,
      musicProgress: this.trackPosition(t) / TRACK.duration,
      musicBass: 0.3 + 0.55 * Math.exp(-kick * 6),
      musicTreble: 0.35 + 0.15 * Math.sin(t * 1.7),
      beatAge: Math.min(999, t - this.beatT0),
      beatSeed: this.beatSeed,
      ftime: this.flowT,
      beatAgeA: Math.min(999, t - this.beatT0),
      beatAgeB: Math.min(999, t - this.beatT1),
      waveAge: Math.min(999, t - this.waveT),
    };
  }

  render(t: number) {
    const gl = this.gl;
    const ready = this.bakeRow >= GEO_STRIPS;
    const T = this.targets;

    if (ready) {
      this.use(
        "shade",
        {
          ...this.bhUniforms,
          ...this.music(t),
          time: t,
          colPrimary: rgba(PALETTE.primary),
          colInk: rgba(PALETTE.onSurface),
          colOnPC: rgba(PALETTE.onPrimaryContainer),
          colPC: rgba(PALETTE.primaryContainer),
          colTert: rgba(PALETTE.tertiary),
        },
        { geoA: T.geo.tex[0], geoB: T.geo.tex[1], geoH: T.geo.tex[2], noiseTex: T.noise.tex[0] }
      );
      this.draw("scene");
      gl.bindTexture(gl.TEXTURE_2D, T.scene.tex[0]);
      gl.generateMipmap(gl.TEXTURE_2D);

      const blur = (src: WebGLTexture, dst: string, dir: readonly [number, number], threshold: number, spread: number) => {
        const d = T[dst];
        this.use("bloom", { dir, texel: [1 / d.w, 1 / d.h], threshold, spread }, { src });
        this.draw(dst);
      };
      blur(T.scene.tex[0], "bloomH", [1, 0], 1, 1.5);
      blur(T.bloomH.tex[0], "bloomV", [0, 1], 0, 1.5);
      blur(T.scene.tex[0], "bloomH2", [1, 0], 1, 2.4);
      blur(T.bloomH2.tex[0], "bloomV2", [0, 1], 0, 2.4);

      const soft = (src: WebGLTexture, dst: string, dir: readonly [number, number]) => {
        const d = T[dst];
        this.use("soft", { dir, texel: [1 / d.w, 1 / d.h], sigma: 5 }, { src });
        this.draw(dst);
      };
      soft(T.scene.tex[0], "softH", [1, 0]);
      soft(T.softH.tex[0], "softV", [0, 1]);

      const tert = PALETTE.tertiary.map((c) => c / 255);
      this.use(
        "comp",
        {
          exposure: 0.8,
          bloomAmt: 1.4,
          resolution: [this.box.w, this.box.h],
          bhCenter: [BH.cx * this.scale, BH.cy * this.scale],
          bhRadius: BH.shadow * this.scale,
          tint: [0.45 + 0.55 * tert[0], 0.45 + 0.55 * tert[1], 0.45 + 0.55 * tert[2], 1],
          boxOrigin: [this.box.x, this.box.y],
          softAmt: 1,
          edgeOpen: [this.box.x <= 0 ? 1e4 : 0, this.box.y + this.box.h >= this.height ? 1e4 : 0],
        },
        { scene: T.scene.tex[0], bloom: T.bloomV.tex[0], bloom2: T.bloomV2.tex[0], soft: T.softV.tex[0] }
      );
      this.draw("comp");
    }

    this.use(
      "present",
      {
        canvasSize: [this.width, this.height],
        boxOrigin: [this.box.x, this.box.y],
        boxSize: [this.box.w, this.box.h],
        scale: this.scale,
        time: t,
        hasBh: ready ? 1 : 0,
      },
      { bhTex: T.comp.tex[0] }
    );
    this.draw(null);
  }

  dispose() {
    const gl = this.gl;
    for (const t of Object.values(this.targets)) {
      t.tex.forEach((tex) => gl.deleteTexture(tex));
      gl.deleteFramebuffer(t.fbo);
    }
    for (const p of Object.values(this.programs)) gl.deleteProgram(p.prog);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  }
}
