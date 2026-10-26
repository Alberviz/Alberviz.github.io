"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import {
  Database,
  ShieldCheck,
  DeviceMobile,
  CheckCircle,
  Lightning,
  Storefront,
  ChartLineUp,
  ArrowsMerge,
} from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import { HOMELAB_WEALTH_SYSTEM } from "@/content/portfolio-data";
import { ASSETS } from "@/content/assets";
import { SPRING_SNAPPY } from "@/lib/motion";

export function HomeLabWealthSection() {
  const { locale } = useLocale();
  const [activeNodeId, setActiveNodeId] = useState<string>("ingest");

  const layerIcons: Record<string, React.ReactNode> = {
    ingest: <Lightning size={18} weight="bold" className="text-[#10B981]" />,
    core: <Database size={18} weight="bold" className="text-[#10B981]" />,
    security: <ShieldCheck size={18} weight="bold" className="text-[#10B981]" />,
    interface: <DeviceMobile size={18} weight="bold" className="text-[#10B981]" />,
  };

  const activeNode =
    HOMELAB_WEALTH_SYSTEM.wealthNodes.find((n) => n.id === activeNodeId) ??
    HOMELAB_WEALTH_SYSTEM.wealthNodes[0];

  return (
    <section
      id="systems"
      data-scene="systems"
      className="py-16 sm:py-24 border-b border-[#232732]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-3xl">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.02em] text-[#ECEEF2]">
            {HOMELAB_WEALTH_SYSTEM.heading[locale]}
          </h2>
          <p className="text-base sm:text-lg text-[#8E95A5] mt-3 leading-relaxed">
            {HOMELAB_WEALTH_SYSTEM.subheading[locale]}
          </p>
        </div>

        {/* Part 1: Aurora Autonomous Agent Highlight */}
        <div className="mt-10 bg-[#111318] border border-[#232732] rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#232732] pb-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#171A21] border border-[#232732] p-1 flex items-center justify-center shrink-0">
                <Image
                  src={ASSETS.aurora.logo.src}
                  alt={ASSETS.aurora.logo.alt[locale]}
                  width={40}
                  height={40}
                  className="rounded-lg object-contain"
                />
              </div>
              <div>
                <h3 className="font-display text-lg sm:text-xl font-semibold text-[#ECEEF2]">
                  {HOMELAB_WEALTH_SYSTEM.auroraHighlight.title}
                </h3>
                <p className="text-xs font-mono text-[#8E95A5]">
                  Nous Hermes · 73 Google Workspace MCP Tools · Telegram
                </p>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171A21] border border-[#232732] text-xs font-mono text-[#10B981] self-start sm:self-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              <span>{HOMELAB_WEALTH_SYSTEM.auroraHighlight.badge[locale]}</span>
            </div>
          </div>

          <p className="text-[#8E95A5] text-sm sm:text-base leading-relaxed mt-6 max-w-[70ch]">
            {HOMELAB_WEALTH_SYSTEM.auroraHighlight.summary[locale]}
          </p>

          {/* 3 Verified Engineering Wins */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {HOMELAB_WEALTH_SYSTEM.auroraHighlight.wins.map((win, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#171A21]/60 border border-[#232732] flex flex-col justify-between"
              >
                <div className="flex items-center gap-2 mb-2 font-mono text-xs text-[#10B981]">
                  <CheckCircle size={14} weight="bold" />
                  <span>Win 0{idx + 1}</span>
                </div>
                <p className="text-xs sm:text-sm text-[#ECEEF2]/90 leading-relaxed">
                  {win[locale]}
                </p>
              </div>
            ))}
          </div>

          {/* Stack Tags */}
          <div className="mt-6 pt-6 border-t border-[#232732] flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-[#8E95A5] mr-2">Stack:</span>
            {HOMELAB_WEALTH_SYSTEM.auroraHighlight.stack.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full bg-[#171A21] border border-[#232732] text-xs font-mono text-[#8E95A5]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Part 2: Ghostfolio Interconnected Wealth Engine (3 Connected Feeds + Interactive 4-Layer Topology) */}
        <div className="mt-12">
          <div className="mb-6">
            <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#ECEEF2]">
              {HOMELAB_WEALTH_SYSTEM.wealthTitle[locale]}
            </h3>
            <p className="text-sm sm:text-base text-[#8E95A5] mt-2 max-w-[70ch] leading-relaxed">
              {HOMELAB_WEALTH_SYSTEM.wealthSummary[locale]}
            </p>
          </div>

          {/* 3 Interconnected Real-World Sources Feeding Ghostfolio */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {HOMELAB_WEALTH_SYSTEM.connectedFeeds.map((feed) => {
              const feedIcon =
                feed.id === "brokers" ? (
                  <ChartLineUp size={18} weight="bold" className="text-[#10B981]" />
                ) : feed.id === "business" ? (
                  <Storefront size={18} weight="bold" className="text-[#10B981]" />
                ) : (
                  <ArrowsMerge size={18} weight="bold" className="text-[#10B981]" />
                );

              return (
                <div
                  key={feed.id}
                  className={`rounded-2xl p-5 border flex flex-col justify-between ${
                    feed.featured
                      ? "bg-[#171A21]/90 border-[#10B981]/45 shadow-lg shadow-emerald-950/15"
                      : "bg-[#111318] border-[#232732]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="font-mono text-[11px] text-[#10B981] font-semibold">
                        {feed.tag[locale]}
                      </span>
                      <div className="flex items-center gap-2">
                        {feed.featured && (
                          <span className="px-2 py-0.5 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 font-mono text-[10px] text-[#10B981]">
                            LIVE PROFIT SYNC
                          </span>
                        )}
                        {feedIcon}
                      </div>
                    </div>
                    <h4 className="font-display text-base sm:text-lg font-semibold text-[#ECEEF2]">
                      {feed.title[locale]}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#8E95A5] mt-2 leading-relaxed">
                      {feed.detail[locale]}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Topology Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {HOMELAB_WEALTH_SYSTEM.wealthNodes.map((node) => {
              const isActive = node.id === activeNodeId;
              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setActiveNodeId(node.id)}
                  className={`relative text-left p-4 rounded-xl border transition-colors press-scale ${
                    isActive
                      ? "bg-[#171A21] border-[#10B981]/50 text-[#ECEEF2] shadow-lg shadow-emerald-950/10"
                      : "bg-[#111318] border-[#232732] text-[#8E95A5] hover:text-[#ECEEF2] hover:border-[#232732]/80"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="wealth-node-active"
                      className="absolute inset-0 rounded-xl border-2 border-[#10B981] pointer-events-none"
                      transition={SPRING_SNAPPY}
                    />
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] tracking-wider uppercase text-[#10B981]">
                      Layer: {node.layer}
                    </span>
                    {layerIcons[node.layer]}
                  </div>
                  <h4 className="font-display font-semibold text-sm text-[#ECEEF2]">
                    {node.title[locale]}
                  </h4>
                  <p className="text-[11px] text-[#8E95A5] mt-1 line-clamp-2">
                    {node.subtitle[locale]}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Active Node Specifications Display Sheet */}
          <div className="mt-4 bg-[#111318] border border-[#232732] rounded-xl p-6 min-h-[170px] flex flex-col justify-center">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#232732] pb-4 mb-4">
              <div>
                <span className="font-mono text-xs text-[#10B981] uppercase tracking-wider">
                  Active Layer Topology Specs
                </span>
                <h4 className="font-display text-lg font-semibold text-[#ECEEF2] mt-0.5">
                  {activeNode.title[locale]}
                </h4>
              </div>
              <span className="font-mono text-xs text-[#8E95A5] bg-[#171A21] px-2.5 py-1 rounded-full border border-[#232732] self-start sm:self-auto">
                {activeNode.subtitle[locale]}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeNode.specs.map((spec, sIdx) => (
                <div
                  key={sIdx}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-[#ECEEF2]/90 leading-relaxed font-mono"
                >
                  <span className="text-[#10B981] mt-0.5 shrink-0 font-bold">
                    &gt;
                  </span>
                  <span>{spec[locale]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
