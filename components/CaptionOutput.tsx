"use client";

import { useState } from "react";
import type { CaptionResult } from "@/app/page";

type Props = {
  captions: CaptionResult;
  synopsis: string;
};

const PLATFORM_ICONS: Record<string, string> = {
  instagram: "📸",
  tiktok: "🎵",
  youtube: "▶️",
};

export default function CaptionOutput({ captions, synopsis }: Props) {
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(text: string, key: string) {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  const entries = Object.entries(captions) as [keyof CaptionResult, string][];

  return (
    <div className="space-y-4">
      <h3 className="font-serif text-xl font-semibold text-burgundy">Your Captions</h3>
      {entries.map(([platform, caption]) => (
        <div key={platform} className="card space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-sans text-sm font-semibold text-warm-gray uppercase tracking-wide">
              {PLATFORM_ICONS[platform]} {platform}
            </span>
            <button
              onClick={() => copy(caption, platform)}
              className="font-sans text-xs text-terracotta hover:text-burgundy transition-colors"
            >
              {copied === platform ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="font-sans text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">
            {caption}
          </p>
        </div>
      ))}
    </div>
  );
}
