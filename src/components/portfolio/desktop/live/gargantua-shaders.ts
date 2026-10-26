/**
 * Gargantua black hole, ported from the live Quickshell desktop
 * (LinuxRicing: modules/background/solarsystem/shaders/bh*.frag) to WebGL2.
 * The physics and shading code is the original; only the Qt uniform blocks,
 * texture coordinates and the geometry pass outputs (one MRT pass instead of
 * three) were adapted. Generated from the QML sources, edit with care.
 */

export const VERT = `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

export const GEO_FRAG = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
layout(location = 0) out vec4 out0;
layout(location = 1) out vec4 out1;
layout(location = 2) out vec4 out2;
uniform float elev;
uniform float bhRadius;
uniform float bhTilt;
uniform vec2 resolution;
uniform vec2 bhCenter;
uniform vec2 boxOrigin;
uniform float rOut;
uniform float weakR;

const float KG = 1.68;
const float B_CRIT = 2.9098;
const float R_ISCO = 1.95;
#define R_OUT_T rOut
const float R_OUT_H = 30.0;
const bool  HAZE = false;
const float K_THIN = 60.0;

float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }

#define R_TAIL (rOut * 1.05)

float tailZone(vec3 x, float r){
    return 0.0;
}
float Ht(vec3 x, float r){ return 0.006 * r * (1.0 + 3.0 * tailZone(x, r)); }
float Hh(float r){ return 0.009 * pow(r, 1.3); }

float sigT0(float r){ return smoothstep(R_ISCO * 0.97, R_ISCO * 1.08, r) * (1.0 - smoothstep(0.6 * R_OUT_T, R_OUT_T, r)); }

float sigT(vec3 x, float r){ return max(sigT0(r), 0.8 * tailZone(x, r) * (1.0 - smoothstep(10.0, R_TAIL, r))); }

float rhoH(float r){
    return smoothstep(5.0, 10.0, r) * pow(r / 10.0, -1.1) * (1.0 - smoothstep(0.55 * R_OUT_H, R_OUT_H, r));
}

float illumH(float r, float dop, float cosS){
    float beta = 0.42 * sqrt(R_ISCO / r);
    float g = 1.0 / (inversesqrt(1.0 - beta*beta) * (1.0 - beta * dop));
    const float G = 0.6;
    float hg = (1.0 - G*G) / pow(1.0 + G*G - 2.0*G*cosS, 1.5);
    return pow(r / 10.0, -1.0) * g*g*g * hg;
}

struct Segs { vec4 P0, P1, P2; vec3 Q0, Q1, Q2; vec4 H; vec2 HQ; float hit; float Hj2; float Hy; };

Segs traceRay(vec2 frag, float jit)
{
    float R = bhRadius / B_CRIT;
    vec2 rel = frag - bhCenter;
    float ct = cos(-bhTilt), st = sin(-bhTilt);
    vec2 pr = vec2(rel.x*ct - rel.y*st, rel.x*st + rel.y*ct) / R;
    Segs S;
    S.P0 = vec4(0.0); S.P1 = vec4(0.0); S.P2 = vec4(0.0);
    S.Q0 = vec3(0.0); S.Q1 = vec3(0.0); S.Q2 = vec3(0.0);
    S.H = vec4(0.0); S.HQ = vec2(0.0); S.Hj2 = 0.0; S.Hy = 0.0;
    S.hit = 0.0;
    float Th = 1.0, Tt = 1.0;
    if (abs(pr.x) < 80.0 && abs(pr.y) < 50.0){
        float ce = cos(elev), se = sin(elev);
        vec3 cdir = vec3(0.0, se, ce);
        vec3 x = cdir * (rOut + 40.0) + vec3(1.0,0.0,0.0) * pr.x - vec3(0.0, ce, -se) * pr.y;
        vec3 v = -cdir;
        vec3 h3 = cross(x, v);
        float h2 = dot(h3, h3);
        int run = -1;
        bool was = false;
        bool first = true;
        for (int i = 0; i < 1400; i++){
            float r = length(x);
            if (r < 0.7 * KG) { S.hit = 1.0; break; }
            if (r > rOut + 45.0 && dot(x, v) > 0.0) break;
            if (Th * Tt < 0.004) break;
            float sp = length(v);
            vec3 u = v / sp;

            float ds = 0.05 * r + 0.008;
            float ht = Ht(x, r), hh = Hh(r);
            float ay = abs(x.y);
            bool nearT = r > R_ISCO * 0.95 && r < R_TAIL * 1.05 && ay < 3.5 * ht;
            bool nearH = HAZE && r > 2.0 && r < R_OUT_H * 1.05 && ay < 3.2 * hh;
            if (nearT) ds = min(ds, max(0.35 * ht / (abs(u.y) + 0.02), 0.006));
            if (nearH) ds = min(ds, clamp(0.6 * hh / (abs(u.y) + 1e-3), 0.05, 0.3 + 0.02 * r));
            if (!nearT){
                float dy = ay - 3.5 * ht;
                if (r > R_ISCO * 0.9 && r < R_TAIL * 1.1 && dy > 0.0)
                    ds = min(ds, max(dy / (abs(u.y) + 1e-3) * 0.7, 0.006));
            }
            if (HAZE && !nearH && r < R_OUT_H * 1.1 && r > 2.0){
                float dy = ay - 3.2 * hh;
                if (dy > 0.0) ds = min(ds, max(dy / (abs(u.y) + 1e-3) * 0.7, 0.02));
            }
            if (first){ ds *= jit; first = false; }

            if (nearT || nearH){
                vec2 cs = x.xz / max(length(x.xz), 1e-4);
                vec3 tang = vec3(-cs.y, 0.0, cs.x);
                float dop = dot(tang, -u);
                if (nearT){
                    float rt = sigT(x, r) * exp(-0.5 * ay*ay / (ht*ht)) / ht * 0.006 * ds;
                    if (rt > 0.0){

                        run = dot(x, u) < 0.0 ? 0 : 1;

                        float we = rt * pow(r / R_ISCO, -3.0);
                        vec4 a = vec4(we * r, we, rt, 0.0);
                        vec3 q = we * vec3(cs, dop);
                        if (run == 0){ S.P0.xyz += a.xyz; S.Q0 += q; }
                        else if (run == 1){ S.P1.xyz += a.xyz; S.Q1 += q; }
                        else if (run == 2){ S.P2.xyz += a.xyz; S.Q2 += q; }
                        Tt *= exp(-K_THIN * rt);
                    }
                }
                if (nearH){
                    float rh = rhoH(r) * exp(-0.5 * ay*ay / (hh*hh)) * ds;
                    if (rh > 0.0){
                        float j = rh * illumH(r, dop, dot(x / r, -u)) * Th * Tt;
                        S.H.x += j * r; S.Hj2 += j; S.H.y += j; S.HQ += j * cs; S.Hy += j * x.y / hh;
                        Th *= exp(-0.04 * rh);
                    }
                }
            }
            if (!nearT) was = false;

            float dl = ds / sp;

            float fw = weakR > 0.0 ? 1.0 / (1.0 + pow(r / weakR, 3.0)) : 1.0;
            vec3 acc = -fw * KG * h2 * x / (r*r*r*r*r);
            v += acc * 0.5 * dl;
            x += v * dl;
            float r2 = length(x);
            float fw2 = weakR > 0.0 ? 1.0 / (1.0 + pow(r2 / weakR, 3.0)) : 1.0;
            v += (-fw2 * KG * h2 * x / (r2*r2*r2*r2*r2)) * 0.5 * dl;
        }
    } else if (length(pr) < B_CRIT) S.hit = 1.0;
    S.H.z = Th;
    return S;
}

void main(){
    vec2 qtc = vec2(vUv.x, 1.0 - vUv.y);
    vec2 frag = boxOrigin + qtc * resolution;
    vec4 A0 = vec4(0.0), A1 = vec4(0.0);
    vec3 B0 = vec3(0.0), B1 = vec3(0.0);
    vec4 HH = vec4(0.0); vec2 HQ = vec2(0.0);
    float hj = 0.0, hy = 0.0, hit = 0.0;
    for (int j = 0; j < 2; j++) for (int i = 0; i < 2; i++){
        vec2 o = vec2(float(i) - 0.5, float(j) - 0.5) * 0.5;
        float jit = 0.15 + 0.85 * hash12(frag * 1.37 + o * 17.0 + 3.1);
        Segs S = traceRay(frag + o, jit);
        A0.xyz += S.P0.xyz; B0 += S.Q0;
        A1.xyz += S.P1.xyz; B1 += S.Q1;
        HH.xy += S.H.xy; HQ += S.HQ; hj += S.Hj2; hy += S.Hy;
        hit += S.hit;
    }
    out0 = A0.z > 0.0 ? vec4(A0.x / A0.y, atan(B0.y, B0.x), A0.z * 0.25, B0.z / A0.y) : vec4(0.0);
    out1 = A1.z > 0.0 ? vec4(A1.x / A1.y, atan(B1.y, B1.x), A1.z * 0.25, B1.z / A1.y) : vec4(0.0);
    float yn = hj > 0.0 ? clamp(hy / hj, -4.5, 4.5) : 0.0;
    out2 = vec4(hj > 0.0 ? HH.x / hj : 0.0, atan(HQ.y, HQ.x), HH.y * 0.25, yn + 10.0 * hit);
}
`;

