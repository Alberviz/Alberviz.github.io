import React from "react";
import { OLIMPO_DEMO } from "@/content/olimpo";

/**
 * Olimpo's phone home ("the sky of the Hours") recreated at 390x844 with
 * invented data: the sky zone with date and weather, the black hole resting in
 * the corner (where Warp lives), what's next, today's stars and the thumb bar.
 */

const f = (n: number) => n - Math.floor(n);
const STARS = Array.from({ length: 46 }, (_, i) => ({
  x: +(f(Math.sin(i * 12.9898) * 43758.5453) * 390).toFixed(1),
  y: +(f(Math.sin(i * 78.233) * 12543.113) * 250).toFixed(1),
  r: +(0.4 + f(Math.sin(i * 39.425) * 9871.37) * 0.8).toFixed(2),
  o: +(0.2 + f(Math.sin(i * 7.13) * 3141.59) * 0.6).toFixed(2),
}));

export function SkyPhone({ locale }: { locale: "en" | "es" }) {
  const D = OLIMPO_DEMO;
  const [day, month] = D.date[locale].split(" · ");
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0A0E29] font-sans text-[#ECEEFA]">
      {/* Sky zone */}
      <div
        className="absolute inset-x-0 top-0 h-[300px]"
        style={{ background: "linear-gradient(180deg, #04071A 0px, #04071A 40px, #141B4D 41px, #1D2560 140px, #0A0E29 300px)" }}
      />
      <svg className="absolute left-0 top-0" width="390" height="300" viewBox="0 0 390 300" aria-hidden="true">
        {STARS.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y + 44} r={s.r} fill="#DCE0FF" opacity={s.o} />
        ))}
        <path d="M18 238 Q 190 150 372 226" fill="none" stroke="#8C92B4" strokeOpacity="0.5" strokeWidth="1.2" strokeDasharray="1.5 6" strokeLinecap="round" />
        <path d="M18 238 Q 120 186 238 182" fill="none" stroke="#F2B36F" strokeOpacity="0.8" strokeWidth="1.4" />
        <circle cx="238" cy="182" r="12" fill="#F2B36F" opacity="0.25" className="olimpo-now" />
        <circle cx="238" cy="182" r="4.5" fill="#FFE2BC" />
      </svg>

      {/* The black hole resting in the corner */}
      <div className="absolute -right-[34px] top-[22px] h-[92px] w-[92px] rounded-full" aria-hidden="true">
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: "radial-gradient(circle, #000 0 40%, rgb(242 179 111 / 0.55) 43%, rgb(242 179 111 / 0.12) 55%, transparent 70%)" }}
        />
        <div className="absolute left-[-30%] right-[-30%] top-[47%] h-[6%] rotate-[-17deg] rounded-full bg-[#F2B36F]/40" />
      </div>

      <p className="absolute left-6 top-[60px] font-mono text-[12px] text-[#8C92B4]">{D.city[locale]}</p>
      <p className="absolute left-6 top-[84px] font-olimpo text-[38px] leading-none">{day}</p>
      <p className="absolute left-6 top-[130px] text-[15px] text-[#B3B8D4]">{month}</p>
      <div className="absolute right-6 top-[96px] text-right">
        <p className="font-olimpo text-[44px] leading-none">4°</p>
        <p className="mt-1 text-[13px] text-[#B3B8D4]">{D.weather[locale].split(" · ")[1]}</p>
      </div>

      {/* What's next */}
      <div className="absolute left-4 right-4 top-[262px] rounded-[18px] border border-[#2A2F5A] bg-[#10153A] px-5 py-4">
        <p className="text-[12px] font-semibold tracking-[0.16em] text-[#8C92B4]">{D.next[locale].toUpperCase()}</p>
        <p className="mt-1.5 text-[17px] font-semibold">{D.nextItem[locale]}</p>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#232850]">
          <div className="h-full w-[38%] rounded-full bg-[#F2B36F]" />
        </div>
      </div>

      {/* Today */}
      <div className="absolute left-6 right-6 top-[380px]">
        <p className="font-olimpo text-[22px]">{D.focus[locale]}</p>
        <ul className="mt-2">
          {D.tasks.map((t, i) => (
            <li key={t.en} className="flex items-center gap-3.5 border-b border-[#1D2247] py-3 last:border-b-0">
              <span
                className={`grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full border ${
                  t.done ? "border-[#F2B36F] bg-[#F2B36F]" : i === 1 ? "border-[#F2B36F]" : "border-[#8C92B4]"
                }`}
              >
                {t.done && (
                  <svg width="11" height="9" viewBox="0 0 10 8" aria-hidden="true">
                    <path d="M1 4.2 L3.8 7 L9 1" fill="none" stroke="#1A1208" strokeWidth="1.8" />
                  </svg>
                )}
              </span>
              <span className="min-w-0">
                <span className={`block text-[15px] leading-snug ${t.done ? "text-[#8C92B4] line-through" : ""}`}>
                  {locale === "es" ? t.es : t.en}
                </span>
                <span className="block text-[12px] text-[#8C92B4]">● {t.project}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="absolute left-6 right-6 top-[680px]">
        <p className="text-[12px] font-semibold tracking-[0.16em] text-[#8C92B4]">{D.latest[locale].toUpperCase()}</p>
        <p className="mt-1.5 text-[14px] text-[#B3B8D4]">
          <span className="text-[#F2B36F]">✦ </span>
          {D.latestItem[locale]}
        </p>
      </div>

      {/* Thumb bar */}
      <div className="absolute bottom-5 left-4 right-4 flex h-[64px] items-center justify-around rounded-full border border-[#2A2F5A] bg-[#10153A]/95 px-2">
        {[
          { en: "Home", es: "Inicio" },
          { en: "Projects", es: "Proyectos" },
          { en: "Life", es: "Vida" },
          { en: "Agents", es: "Agentes" },
        ].map((item, i) => (
          <span
            key={item.en}
            className={`flex h-[50px] flex-1 items-center justify-center rounded-full text-[12px] font-semibold ${
              i === 0 ? "bg-[#ECEEFA] text-[#0A0E29]" : "text-[#B3B8D4]"
            }`}
          >
            {item[locale]}
          </span>
        ))}
      </div>
    </div>
  );
}
