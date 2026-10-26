"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowClockwise, Check, Receipt, SealCheck } from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import { KRAKOUNT_PAGE } from "@/content/krakount-data";
import { EASE_OUT, SPRING_LAYOUT, SPRING_NUMBER } from "@/lib/motion";

type Currency = "PLN" | "EUR";

// Official NBP Table A reference rate: 1 EUR = 4.28 PLN
const NBP_EUR_RATE = 4.28;

const FRIENDS = KRAKOUNT_PAGE.friends;
const ITEMS = KRAKOUNT_PAGE.receiptItems;

/** Minor units in the display currency. PLN stays in exact grosze; EUR is a display conversion. */
function toDisplayMinor(grosze: number, currency: Currency): number {
  return currency === "PLN" ? grosze : Math.round(grosze / NBP_EUR_RATE);
}

function formatMinor(minor: number, currency: Currency): string {
  const formatted = (minor / 100).toFixed(2).replace(".", ",");
  return currency === "PLN" ? `${formatted} zł` : `${formatted} €`;
}

function formatMoney(grosze: number, currency: Currency): string {
  return formatMinor(toDisplayMinor(grosze, currency), currency);
}

/**
 * Money ticker: springs between integer minor-unit values and always lands on
 * the exact target (each frame is rounded to a whole grosz or cent).
 */