export const SHADE_FRAG = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
out vec4 fragColor;
uniform float time;
uniform float bhRadius;
uniform float bhTilt;
uniform vec2 resolution;
uniform vec2 bhCenter;
uniform vec4 colPrimary;
uniform vec4 colInk;
uniform vec4 colOnPC;
uniform vec4 colPC;
uniform vec4 colTert;
uniform vec2 boxOrigin;
uniform float rOut;
uniform float musicActive;
uniform float musicProgress;
uniform float musicBass;
uniform float musicTreble;
uniform float beatAge;
uniform float beatSeed;
uniform float ftime;
uniform float beatAgeA;
uniform float beatAgeB;
uniform float waveAge;

uniform sampler2D geoA;
uniform sampler2D geoB;
uniform sampler2D geoH;
uniform sampler2D noiseTex;
const float KG = 1.68;
const float R_ISCO = 1.95;
#define R_OUT_T rOut
const float B_CRIT = 2.9098;
const float K_THIN = 60.0;
const float TAU = 6.28318530718;
const float DIM_OFF = 0.15;

vec3 lit(vec3 c, float k){ return mix(c, vec3(1.0), k); }
vec3 dk(vec3 c, float k){ return c * (1.0 - k); }
vec3 toLin(vec3 c){ return pow(c, vec3(2.2)); }

