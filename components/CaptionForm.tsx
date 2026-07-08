"use client";

import { useState } from "react";

const CATEGORIES = [
  "Modeling / Fashion",
  "Art / Visual",
  "Behind the Scenes",
  "Personal / Life",
  "Travel",
  "Campaign / Editorial",
  "Collaboration",
  "Other",
];

const PLATFORMS = ["instagram", "tiktok", "youtube"];

type Props = {
  onSubmit: (data: {
    synopsis: string;
    emotionalTruth: string;
    category: string;
    platform: string[];
  }) => void;
  loading: boolean;
};

export default function CaptionForm({ onSubmit, loading }: Props) {
  const [synopsis, setSynopsis] = useState("");
  const [emotionalTruth, setEmotionalTruth] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [platform, setPlatform] = useState<string[]>(["instagram", "tiktok", "youtube"]);

  function togglePlatform(p: string) {
    setPlatform((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!synopsis.trim()) return;
    onSubmit({ synopsis, emotionalTruth, category, platform });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="label">What happened? Tell me the moment. *</label>
        <textarea
          className="input-field min-h-[100px] resize-none"
          placeholder="We shot on location in the warehouse district at golden hour. I was wearing an ivory slip dress, barefoot on concrete. It felt raw and tender at the same time..."
          value={synopsis}
          onChange={(e) => setSynopsis(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="label">What's the emotional truth underneath it? (optional)</label>
        <input
          type="text"
          className="input-field"
          placeholder="I finally felt like I belonged in front of the camera again."
          value={emotionalTruth}
          onChange={(e) => setEmotionalTruth(e.target.value)}
        />
      </div>

      <div>
        <label className="label">Category</label>
        <select
          className="input-field"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="label">Platforms</label>
        <div className="flex gap-3 flex-wrap">
          {PLATFORMS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => togglePlatform(p)}
              className={`px-4 py-2 rounded-full font-sans text-sm font-medium border transition-all ${
                platform.includes(p)
                  ? "bg-terracotta text-white border-terracotta"
                  : "bg-cream text-warm-gray border-light-tan"
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !synopsis.trim() || platform.length === 0}
        className="btn-primary w-full"
      >
        {loading ? "Writing your captions…" : "Generate Captions"}
      </button>
    </form>
  );
}
