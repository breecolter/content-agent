"use client";

import { useState, useEffect } from "react";

const HISTORY_KEY = "content-agent-caption-history";
import CaptionForm from "@/components/CaptionForm";
import CaptionOutput from "@/components/CaptionOutput";
import CaptionHistory from "@/components/CaptionHistory";

export type CaptionResult = {
  instagram: string;
  tiktok: string;
  pinterest: string;
};

export type HistoryEntry = {
  id: string;
  synopsis: string;
  category: string;
  captions: CaptionResult;
  createdAt: string;
};

export default function Home() {
  const [result, setResult] = useState<CaptionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [lastSynopsis, setLastSynopsis] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) setHistory(JSON.parse(stored));
    } catch {}
  }, []);

  function saveHistory(updated: HistoryEntry[]) {
    setHistory(updated);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch {}
  }

  async function handleGenerate(formData: {
    synopsis: string;
    emotionalTruth: string;
    category: string;
    platform: string[];
  }) {
    setLoading(true);
    setError(null);
    setResult(null);
    setLastSynopsis(formData.synopsis);

    try {
      const res = await fetch("/api/generate-captions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      const data = await res.json();
      setResult(data.captions);

      const entry: HistoryEntry = {
        id: Date.now().toString(),
        synopsis: formData.synopsis,
        category: formData.category,
        captions: data.captions,
        createdAt: new Date().toISOString(),
      };
      saveHistory([entry, ...history.slice(0, 29)]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-3xl font-semibold text-burgundy mb-1">
          Caption Generator
        </h2>
        <p className="font-sans text-warm-gray text-sm">
          Tell me the story — I'll write the caption in your voice.
        </p>
      </div>

      <div className="card">
        <CaptionForm onSubmit={handleGenerate} loading={loading} />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-red-700 font-sans text-sm">
          {error}
        </div>
      )}

      {result && (
        <CaptionOutput captions={result} synopsis={lastSynopsis} />
      )}

      {history.length > 0 && (
        <CaptionHistory
          history={history}
          onSelect={setResult}
          onDelete={(id) => saveHistory(history.filter((e) => e.id !== id))}
        />
      )}
    </div>
  );
}