float hash21(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
vec2  hash22(vec2 p){ float n = sin(dot(p, vec2(41.0, 289.0))); return fract(vec2(262144.0, 32768.0)*n); }

float luma(vec3 c){ return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
vec3 nrm(vec3 c){ return mix(c * (0.75 / max(luma(c), 1e-3)), vec3(0.75), 0.45); }
vec3 ramp(float x){
    vec3 c5 = nrm(lit(toLin(colOnPC.rgb), 0.75));
    vec3 c4 = nrm(toLin(colOnPC.rgb));
    vec3 c3 = nrm(toLin(colPC.rgb));
    vec3 c2 = nrm(toLin(colPrimary.rgb));
    vec3 c1 = nrm(toLin(colTert.rgb));
    if (x > 0.85) return mix(c4, c5, (x - 0.85) / 0.15);
    if (x > 0.65) return mix(c3, c4, (x - 0.65) / 0.20);
    if (x > 0.45) return mix(c2, c3, (x - 0.45) / 0.20);
    if (x > 0.20) return mix(c1, c2, (x - 0.20) / 0.25);
    return c1 * smoothstep(0.0, 0.20, x);
}

float omegaK(float r){ return 0.55 * pow(r / R_ISCO, -1.5); }

float aaw(float f){ return 1.0 - smoothstep(0.15, 0.40, f); }

vec4 flowTex(float r, float phi, float seed, bool full, float yn, float rsc, float dv){
    const float T = 18.0;
    vec4 acc = vec4(0.0); float w2 = 0.0;
    float rr = r / 2.54;
    float v = rr / 16.0 * rsc;
    for (int k = 0; k < 2; k++){
        float ph = fract(ftime / T + 0.5 * float(k) + seed * 0.37);
        float w  = 1.0 - abs(2.0 * ph - 1.0);
        float u  = (phi - omegaK(r) * (ph - 0.5) * T) / TAU;
        float s  = float(k) * 0.37 + seed * 0.21;
        vec2 ys = yn * vec2(0.13, 0.07);
        vec4 n;

        float a1 = aaw(dv * 9.0), a2 = aaw(dv * 26.0), a3 = aaw(dv * 22.0), a4 = aaw(dv * 38.0);
        n.x = full ? (0.55 * mix(0.5, texture(noiseTex, vec2(u + s,        v * 9.0 + s)).r, a1)
                    + 0.45 * mix(0.5, texture(noiseTex, vec2(2.0*u + s + 0.3, v * 26.0)).r, a2)) : 0.5;
        n.y = 0.6 * mix(0.5, texture(noiseTex, vec2(4.0*u + s + ys.x * 2.0, v * 22.0 + ys.y * 2.0)).g, a3)
            + 0.4 * mix(0.5, texture(noiseTex, vec2(6.0*u + s + 0.5 + ys.x * 3.5, v * 38.0 + ys.y * 3.5)).g, a4);
        n.z = texture(noiseTex, vec2(u + s + 0.7 + ys.x, v * 5.0 + ys.y)).b;
        n.w = texture(noiseTex, vec2(u + s + 0.2 + ys.x * 0.8, v * 3.0)).a;
        acc += w * (n - 0.5);
        w2 += w * w;
    }
    return 0.5 + acc / sqrt(w2);
}

float ringWave(float rc, float age, float v, float w){
    float d = (rc - (R_ISCO + age * v)) / w;
    return exp(-d * d);
}

float dopplerG(float r, float dop){
    float beta = 0.42 * sqrt(R_ISCO / r);
    float gam = inversesqrt(1.0 - beta * beta);
    float grav = mix(1.0, sqrt(max(1.0 - (KG / 1.5) / r, 0.05)), 0.3);
    return grav / (gam * (1.0 - beta * dop));
}

vec4 diskCell(float r, float phi, float Nr){
    float ir = floor(r * Nr);
    float nphi = max(floor(6.2831853 * (ir + 0.5)), 3.0);
    float u = fract(phi / 6.2831853) * nphi;
    return vec4(ir, floor(u), fract(r * Nr), fract(u));
}
float h12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }

float speckLayer(float r, float phi, float Nr, float dd, float seed){
    vec4 c = diskCell(r, phi, Nr);
    float h = h12(c.xy + seed * 17.0);
    if (h > dd) return 0.0;
    vec2 ctr = vec2(h12(c.xy + seed * 5.0 + 1.3), h12(c.xy + seed * 9.0 + 7.1)) * 0.5 + 0.25;
    float rad = 0.12 + 0.22 * h12(c.xy + seed * 3.0 + 2.9);
    float d = length(c.zw - ctr);
    return 1.0 - smoothstep(rad * 0.55, rad, d);
}

float speckLayer(float r, float phi, vec4 J, float Nr, float prob, float rmin, float rmax, float seed){
    float ir = floor(r * Nr);
    float rowR = (ir + 0.5) / Nr;
    float nphi = max(floor(TAU * rowR * Nr * 3.0), 3.0);
    float a = phi - omegaK(rowR) * ftime * 0.25;
    float u = fract(a / TAU) * nphi;
    vec2 id = vec2(ir, floor(u));
    if (h12(id + seed) > prob) return 0.0;
    vec2 c = vec2(0.25 + 0.5 * h12(id + seed + 1.3), 0.25 + 0.5 * h12(id + seed + 7.1));
    float dr = (fract(r * Nr) - c.x) / Nr;
    float dp = (fract(u) - c.y) / nphi * TAU;
    float det = J.x * J.w - J.y * J.z;
    if (abs(det) < 1e-12) return 0.0;
    vec2 d = vec2(J.w * dr - J.y * dp, -J.z * dr + J.x * dp) / det;
    float cellR = (0.5 / Nr) / max(length(J.xy), 1e-6);
    float cellP = (3.1416 / nphi) / max(length(J.zw), 1e-6);
    float rad = min(mix(rmin, rmax, h12(id + seed + 5.3)), 0.8 * min(cellR, cellP));
    return 1.0 - smoothstep(rad - 0.6, rad + 0.5, length(d));
}
float specks(float r, float phi, vec4 J, float dd){
    return max(speckLayer(r, phi, J, 1.6, 0.18 * dd, 2.0, 4.5, 1.0),
           max(speckLayer(r, phi, J, 3.5, 0.35 * dd, 1.1, 2.4, 2.0), speckLayer(r, phi, J, 8.0, 0.6 * dd, 0.6, 1.3, 3.0)));
}

vec4 shadeThin(vec4 s, float dop, float seed, vec4 J){
    float rc = max(s.x, R_ISCO * 0.95);
    float wt = s.z;

    float dv = length(J.xy) / 2.54 / 16.0;
    float du = length(J.zw) / TAU;
    vec4 n = flowTex(rc, s.y, seed, true, 0.0, 1.0, max(dv, du * 0.5));

    float uf = (s.y - 0.02 * ftime) / TAU;
    float vf = rc / 2.54 / 16.0;
    float av1 = aaw(max(dv * 70.0, du * 3.0)), av2 = aaw(max(dv * 150.0, du * 5.0));
    float fv = 0.6 * mix(0.5, texture(noiseTex, vec2(3.0 * uf + seed * 0.3, vf * 70.0)).r, av1)
             + 0.4 * mix(0.5, texture(noiseTex, vec2(5.0 * uf + 0.37, vf * 150.0)).g, av2);
    float vein = 0.6 + 0.8 * smoothstep(0.22, 0.80, fv) * (0.85 + 0.3 * n.x);
    float dens = 0.9 + 0.2 * n.w;
    float tau = K_THIN * dens * wt;
    if (tau < 1e-5) return vec4(0.0);
    float lip = smoothstep(R_ISCO * 0.97, R_ISCO * 1.12, rc);
    float g = dopplerG(rc, dop);
    float gS = pow(g, 1.5);

    float rn = clamp((rc - R_ISCO) / (R_OUT_T - R_ISCO), 0.0, 1.0);

    float mAct = musicActive;
    float inner = exp(-(rc - R_ISCO) * 0.9);
    float hot = 0.0;
    if (mAct > 0.0 && beatAge < 4.0){
        const float rh = 3.2;
        float ph = beatSeed * TAU + omegaK(rh) * beatAge;
        float dphi = abs(mod(s.y - ph + 0.5 * TAU, TAU) - 0.5 * TAU);
        float dr = (rc - rh) / 0.55, dp = dphi * rh / 0.8;
        hot = exp(-(dr * dr + dp * dp)) * exp(-beatAge / 1.1) * smoothstep(0.0, 0.08, beatAge);
    }
    float I = lip * gS * ((2.4 * exp(-6.5 * rn) + 0.02) * vein * (0.85 + (0.3 + 0.35 * musicTreble * mAct) * n.y)
                          + 0.9 * exp(-(rc - R_ISCO) * 2.5));
    I *= 1.0 + 0.35 * musicBass * mAct * inner;
    I += lip * gS * 1.1 * hot * mAct;

    float spiral = sin(3.0 * (s.y - 0.12 * ftime) + 2.6 * log(rc / R_ISCO));
    I *= 1.0 + 0.30 * spiral * smoothstep(0.05, 0.30, rn) * (1.0 - smoothstep(0.85, 1.0, rn));
    I *= 1.0 + 0.10 * inner * sin(time * TAU / 34.0);

    float shock = ringWave(rc, beatAgeA, 4.2, 0.55) * exp(-beatAgeA / 1.3) * smoothstep(0.0, 0.05, beatAgeA)
                + 0.6 * ringWave(rc, beatAgeB, 4.2, 0.55) * exp(-beatAgeB / 1.3);
    I += lip * gS * 0.8 * shock * mAct;
    I += lip * gS * 1.3 * ringWave(rc, waveAge, 2.6, 1.1) * exp(-waveAge / 3.0) * smoothstep(0.0, 0.2, waveAge);
    vec3 col = ramp(clamp(1.0 - pow(rn, 0.6) + 0.15 * (g - 1.0), 0.0, 1.0)) * I;

    float band = smoothstep(0.40, 0.70, texture(noiseTex, vec2(0.13, vf * 40.0)).b);
    float dd = (0.6 - 0.3 * smoothstep(0.6, 0.95, rn)) * smoothstep(0.25, 0.6, rn) * (0.25 + 1.0 * band) * (0.6 + 0.8 * n.w);
    col *= 1.0 - 0.92 * specks(rc, s.y, J, dd);

    float fade = 1.0 - smoothstep(0.6 * R_OUT_T, R_OUT_T, rc + (n.w - 0.5) * 0.3 * R_OUT_T);
    vec4 pc = diskCell(rc, s.y - 0.02 * ftime, 38.0);
    float ph = h12(pc.xy + 4.7);
    float part = smoothstep(ph - 0.10, ph + 0.10, fade * 1.7) * (0.7 + 0.6 * h12(pc.xy + 9.1));
    fade = mix(part * fade * 1.4, fade, smoothstep(0.12, 0.40, fade));
    return vec4(col, (1.0 - exp(-tau)) * fade);
}

vec4 jac(vec4 s){
    vec2 cs = vec2(cos(s.y), sin(s.y));
    vec2 dcx = dFdx(cs), dcy = dFdy(cs);
    return vec4(dFdx(s.x), dFdy(s.x), cs.x * dcx.y - cs.y * dcx.x, cs.x * dcy.y - cs.y * dcy.x);
}

void main(){
    vec2 qtc = vec2(vUv.x, 1.0 - vUv.y);
    vec2 frag = boxOrigin + qtc * resolution;
    vec4 hz = texture(geoH, vUv);
    float hq = floor((hz.w + 5.0) / 10.0);
    float hit = hq * 0.25;
    vec3 E = vec3(0.0);
    float Tr = 1.0;
    vec4 s0 = texture(geoA, vUv);
    vec4 s1 = texture(geoB, vUv);
    vec4 J0 = jac(s0), J1 = jac(s1);

    float tAng = atan(frag.x - bhCenter.x, -(frag.y - bhCenter.y)) / TAU;
    tAng += tAng < 0.0 ? 1.0 : 0.0;
    float fill = 1.0 - smoothstep(musicProgress - 0.04, musicProgress + 0.02, tAng);
    float dh = (tAng - musicProgress + 0.01) / 0.03;
    float head = exp(-0.5 * dh * dh);
    float gain  = mix(1.0, mix(DIM_OFF, 1.0, fill) * (1.0 + 0.4 * head), musicActive);
    if (s0.z > 1e-6){
        vec4 c = shadeThin(s0, s0.w, 0.0, J0);
        c.rgb *= gain;
        E += c.a * c.rgb; Tr *= 1.0 - c.a;
    }
    if (Tr > 0.01 && s1.z > 1e-6){
        vec4 c = shadeThin(s1, s1.w, 1.0, J1);
        c.rgb *= gain;
        E += Tr * c.a * c.rgb; Tr *= 1.0 - c.a;
    }

    {
        float Rp = bhRadius / B_CRIT;
        float dpx = length(frag - bhCenter) - 0.9 * B_CRIT * Rp;
        float ring = exp(-0.5 * dpx * dpx / 0.64);
        float da = abs(fract(tAng - fract(time / 45.0) + 0.5) - 0.5) / 0.03;
        float sparkle = 1.0 + 0.8 * exp(-0.5 * da * da);
        float wavePulse = 1.0 + 1.5 * exp(-waveAge / 1.5) * smoothstep(0.0, 0.1, waveAge);
        E += Tr * ring * ramp(1.0) * 3.0 * gain * sparkle * wavePulse;
    }

    fragColor = vec4(E, 1.0 - Tr * (1.0 - hit));
}
`;

const PRE = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
out vec4 fragColor;
`;

/** Periodic 4 channel value noise, baked once (bhnoise.frag). */
export const NOISE_FRAG = `${PRE}
const float P = 16.0;
float hash(vec2 i, float s){
    i = mod(i, P);
    vec3 p3 = fract(vec3(i.xyx + s * 17.31) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}
float vnoise(vec2 p, float s){
    vec2 i = floor(p), f = fract(p);
    vec2 u = f*f*f*(f*(f*6.0 - 15.0) + 10.0);
    return mix(mix(hash(i, s), hash(i + vec2(1,0), s), u.x),
               mix(hash(i + vec2(0,1), s), hash(i + vec2(1,1), s), u.x), u.y);
}
void main(){
    vec2 p = vec2(vUv.x, 1.0 - vUv.y) * P;
    fragColor = vec4(vnoise(p, 1.0), vnoise(p, 2.0), vnoise(p, 3.0), vnoise(p, 4.0));
}
`;

/** Separable bloom with optional bright pass (bhbloom.frag). */
export const BLOOM_FRAG = `${PRE}
uniform sampler2D src;
uniform vec2 dir;
uniform vec2 texel;
uniform float threshold;
uniform float spread;
vec3 bright(vec3 c){
    float m = max(c.r, max(c.g, c.b));
    float k = threshold > 0.5 ? smoothstep(0.8, 2.2, m) : 1.0;
    return c * k;
}
void main(){
    vec3 acc = vec3(0.0); float ws = 0.0;
    for (int i = -14; i <= 14; i++){
        float x = float(i);
        float w = exp(-x*x/(2.0*16.0));
        acc += bright(texture(src, vUv + dir * texel * x * spread).rgb) * w; ws += w;
    }
    fragColor = vec4(acc / ws, 1.0);
}
`;

/** Separable gaussian over the whole premultiplied scene (bhsoft.frag). */
export const SOFT_FRAG = `${PRE}
uniform sampler2D src;
uniform vec2 dir;
uniform vec2 texel;
uniform float sigma;
void main(){
    vec4 acc = vec4(0.0); float ws = 0.0;
    for (int i = -10; i <= 10; i++){
        float x = float(i);
        float w = exp(-x * x / (2.0 * sigma * sigma));
        acc += texture(src, vUv + dir * texel * x) * w; ws += w;
    }
    fragColor = acc / ws;
}
`;

/** HDR + bloom, exposure, ACES by luminance, sRGB, premultiplied (bhcomp.frag). */
export const COMP_FRAG = `${PRE}
uniform float exposure;
uniform float bloomAmt;
uniform vec2 resolution;
uniform vec2 bhCenter;
uniform float bhRadius;
uniform vec4 tint;
uniform vec2 boxOrigin;
uniform float softAmt;
uniform vec2 edgeOpen;
uniform sampler2D scene;
uniform sampler2D bloom;
uniform sampler2D bloom2;
uniform sampler2D soft;
vec3 aces(vec3 x){ return clamp((x*(2.51*x+0.03))/(x*(2.43*x+0.59)+0.14), 0.0, 1.0); }
void main(){
    vec2 qtc = vec2(vUv.x, 1.0 - vUv.y);
    vec4 sc = texture(scene, vUv);
    vec4 sf = texture(soft, vUv);
    float dpx = length(boxOrigin + qtc * resolution - bhCenter);
    float outer = smoothstep(1.08 * bhRadius, 1.3 * bhRadius, dpx);
    float ek = smoothstep(0.01, 0.35, abs(sc.a - sf.a)) * softAmt * outer;
    sc = mix(sc, sf, ek);
    float bm = 1.0 - step(0.99, sc.a) * exp(-8.0 * dot(sc.rgb, vec3(0.2126, 0.7152, 0.0722)));
    vec2 px = qtc * resolution;
    float ef = smoothstep(0.0, 60.0, px.x + edgeOpen.x) * smoothstep(0.0, 60.0, resolution.y - px.y + edgeOpen.y);
    vec3 bl = (0.22 * texture(bloom, vUv).rgb + 0.38 * texture(bloom2, vUv).rgb) * tint.rgb * ef;
    vec3 h = sc.rgb + bm * bloomAmt * bl;
    vec3 e = h * exposure;
    float L = dot(e, vec3(0.2126, 0.7152, 0.0722));
    vec3 t = e * (aces(vec3(L)).g / max(L, 1e-4));
    float mx = max(max(t.r,t.g),t.b);
    t = mix(t, vec3(mx), 0.5 * smoothstep(1.0, 2.0, mx));
    vec3 cc = pow(clamp(t, 0.0, 1.0), vec3(1.0/2.2));
    float a = clamp(max(sc.a, max(max(cc.r, cc.g), cc.b)), 0.0, 1.0);
    fragColor = vec4(cc, a);
}
`;

/** Final pass: void, a sparse twinkling star field, and the black hole on top. */
export const PRESENT_FRAG = `${PRE}
uniform sampler2D bhTex;
uniform vec2 canvasSize;
uniform vec2 boxOrigin;
uniform vec2 boxSize;
uniform float scale;
uniform float time;
uniform float hasBh;
float h12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float stars(vec2 frag, float cell, float density, float seed){
    vec2 g = frag / cell;
    vec2 id = floor(g);
    float h = h12(id + seed);
    if (h > density) return 0.0;
    vec2 c = vec2(h12(id + seed + 3.1), h12(id + seed + 7.7)) * 0.8 + 0.1;
    float d = length((fract(g) - c) * cell);
    float tw = 0.75 + 0.25 * sin(time * (0.6 + 1.4 * h12(id + 1.7)) + 6.28 * h);
    return (1.0 - smoothstep(0.35 * scale, 1.25 * scale, d)) * (0.35 + 0.65 * h12(id + 9.3)) * tw;
}
void main(){
    vec2 frag = vec2(vUv.x, 1.0 - vUv.y) * canvasSize;
    vec2 q = vUv - 0.5;
    vec3 bg = vec3(0.012, 0.013, 0.016) * (1.0 - 0.6 * dot(q, q));
    float s = stars(frag, 46.0 * scale, 0.42, 1.0) + 0.6 * stars(frag, 23.0 * scale, 0.22, 5.0);
    bg += vec3(0.78, 0.8, 0.84) * s;
    vec4 b = vec4(0.0);
    vec2 bu = (frag - boxOrigin) / boxSize;
    if (hasBh > 0.5 && bu.x >= 0.0 && bu.y >= 0.0 && bu.x <= 1.0 && bu.y <= 1.0)
        b = texture(bhTex, vec2(bu.x, 1.0 - bu.y));
    fragColor = vec4(b.rgb + bg * (1.0 - b.a), 1.0);
}
`;
