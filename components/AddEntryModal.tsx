"use client";

import { useState } from "react";
import { PILLARS } from "@/lib/tracker-types";
import type { TrackerEntry, Pillar } from "@/lib/tracker-types";

type Props = {
  onAdd: (entry: Omit<TrackerEntry, "id" | "engagementRate" | "savedAt">) => void;
  onClose: () => void;
  existing?: TrackerEntry;
};

const PLATFORMS = ["TikTok", "Instagram", "YouTube", "Other"];
const CONTENT_TYPES = ["Reel / Video", "Photo / Carousel", "Story", "Short", "Other"];

export default function AddEntryModal({ onAdd, onClose, existing }: Props) {
  const [form, setForm] = useState({
    creator: existing?.creator ?? "",
    platform: existing?.platform ?? "TikTok",
    contentType: existing?.contentType ?? "Reel / Video",
    pillar: existing?.pillar ?? ("Art" as Pillar),
    caption: existing?.caption ?? "",
    likes: existing?.likes?.toString() ?? "",
    comments: existing?.comments?.toString() ?? "",
    shares: existing?.shares?.toString() ?? "",
    views: existing?.views?.toString() ?? "",
    notes: existing?.notes ?? "",
    url: existing?.url ?? "",
  });

  function set(key: string, val: string) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onAdd({
      creator: form.creator,
      platform: form.platform,
      contentType: form.contentType,
      pillar: form.pillar as Pillar,
      caption: form.caption,
      likes: parseInt(form.likes) || 0,
      comments: parseInt(form.comments) || 0,
      shares: parseInt(form.shares) || 0,
      views: parseInt(form.views) || 0,
      notes: form.notes,
      url: form.url,
    });
  }

  const isEditing = !!existing;

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-light-tan">
          <h3 className="font-serif text-xl font-semibold text-burgundy">
            {isEditing ? "Edit Entry" : "Add Entry"}
          </h3>
          <button onClick={onClose} className="text-warm-gray hover:text-gray-600 text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Creator / Account *</label>
              <input
                className="input-field"
                placeholder="@username"
                value={form.creator}
                onChange={(e) => set("creator", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Platform</label>
              <select className="input-field" value={form.platform} onChange={(e) => set("platform", e.target.value)}>
                {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Content Type</label>
            <select className="input-field" value={form.contentType} onChange={(e) => set("contentType", e.target.value)}>
              {CONTENT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="label">Brand Pillar</label>
            <select className="input-field" value={form.pillar} onChange={(e) => set("pillar", e.target.value)}>
              {PILLARS.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>

          <div>
            <label className="label">Caption / Description</label>
            <textarea
              className="input-field resize-none h-20"
              placeholder="What did they say? What was the hook?"
              value={form.caption}
              onChange={(e) => set("caption", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Views</label>
              <input type="number" className="input-field" placeholder="0" value={form.views} onChange={(e) => set("views", e.target.value)} />
            </div>
            <div>
              <label className="label">Likes</label>
              <input type="number" className="input-field" placeholder="0" value={form.likes} onChange={(e) => set("likes", e.target.value)} />
            </div>
            <div>
              <label className="label">Comments</label>
              <input type="number" className="input-field" placeholder="0" value={form.comments} onChange={(e) => set("comments", e.target.value)} />
            </div>
            <div>
              <label className="label">Shares / Saves</label>
              <input type="number" className="input-field" placeholder="0" value={form.shares} onChange={(e) => set("shares", e.target.value)} />
            </div>
          </div>

          <div>
            <label className="label">Video Link</label>
            <input
              type="url"
              className="input-field"
              placeholder="https://www.tiktok.com/..."
              value={form.url}
              onChange={(e) => set("url", e.target.value)}
            />
          </div>

          <div>
            <label className="label">Notes — what made this work?</label>
            <textarea
              className="input-field resize-none h-16"
              placeholder="Authenticity, trending audio, raw moment..."
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={!form.creator} className="btn-primary flex-1">
              {isEditing ? "Save Changes" : "Save Entry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
