"use client";

import React, { useState, useMemo } from "react";
import {
  ArrowsLeftRight,
  Check,
  Receipt,
  User,
  ArrowRight,
  Info,
  ArrowClockwise,
} from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import { KRAKOUNT_PAGE } from "@/content/krakount-data";
import type { KrakountFriend, ReceiptSimItem } from "@/content/types";

type Currency = "PLN" | "EUR";

// Official NBP Table A reference rate: 1 EUR = 4.28 PLN
const NBP_EUR_RATE = 4.28;

export function ReceiptDebtSimulator() {
  const { locale } = useLocale();
  const [currency, setCurrency] = useState<Currency>("PLN");

  // Initial state: each receipt item mapped to its default claimants
  const [claimantsByItem, setClaimantsByItem] = useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = {};
    for (const item of KRAKOUNT_PAGE.receiptItems) {
      initial[item.id] = [...item.defaultClaimants];
    }
    return initial;
  });

  // Track settlement status for roommates (Alberto is the payer)
  const [settledMap, setSettledMap] = useState<Record<string, boolean>>({
    lucia: false,
    pablo: false,
    marta: false,
  });

  // Selected friend for the "Why do I owe this?" breakdown
  const [selectedFriendId, setSelectedFriendId] = useState<string>("lucia");

  // Reset to default
  const handleReset = () => {
    const initial: Record<string, string[]> = {};
    for (const item of KRAKOUNT_PAGE.receiptItems) {
      initial[item.id] = [...item.defaultClaimants];
    }
    setClaimantsByItem(initial);
    setSettledMap({ lucia: false, pablo: false, marta: false });
    setSelectedFriendId("lucia");
  };

  // Toggle friend claimant on an item (always keep >= 1 claimant to prevent divide by zero)
  const toggleClaimant = (itemId: string, friendId: string) => {
    setClaimantsByItem((prev) => {
      const current = prev[itemId] || [];
      const isClaimant = current.includes(friendId);

      if (isClaimant) {
        if (current.length <= 1) {
          // Cannot remove the last remaining claimant
          return prev;
        }
        return {
          ...prev,
          [itemId]: current.filter((id) => id !== friendId),
        };
      } else {
        return {
          ...prev,
          [itemId]: [...current, friendId],
        };
      }
    });
  };

  // Toggle settlement for a roommate
  const toggleSettled = (friendId: string) => {
    setSettledMap((prev) => ({
      ...prev,
      [friendId]: !prev[friendId],
    }));
  };

  // Helper: Format minor units (grosze) to string in active currency
  const formatMoney = (grosze: number, curr: Currency = currency): string => {
    if (curr === "PLN") {
      const formatted = (grosze / 100).toFixed(2).replace(".", ",");
      return `${formatted} zł`;
    } else {
      // Deterministic conversion: grosze to EUR cents using integer math
      const eurCents = Math.round(grosze / NBP_EUR_RATE);
      const formatted = (eurCents / 100).toFixed(2).replace(".", ",");
      return `${formatted} €`;
    }
  };

  // Detailed integer split computation per item & per friend
  const computation = useMemo(() => {
    const totalReceiptGrosze = KRAKOUNT_PAGE.receiptItems.reduce(
      (acc, item) => acc + item.priceGrosze,
      0
    );

    // Friend shares by friend ID
    const friendSharesGrosze: Record<string, number> = {
      alberto: 0,
      lucia: 0,
      pablo: 0,
      marta: 0,
    };

    // Item breakdowns: for each item, map each claimant to their exact share and if they received remainder
    const itemBreakdowns: Record<
      string,
      {
        claimants: string[];
        baseShare: number;
        remainder: number;
        shares: Record<string, { amount: number; hasRemainderGrosz: boolean }>;
      }
    > = {};

    for (const item of KRAKOUNT_PAGE.receiptItems) {
      const claimants = claimantsByItem[item.id] || [];
      const count = claimants.length;
      const baseShare = count > 0 ? Math.floor(item.priceGrosze / count) : 0;
      const remainder = count > 0 ? item.priceGrosze % count : 0;

      // Deterministic claimant ordering based on KRAKOUNT_PAGE.friends index
      const sortedClaimants = [...claimants].sort((a, b) => {
        const idxA = KRAKOUNT_PAGE.friends.findIndex((f) => f.id === a);
        const idxB = KRAKOUNT_PAGE.friends.findIndex((f) => f.id === b);
        return idxA - idxB;
      });

      const shares: Record<string, { amount: number; hasRemainderGrosz: boolean }> = {};

      sortedClaimants.forEach((fId, index) => {
        const hasExtra = index < remainder;
        const finalShare = baseShare + (hasExtra ? 1 : 0);
        shares[fId] = {
          amount: finalShare,
          hasRemainderGrosz: hasExtra,
        };
        friendSharesGrosze[fId] = (friendSharesGrosze[fId] || 0) + finalShare;
      });

      itemBreakdowns[item.id] = {
        claimants: sortedClaimants,
        baseShare,
        remainder,
        shares,
      };
    }

    // Alberto paid 100% of checkout:
    // Alberto's net balance = Total Receipt - Alberto's Own Share = Lucía's + Pablo's + Marta's shares
    const albertoOwnShare = friendSharesGrosze["alberto"] || 0;
    const albertoNetOwed = totalReceiptGrosze - albertoOwnShare;

    // Roommate balances: each roommate owes their exact share to Alberto
    const roommateDebts = [
      { friend: KRAKOUNT_PAGE.friends[1], grosze: friendSharesGrosze["lucia"] || 0 }, // Lucía
      { friend: KRAKOUNT_PAGE.friends[2], grosze: friendSharesGrosze["pablo"] || 0 }, // Pablo
      { friend: KRAKOUNT_PAGE.friends[3], grosze: friendSharesGrosze["marta"] || 0 }, // Marta
    ];

    // Unsettled total owed to Alberto
    const unsettledOwedGrosze = roommateDebts.reduce((acc, r) => {
      return acc + (settledMap[r.friend.id] ? 0 : r.grosze);
    }, 0);

    return {
      totalReceiptGrosze,
      friendSharesGrosze,
      itemBreakdowns,
      albertoOwnShare,
      albertoNetOwed,
      roommateDebts,
      unsettledOwedGrosze,
    };
  }, [claimantsByItem, settledMap]);

  const selectedFriend =
    KRAKOUNT_PAGE.friends.find((f) => f.id === selectedFriendId) || KRAKOUNT_PAGE.friends[1];

  return (
    <section id="simulator" className="py-20 bg-[#0E0F13] relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[#26272F]">
          <div>
            {/* Eyebrow 2 of 2 across the page */}
            <div className="text-[11px] font-bold uppercase tracking-widest text-[#F5A524] mb-2.5">
              {locale === "es"
                ? "SIMULADOR INTERACTIVO · ARITMÉTICA ENTERA"
                : "INTERACTIVE SIMULATOR · INTEGER ARITHMETIC"}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.02em] text-[#EDEDEF]">
              {KRAKOUNT_PAGE.simulator.heading[locale]}
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-[#8B8D98] max-w-2xl leading-relaxed">
              {KRAKOUNT_PAGE.simulator.subheading[locale]}
            </p>
          </div>

          {/* Interactive Top Controls */}
          <div className="flex items-center gap-3 self-start md:self-end">
            {/* Currency toggle */}
            <button
              type="button"
              onClick={() => setCurrency((c) => (c === "PLN" ? "EUR" : "PLN"))}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-[#26272F] bg-[#1F2027] text-xs sm:text-sm font-semibold text-[#EDEDEF] hover:border-[#F5A524]/50 press-scale transition-colors"
              title={KRAKOUNT_PAGE.simulator.currencyToggleLabel[locale]}
            >
              <ArrowsLeftRight size={15} className="text-[#F5A524]" />
              <span>{currency === "PLN" ? "PLN (zł)" : "EUR (€)"}</span>
              <span className="text-[10px] text-[#8B8D98] font-mono tabular-nums">
                1 EUR = 4.28 PLN
              </span>
            </button>

            {/* Reset button */}
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-[#26272F] bg-[#17181E] text-xs font-medium text-[#8B8D98] hover:text-[#EDEDEF] hover:border-[#26272F] press-scale transition-colors"
              title={locale === "es" ? "Restablecer valores" : "Reset simulator"}
            >
              <ArrowClockwise size={14} />
              <span className="hidden sm:inline">{locale === "es" ? "Reiniciar" : "Reset"}</span>
            </button>
          </div>
        </div>

        {/* Simulator Grid (7 cols receipt + 5 cols live balances) */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Continuous Single-Sheet Paragon Fiskalny */}
          <div className="lg:col-span-7 bg-[#17181E] border border-[#26272F] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            {/* Thermal Receipt Header */}
            <div className="bg-[#1F2027]/70 border-b border-[#26272F] p-4 sm:p-5 text-center">
              <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold tracking-wider text-[#F5A524]">
                <Receipt size={16} />
                <span>{KRAKOUNT_PAGE.simulator.receiptHeader}</span>
              </div>
              <div className="mt-1 flex items-center justify-center gap-3 text-[11px] font-mono text-[#8B8D98]">
                <span>NIP: 779-10-11-327</span>
                <span>·</span>
                <span>2026-10-26 19:42</span>
                <span>·</span>
                <span>KASA #04</span>
              </div>
              <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#17181E] border border-[#26272F] text-[11px] text-[#EDEDEF]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3DD68C]" />
                <span className="font-medium">{KRAKOUNT_PAGE.simulator.paidByLabel[locale]}</span>
              </div>
            </div>

            {/* Receipt Items List */}
            <div className="divide-y divide-[#26272F] p-2 sm:p-3">
              {KRAKOUNT_PAGE.receiptItems.map((item) => {
                const itemData = computation.itemBreakdowns[item.id];
                const claimants = claimantsByItem[item.id] || [];
                const count = claimants.length;
                const perPersonGrosze = count > 0 ? Math.floor(item.priceGrosze / count) : 0;

                return (
                  <div
                    key={item.id}
                    className="p-3 sm:p-4 rounded-xl hover:bg-[#1F2027]/40 transition-colors"
                  >
                    {/* Top Row: Polish Name + Price */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs sm:text-sm font-bold tracking-tight text-[#EDEDEF] uppercase font-mono">
                          {item.polishName}
                        </div>
                        <div className="text-xs text-[#8B8D98] mt-0.5">
                          {item.translatedName[locale]}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="tabular-nums font-bold text-sm sm:text-base text-[#EDEDEF]">
                          {formatMoney(item.priceGrosze)}
                        </div>
                        <div className="text-[11px] text-[#8B8D98] font-mono tabular-nums">
                          {count}{" "}
                          {count === 1
                            ? locale === "es"
                              ? "persona"
                              : "person"
                            : locale === "es"
                            ? "personas"
                            : "people"}
                          {" · ~"}
                          {formatMoney(perPersonGrosze)}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row: Tactile Friend Claimants Row */}
                    <div className="mt-3 pt-2.5 border-t border-[#26272F]/50 flex items-center justify-between flex-wrap gap-2">
                      <span className="text-[11px] text-[#8B8D98]">
                        {locale === "es" ? "Participantes:" : "Claimants:"}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {KRAKOUNT_PAGE.friends.map((friend) => {
                          const isClaimant = claimants.includes(friend.id);
                          const shareInfo = itemData?.shares[friend.id];

                          return (
                            <button
                              key={friend.id}
                              type="button"
                              onClick={() => toggleClaimant(item.id, friend.id)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold press-scale transition-colors ${
                                isClaimant
                                  ? "bg-[#1F2027] text-[#EDEDEF] border border-[#26272F] shadow-sm"
                                  : "bg-transparent text-[#8B8D98]/50 border border-transparent hover:border-[#26272F] hover:text-[#8B8D98]"
                              }`}
                              style={
                                isClaimant
                                  ? {
                                      borderColor: `${friend.colorHex}55`,
                                    }
                                  : undefined
                              }
                              title={`${friend.name}: ${
                                isClaimant
                                  ? shareInfo
                                    ? formatMoney(shareInfo.amount)
                                    : "Active"
                                  : locale === "es"
                                  ? "Pulsar para añadir"
                                  : "Click to add"
                              }`}
                            >
                              <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{
                                  backgroundColor: isClaimant ? friend.colorHex : "#26272F",
                                }}
                              />
                              <span>{friend.name}</span>
                              {isClaimant && shareInfo && (
                                <span className="text-[10px] text-[#8B8D98] font-mono tabular-nums">
                                  {formatMoney(shareInfo.amount)}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Receipt Summary Footer */}
            <div className="bg-[#1F2027]/70 border-t border-[#26272F] p-4 sm:p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#8B8D98] block">
                  {locale === "es" ? "TOTAL TICKET FISCAL" : "RECEIPT TOTAL FISCAL"}
                </span>
                <span className="text-[11px] text-[#8B8D98]">
                  {locale === "es"
                    ? "Suma exacta verificada al grosz"
                    : "Exact sum verified to the grosz"}
                </span>
              </div>
              <div className="text-right">
                <span className="tabular-nums text-xl sm:text-2xl font-extrabold text-[#EDEDEF]">
                  {formatMoney(computation.totalReceiptGrosze)}
                </span>
                {currency === "EUR" && (
                  <span className="block text-[11px] text-[#8B8D98] font-mono tabular-nums">
                    ({(computation.totalReceiptGrosze / 100).toFixed(2).replace(".", ",")} zł NBP)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Live Net Balance Card, Minimization Graph & Why Breakdown */}
          <div className="lg:col-span-5 space-y-6">
            {/* Card 1: Net Balances Card */}
            <div className="bg-[#17181E] border border-[#26272F] rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-[#26272F]">
                <div>
                  <h3 className="text-base font-bold text-[#EDEDEF]">
                    {locale === "es" ? "Saldos Netos en Tiempo Real" : "Realtime Net Balances"}
                  </h3>
                  <p className="text-xs text-[#8B8D98]">
                    {locale === "es"
                      ? "Aritmética entera sin errores de redondeo"
                      : "Integer math with zero rounding drift"}
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#1F2027] text-[10px] font-mono text-[#F5A524] border border-[#26272F]">
                  NBP Tab A
                </span>
              </div>

              {/* Alberto's Card (The Payer) */}
              <div className="mt-4 p-4 rounded-xl bg-[#1F2027]/60 border border-[#26272F] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-[#16130A]"
                    style={{ backgroundColor: KRAKOUNT_PAGE.friends[0].colorHex }}
                  >
                    AV
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#EDEDEF] flex items-center gap-1.5">
                      <span>Alberto</span>
                      <span className="text-[10px] font-normal px-1.5 py-0.2 rounded bg-[#17181E] text-[#8B8D98]">
                        {locale === "es" ? "Pagó en caja" : "Payer"}
                      </span>
                    </div>
                    <div className="text-xs text-[#8B8D98]">
                      {locale === "es" ? "Le deben en total:" : "Owed in total:"}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="tabular-nums text-lg sm:text-xl font-extrabold text-[#3DD68C] block">
                    +{formatMoney(computation.albertoNetOwed)}
                  </span>
                  <span className="text-[10px] text-[#8B8D98] font-mono">
                    ({locale === "es" ? "consumo propio" : "own share"}:{" "}
                    {formatMoney(computation.albertoOwnShare)})
                  </span>
                </div>
              </div>

              {/* Roommates Balances (Negative in Coral #FF6B5B) */}
              <div className="mt-4 space-y-2.5">
                {computation.roommateDebts.map(({ friend, grosze }) => {
                  const isSettled = settledMap[friend.id];

                  return (
                    <div
                      key={friend.id}
                      className="p-3 rounded-xl bg-[#1F2027]/30 border border-[#26272F] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                          style={{ backgroundColor: friend.colorHex }}
                        >
                          {friend.initials}
                        </div>
                        <div>
                          <span className="text-xs sm:text-sm font-semibold text-[#EDEDEF] block">
                            {friend.name}
                          </span>
                          <span className="text-[10px] text-[#8B8D98]">
                            {isSettled
                              ? locale === "es"
                                ? "Liquidado con Alberto"
                                : "Settled with Alberto"
                              : locale === "es"
                              ? "Debe a Alberto"
                              : "Owes Alberto"}
                          </span>
                        </div>
                      </div>

                      <div className="text-right flex items-center gap-2.5">
                        <span
                          className={`tabular-nums text-sm sm:text-base font-bold ${
                            isSettled ? "text-[#8B8D98] line-through" : "text-[#FF6B5B]"
                          }`}
                        >
                          -{formatMoney(grosze)}
                        </span>

                        <button
                          type="button"
                          onClick={() => toggleSettled(friend.id)}
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full press-scale transition-colors ${
                            isSettled
                              ? "bg-[#3DD68C]/15 text-[#3DD68C] border border-[#3DD68C]/30"
                              : "bg-[#17181E] text-[#EDEDEF] border border-[#26272F] hover:border-[#F5A524]/50"
                          }`}
                        >
                          {isSettled ? (
                            <>
                              <Check size={12} weight="bold" />
                              <span>{locale === "es" ? "Liquidado ✓" : "Settled ✓"}</span>
                            </>
                          ) : (
                            <span>{locale === "es" ? "Marcar Pagado" : "Mark Settled"}</span>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Unsettled Remaining Metric */}
              <div className="mt-4 pt-4 border-t border-[#26272F] flex items-center justify-between text-xs">
                <span className="text-[#8B8D98]">
                  {locale === "es" ? "Pendiente de cobrar:" : "Pending to collect:"}
                </span>
                <span className="tabular-nums font-extrabold text-[#F5A524]">
                  {formatMoney(computation.unsettledOwedGrosze)}
                </span>
              </div>
            </div>

            {/* Card 2: "Why do I owe this?" Integer Breakdown */}
            <div className="bg-[#17181E] border border-[#26272F] rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#26272F]">
                <div className="flex items-center gap-1.5 text-sm font-bold text-[#EDEDEF]">
                  <Info size={16} className="text-[#F5A524]" />
                  <span>{KRAKOUNT_PAGE.simulator.whyLabel[locale]}</span>
                </div>
              </div>

              {/* Friend Selector Tabs */}
              <div className="mt-4 flex items-center gap-2">
                {KRAKOUNT_PAGE.friends.slice(1).map((friend) => (
                  <button
                    key={friend.id}
                    type="button"
                    onClick={() => setSelectedFriendId(friend.id)}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold press-scale transition-colors ${
                      selectedFriendId === friend.id
                        ? "bg-[#F5A524] text-[#16130A] shadow-sm"
                        : "bg-[#1F2027] text-[#8B8D98] hover:text-[#EDEDEF] border border-[#26272F]"
                    }`}
                  >
                    {friend.name}
                  </button>
                ))}
              </div>

              {/* Selected Friend Breakdown Table */}
              <div className="mt-4 space-y-2 max-h-60 overflow-y-auto pr-1">
                {KRAKOUNT_PAGE.receiptItems.map((item) => {
                  const itemData = computation.itemBreakdowns[item.id];
                  const share = itemData?.shares[selectedFriendId];
                  const count = itemData?.claimants.length || 1;

                  if (!share) {
                    return null;
                  }

                  return (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-lg bg-[#1F2027]/40 border border-[#26272F] flex items-center justify-between text-xs"
                    >
                      <div className="max-w-[70%]">
                        <span className="font-medium text-[#EDEDEF] block truncate">
                          {item.translatedName[locale]}
                        </span>
                        <span className="text-[10px] text-[#8B8D98] font-mono">
                          1/{count} {locale === "es" ? "de" : "of"} {formatMoney(item.priceGrosze)}
                          {share.hasRemainderGrosz && (
                            <span className="text-[#F5A524] ml-1">
                              (+1 {currency === "PLN" ? "gr" : "c"})
                            </span>
                          )}
                        </span>
                      </div>
                      <span className="tabular-nums font-mono font-bold text-[#EDEDEF]">
                        {formatMoney(share.amount)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Total For Selected Friend */}
              <div className="mt-4 pt-3 border-t border-[#26272F] flex items-center justify-between text-xs">
                <span className="text-[#8B8D98]">
                  {locale === "es" ? "Deuda total exacta:" : "Exact total debt:"}
                </span>
                <span className="tabular-nums font-mono font-bold text-sm text-[#FF6B5B]">
                  -{formatMoney(computation.friendSharesGrosze[selectedFriendId] || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