function AnimatedMoney({
  grosze,
  currency,
  prefix = "",
  className = "",
}: {
  grosze: number;
  currency: Currency;
  prefix?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const target = toDisplayMinor(grosze, currency);
  const value = useSpring(target, SPRING_NUMBER);
  const text = useTransform(value, (v) => `${prefix}${formatMinor(Math.round(v), currency)}`);

  useEffect(() => {
    if (reduce) value.jump(target);
    else value.set(target);
  }, [target, reduce, value]);

  return (
    <motion.span className={`tabular-nums ${className}`} aria-label={`${prefix}${formatMinor(target, currency)}`}>
      {text}
    </motion.span>
  );
}

function initialClaimants(): Record<string, string[]> {
  const initial: Record<string, string[]> = {};
  for (const item of ITEMS) initial[item.id] = [...item.defaultClaimants];
  return initial;
}

const INITIAL_SETTLED: Record<string, boolean> = { lucia: false, pablo: false, marta: false };

export function ReceiptDebtSimulator() {
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const es = locale === "es";

  const [currency, setCurrency] = useState<Currency>("PLN");
  const [claimantsByItem, setClaimantsByItem] = useState<Record<string, string[]>>(initialClaimants);
  const [settledMap, setSettledMap] = useState<Record<string, boolean>>(INITIAL_SETTLED);
  const [selectedFriendId, setSelectedFriendId] = useState<string>("lucia");
  const [blocked, setBlocked] = useState<string | null>(null);
  const blockedTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (blockedTimer.current) window.clearTimeout(blockedTimer.current);
  }, []);

  const handleReset = () => {
    setClaimantsByItem(initialClaimants());
    setSettledMap(INITIAL_SETTLED);
    setSelectedFriendId("lucia");
  };

  // Toggle a claimant on an item. The last claimant cannot be removed (no divide by zero).
  const toggleClaimant = (itemId: string, friendId: string) => {
    const current = claimantsByItem[itemId] || [];
    const isClaimant = current.includes(friendId);

    if (isClaimant && current.length <= 1) {
      setBlocked(`${itemId}:${friendId}`);
      if (blockedTimer.current) window.clearTimeout(blockedTimer.current);
      blockedTimer.current = window.setTimeout(() => setBlocked(null), 360);
      return;
    }

    setClaimantsByItem((prev) => {
      const list = prev[itemId] || [];
      return {
        ...prev,
        [itemId]: list.includes(friendId) ? list.filter((id) => id !== friendId) : [...list, friendId],
      };
    });
  };

  const toggleSettled = (friendId: string) => {
    setSettledMap((prev) => ({ ...prev, [friendId]: !prev[friendId] }));
  };

  // Exact integer split per item and per friend (all values in grosze).
  const computation = useMemo(() => {
    const totalReceiptGrosze = ITEMS.reduce((acc, item) => acc + item.priceGrosze, 0);

    const friendSharesGrosze: Record<string, number> = { alberto: 0, lucia: 0, pablo: 0, marta: 0 };

    const itemBreakdowns: Record<
      string,
      {
        claimants: string[];
        baseShare: number;
        remainder: number;
        shares: Record<string, { amount: number; hasRemainderGrosz: boolean }>;
      }
    > = {};

    for (const item of ITEMS) {
      const claimants = claimantsByItem[item.id] || [];
      const count = claimants.length;
      const baseShare = count > 0 ? Math.floor(item.priceGrosze / count) : 0;
      const remainder = count > 0 ? item.priceGrosze % count : 0;

      // Deterministic claimant ordering based on the friends list
      const sortedClaimants = [...claimants].sort(
        (a, b) => FRIENDS.findIndex((f) => f.id === a) - FRIENDS.findIndex((f) => f.id === b)
      );

      const shares: Record<string, { amount: number; hasRemainderGrosz: boolean }> = {};
      sortedClaimants.forEach((fId, index) => {
        const hasExtra = index < remainder;
        const finalShare = baseShare + (hasExtra ? 1 : 0);
        shares[fId] = { amount: finalShare, hasRemainderGrosz: hasExtra };
        friendSharesGrosze[fId] = (friendSharesGrosze[fId] || 0) + finalShare;
      });

      itemBreakdowns[item.id] = { claimants: sortedClaimants, baseShare, remainder, shares };
    }

    // Alberto paid the whole receipt: everyone else owes him their exact share.
    const albertoOwnShare = friendSharesGrosze["alberto"] || 0;
    const albertoNetOwed = totalReceiptGrosze - albertoOwnShare;

    const roommateDebts = FRIENDS.filter((f) => f.id !== "alberto").map((friend) => ({
      friend,
      grosze: friendSharesGrosze[friend.id] || 0,
    }));

    const unsettledOwedGrosze = roommateDebts.reduce(
      (acc, r) => acc + (settledMap[r.friend.id] ? 0 : r.grosze),
      0
    );

    const sumOfShares = Object.values(friendSharesGrosze).reduce((a, b) => a + b, 0);

    return {
      totalReceiptGrosze,
      friendSharesGrosze,
      itemBreakdowns,
      albertoOwnShare,
      albertoNetOwed,
      roommateDebts,
      unsettledOwedGrosze,
      sumOfShares,
    };
  }, [claimantsByItem, settledMap]);

  const payer = FRIENDS[0];
  const selectedFriend = FRIENDS.find((f) => f.id === selectedFriendId) ?? FRIENDS[1];

  return (
    <div id="simulator" className="scroll-mt-16 border-t border-[#26272F] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[#F5A524]">
              {es ? "Simulador interactivo · aritmética entera" : "Interactive simulator · integer arithmetic"}
            </p>
            <h2 className="text-balance text-[clamp(1.9rem,3.4vw,2.75rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-[#EDEDEF]">
              {KRAKOUNT_PAGE.simulator.heading[locale]}
            </h2>
            <p className="mt-4 max-w-[62ch] text-pretty text-[15px] leading-relaxed text-[#8B8D98]">
              {KRAKOUNT_PAGE.simulator.subheading[locale]}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-end">
            <LayoutGroup id="sim-currency">
              <div
                role="radiogroup"
                aria-label={KRAKOUNT_PAGE.simulator.currencyToggleLabel[locale]}
                className="flex items-center rounded-full border border-[#26272F] bg-[#17181E] p-1 text-[12.5px] font-semibold"
              >
                {(["PLN", "EUR"] as const).map((c) => {
                  const selected = currency === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setCurrency(c)}
                      className={`relative isolate rounded-full px-3.5 py-1.5 tabular-nums transition-colors duration-150 press-scale ${
                        selected ? "text-[#16130A]" : "text-[#8B8D98] hover:text-[#EDEDEF]"
                      }`}
                    >
                      {selected && (
                        <motion.span
                          layoutId="sim-currency-pill"
                          aria-hidden="true"
                          className="absolute inset-0 -z-10 rounded-full bg-[#F5A524]"
                          transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                        />
                      )}
                      {c === "PLN" ? "PLN zł" : "EUR €"}
                    </button>
                  );
                })}
              </div>
            </LayoutGroup>
            <span className="hidden font-mono text-[11px] tabular-nums text-[#8B8D98] lg:inline">
              1 EUR = {es ? "4,28" : "4.28"} PLN
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="grid h-9 w-9 place-items-center rounded-full border border-[#26272F] text-[#8B8D98] transition-colors duration-150 hover:text-[#EDEDEF] press-scale"
              aria-label={es ? "Reiniciar simulador" : "Reset simulator"}
              title={es ? "Reiniciar" : "Reset"}
            >
              <ArrowClockwise size={15} />
            </button>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Receipt: one continuous thermal sheet */}
          <div className="overflow-hidden rounded-2xl border border-[#26272F] bg-[#17181E] lg:col-span-7">
            <div className="border-b border-dashed border-[#26272F] px-5 py-5 text-center font-mono">
              <div className="flex items-center justify-center gap-2 text-[11.5px] font-bold tracking-[0.06em] text-[#EDEDEF]">
                <Receipt size={15} className="text-[#F5A524]" aria-hidden="true" />
                {KRAKOUNT_PAGE.simulator.receiptHeader}
              </div>
              <div className="mt-1.5 text-[10.5px] tabular-nums text-[#8B8D98]">
                NIP 779-10-11-327 · 2026-10-26 19:42 · KASA 04
              </div>
              <div className="mt-3 inline-flex items-center gap-1.5 font-sans text-[12px] text-[#EDEDEF]">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: payer.colorHex }} />
                {KRAKOUNT_PAGE.simulator.paidByLabel[locale]}
              </div>
            </div>

            <ul>
              {ITEMS.map((item) => {
                const itemData = computation.itemBreakdowns[item.id];
                const claimants = itemData?.claimants ?? [];
                return (
                  <li key={item.id} className="border-b border-[#26272F] px-5 py-4 last:border-b-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="truncate font-mono text-[12.5px] font-bold uppercase text-[#EDEDEF]">
                          {item.polishName}
                        </div>
                        <div className="mt-0.5 text-[12.5px] text-[#8B8D98]">{item.translatedName[locale]}</div>
                      </div>
                      <AnimatedMoney
                        grosze={item.priceGrosze}
                        currency={currency}
                        className="shrink-0 text-[14.5px] font-bold text-[#EDEDEF]"
                      />
                    </div>

                    {/* Split line: one segment per claimant, reflowing with layout springs */}
                    <div className="mt-3 flex h-1 gap-[3px] overflow-hidden rounded-full" aria-hidden="true">
                      {claimants.map((fid) => {
                        const friend = FRIENDS.find((f) => f.id === fid);
                        return (
                          <motion.span
                            key={fid}
                            layout={!reduce}
                            transition={SPRING_LAYOUT}
                            className="h-full flex-1 rounded-full"
                            style={{ backgroundColor: friend?.colorHex ?? "#26272F" }}
                          />
                        );
                      })}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      {FRIENDS.map((friend) => {
                        const isClaimant = claimants.includes(friend.id);
                        const share = itemData?.shares[friend.id];
                        const isBlocked = blocked === `${item.id}:${friend.id}`;
                        return (
                          <motion.button
                            key={friend.id}
                            type="button"
                            onClick={() => toggleClaimant(item.id, friend.id)}
                            aria-pressed={isClaimant}
                            aria-label={`${friend.name}: ${
                              isClaimant && share
                                ? formatMoney(share.amount, currency)
                                : es
                                ? "añadir"
                                : "add"
                            }`}
                            title={
                              isBlocked
                                ? es
                                  ? "Al menos una persona debe pagar esta línea"
                                  : "At least one person must claim this line"
                                : undefined
                            }
                            animate={
                              isBlocked && !reduce
                                ? {
                                    transform: [
                                      "translateX(0px)",
                                      "translateX(-3px)",
                                      "translateX(3px)",
                                      "translateX(-2px)",
                                      "translateX(0px)",
                                    ],
                                  }
                                : { transform: "translateX(0px)" }
                            }
                            transition={{ duration: 0.3, ease: EASE_OUT }}
                            className={`inline-flex items-center gap-1.5 rounded-full border py-1 pl-1 pr-2.5 text-[12px] font-semibold transition-[color,background-color,border-color,scale] duration-150 active:scale-[0.97] ${
                              isClaimant
                                ? "border-[#3A3B45] bg-[#1F2027] text-[#EDEDEF]"
                                : "border-[#26272F] text-[#8B8D98]/70 hover:text-[#EDEDEF]"
                            }`}
                          >
                            <span
                              aria-hidden="true"
                              className="grid h-5 w-5 place-items-center rounded-full text-[9px] font-bold transition-colors duration-150"
                              style={{
                                backgroundColor: isClaimant ? friend.colorHex : "#26272F",
                                color: isClaimant ? "#0E0F13" : "#8B8D98",
                              }}
                            >
                              {friend.initials}
                            </span>
                            {friend.name}
                            {isClaimant && share && (
                              <AnimatedMoney
                                grosze={share.amount}
                                currency={currency}
                                className="font-mono text-[10.5px] font-medium text-[#8B8D98]"
                              />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-dashed border-[#26272F] px-5 py-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <div className="font-mono text-[11px] font-bold uppercase tracking-[0.06em] text-[#8B8D98]">
                    SUMA PLN
                  </div>
                  {currency === "EUR" && (
                    <div className="mt-1 font-mono text-[11px] tabular-nums text-[#8B8D98]">
                      {formatMoney(computation.totalReceiptGrosze, "PLN")} NBP
                    </div>
                  )}
                </div>
                <AnimatedMoney
                  grosze={computation.totalReceiptGrosze}
                  currency={currency}
                  className="text-[1.6rem] font-extrabold tracking-[-0.02em] text-[#EDEDEF]"
                />
              </div>

              {/* Integer proof: every grosz assigned exactly once */}
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#1F2027] px-3 py-2.5 font-mono text-[11.5px] tabular-nums text-[#8B8D98]">
                <SealCheck
                  size={15}
                  weight="fill"
                  className={computation.sumOfShares === computation.totalReceiptGrosze ? "text-[#3DD68C]" : "text-[#FF6B5B]"}
                  aria-hidden="true"
                />
                <span>
                  {es ? "Suma de partes" : "Sum of shares"} = {computation.sumOfShares} gr
                  <span className="text-[#EDEDEF]"> = </span>
                  {computation.totalReceiptGrosze} gr {es ? "del ticket" : "on the receipt"}
                </span>
              </div>
            </div>
          </div>

          {/* Balances sheet */}
          <div className="overflow-hidden rounded-2xl border border-[#26272F] bg-[#17181E] lg:col-span-5">
            <div className="px-5 py-5">
              <h3 className="text-[15px] font-bold text-[#EDEDEF]">
                {es ? "Saldos netos en tiempo real" : "Realtime net balances"}
              </h3>
              <p className="mt-0.5 text-[12.5px] text-[#8B8D98]">
                {es ? "Aritmética entera, cero deriva de redondeo" : "Integer math, zero rounding drift"}
              </p>
            </div>

            {/* Payer */}
            <div className="flex items-center justify-between gap-4 border-y border-[#26272F] bg-[#1F2027]/50 px-5 py-4">
              <div className="flex items-center gap-3">
                <span
                  className="grid h-9 w-9 place-items-center rounded-full text-[11px] font-bold text-[#16130A]"
                  style={{ backgroundColor: payer.colorHex }}
                >
                  {payer.initials}
                </span>
                <div>
                  <div className="text-[14px] font-bold text-[#EDEDEF]">{payer.name}</div>
                  <div className="text-[12px] text-[#8B8D98]">{es ? "Pagó en caja · le deben" : "Paid at checkout · is owed"}</div>
                </div>
              </div>
              <div className="text-right">
                <AnimatedMoney
                  grosze={computation.albertoNetOwed}
                  currency={currency}
                  prefix="+"
                  className="block text-[1.35rem] font-extrabold tracking-[-0.02em] text-[#3DD68C]"
                />
                <span className="font-mono text-[10.5px] text-[#8B8D98]">
                  {es ? "consumo propio" : "own share"} {formatMoney(computation.albertoOwnShare, currency)}
                </span>
              </div>
            </div>

            {/* Roommates */}
            <ul>
              {computation.roommateDebts.map(({ friend, grosze }) => {
                const isSettled = !!settledMap[friend.id];
                const fraction = computation.totalReceiptGrosze > 0 ? grosze / computation.totalReceiptGrosze : 0;
                return (
                  <li key={friend.id} className="border-b border-[#26272F] px-5 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span
                          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-bold text-[#0E0F13]"
                          style={{ backgroundColor: friend.colorHex }}
                        >
                          {friend.initials}
                        </span>
                        <div className="min-w-0">
                          <div className="text-[13.5px] font-semibold text-[#EDEDEF]">{friend.name}</div>
                          <div className="text-[11.5px] text-[#8B8D98]">
                            {isSettled
                              ? es
                                ? "Liquidado con Alberto"
                                : "Settled with Alberto"
                              : es
                              ? "Debe a Alberto"
                              : "Owes Alberto"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <AnimatedMoney
                          grosze={grosze}
                          currency={currency}
                          prefix="-"
                          className={`text-[14.5px] font-bold transition-colors duration-200 ${
                            isSettled ? "text-[#8B8D98] line-through" : "text-[#FF6B5B]"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => toggleSettled(friend.id)}
                          aria-pressed={isSettled}
                          className={`inline-flex h-7 items-center gap-1 rounded-full border px-2.5 text-[11.5px] font-semibold transition-colors duration-150 press-scale ${
                            isSettled
                              ? "border-[#3DD68C]/30 bg-[#3DD68C]/10 text-[#3DD68C]"
                              : "border-[#26272F] text-[#EDEDEF] hover:border-[#F5A524]/50"
                          }`}
                        >
                          <AnimatePresence initial={false} mode="popLayout">
                            {isSettled && (
                              <motion.span
                                key="check"
                                initial={{ opacity: 0, transform: "scale(0.6)" }}
                                animate={{ opacity: 1, transform: "scale(1)" }}
                                exit={{ opacity: 0, transform: "scale(0.6)" }}
                                transition={{ duration: 0.18, ease: EASE_OUT }}
                                className="inline-flex"
                              >
                                <Check size={11} weight="bold" aria-hidden="true" />
                              </motion.span>
                            )}
                          </AnimatePresence>
                          {isSettled ? (es ? "Liquidado" : "Settled") : es ? "Marcar pagado" : "Mark settled"}
                        </button>
                      </div>
                    </div>

                    {/* Share of the receipt, as a proportion bar (scaleX only) */}
                    <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#26272F]" aria-hidden="true">
                      <motion.span
                        className="block h-full origin-left rounded-full"
                        style={{ backgroundColor: friend.colorHex }}
                        initial={false}
                        animate={{
                          transform: `scaleX(${fraction.toFixed(4)})`,
                          opacity: isSettled ? 0.3 : 1,
                        }}
                        transition={reduce ? { duration: 0 } : { type: "spring", ...SPRING_NUMBER }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center justify-between px-5 py-4 text-[13px]">
              <span className="text-[#8B8D98]">{es ? "Pendiente de cobrar" : "Pending to collect"}</span>
              <AnimatedMoney
                grosze={computation.unsettledOwedGrosze}
                currency={currency}
                className="text-[15px] font-extrabold text-[#EDEDEF]"
              />
            </div>

            {/* Why do I owe this? */}
            <div className="border-t border-[#26272F] px-5 py-5">
              <h4 className="text-[13.5px] font-bold text-[#EDEDEF]">{KRAKOUNT_PAGE.simulator.whyLabel[locale]}</h4>

              <LayoutGroup id="sim-why">
                <div role="tablist" className="mt-3 flex items-center gap-1 rounded-full bg-[#1F2027] p-1">
                  {FRIENDS.slice(1).map((friend) => {
                    const selected = selectedFriendId === friend.id;
                    return (
                      <button
                        key={friend.id}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        onClick={() => setSelectedFriendId(friend.id)}
                        className={`relative isolate flex-1 rounded-full py-1.5 text-[12px] font-semibold transition-colors duration-150 press-scale ${
                          selected ? "text-[#EDEDEF]" : "text-[#8B8D98] hover:text-[#EDEDEF]"
                        }`}
                      >
                        {selected && (
                          <motion.span
                            layoutId="sim-why-pill"
                            aria-hidden="true"
                            className="absolute inset-0 -z-10 rounded-full border border-[#3A3B45] bg-[#17181E]"
                            transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                          />
                        )}
                        {friend.name}
                      </button>
                    );
                  })}
                </div>
              </LayoutGroup>

              <AnimatePresence mode="wait" initial={false}>
                <motion.ul
                  key={selectedFriend.id}
                  initial={{ opacity: 0, transform: reduce ? "none" : "translateY(6px)" }}
                  animate={{ opacity: 1, transform: "translateY(0px)" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: EASE_OUT }}
                  className="mt-3"
                >
                  {ITEMS.map((item) => {
                    const itemData = computation.itemBreakdowns[item.id];
                    const share = itemData?.shares[selectedFriend.id];
                    if (!share) return null;
                    const count = itemData?.claimants.length || 1;
                    return (
                      <li
                        key={item.id}
                        className="flex items-center justify-between gap-3 border-b border-[#26272F]/70 py-2.5 text-[12.5px] last:border-b-0"
                      >
                        <div className="min-w-0">
                          <span className="block truncate text-[#EDEDEF]">{item.translatedName[locale]}</span>
                          <span className="font-mono text-[10.5px] tabular-nums text-[#8B8D98]">
                            {item.priceGrosze} gr / {count}
                            {share.hasRemainderGrosz && <span className="text-[#F5A524]"> +1 gr</span>}
                          </span>
                        </div>
                        <span className="shrink-0 font-mono font-semibold tabular-nums text-[#EDEDEF]">
                          {formatMoney(share.amount, currency)}
                        </span>
                      </li>
                    );
                  })}
                </motion.ul>
              </AnimatePresence>

              <div className="mt-3 flex items-center justify-between border-t border-[#26272F] pt-3 text-[12.5px]">
                <span className="text-[#8B8D98]">{es ? "Deuda exacta" : "Exact debt"}</span>
                <AnimatedMoney
                  grosze={computation.friendSharesGrosze[selectedFriend.id] || 0}
                  currency={currency}
                  prefix="-"
                  className="font-mono text-[14px] font-bold text-[#FF6B5B]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
