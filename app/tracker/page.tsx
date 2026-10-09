"use client";

import { useState, useEffect, useCallback } from "react";
import TrackerTable from "@/components/TrackerTable";
import AddEntryModal from "@/components/AddEntryModal";
import { PILLARS, PAGES } from "@/lib/tracker-types";
import type { Pillar, Page, TrackerEntry } from "@/lib/tracker-types";
import { YOUTUBE_RESEARCH } from "@/lib/youtube-research";
import { VIRAL_RESEARCH } from "@/lib/viral-research";

const STORAGE_KEY = "content-agent-tracker";
const RESEARCH_SEEDED_KEY = "content-agent-research-seeded-v1";
const VIRAL_SEEDED_KEY = "content-agent-viral-seeded-v1";

function calcEngagement(entry: Omit<TrackerEntry, "engagementRate" | "id" | "savedAt">) {
  if (!entry.views || entry.views === 0) return 0;
  return (((entry.likes + entry.comments + entry.shares) / entry.views) * 100);
}

export default function TrackerPage() {
  const [entries, setEntries] = useState<TrackerEntry[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TrackerEntry | null>(null);
  const [sortBy, setSortBy] = useState<keyof TrackerEntry>("engagementRate");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [filterPillar, setFilterPillar] = useState<"all" | Pillar>("all");
  const [filterPage, setFilterPage] = useState<"all" | Page>("all");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let working: TrackerEntry[] = stored ? JSON.parse(stored) : [];
      let changed = false;

      // Append a research batch exactly once. Existing rows are never touched,
      // a video already tracked isn't duplicated, and the flag means deleting a
      // seeded row keeps it deleted instead of resurrecting it next visit.
      const appendOnce = (flagKey: string, batch: TrackerEntry[]) => {
        if (localStorage.getItem(flagKey)) return;
        const seenIds = new Set(working.map((e) => e.id));
        const seenUrls = new Set(working.map((e) => e.url).filter(Boolean));
        const toAdd = batch.filter(
          (r) => !seenIds.has(r.id) && !(r.url && seenUrls.has(r.url))
        );
        working = [...toAdd, ...working];
        localStorage.setItem(flagKey, new Date().toISOString());
        changed = true;
      };

      appendOnce(RESEARCH_SEEDED_KEY, YOUTUBE_RESEARCH);
      appendOnce(VIRAL_SEEDED_KEY, VIRAL_RESEARCH);

      if (changed) localStorage.setItem(STORAGE_KEY, JSON.stringify(working));
      setEntries(working);
    } catch {}
  }, []);

  function save(updated: TrackerEntry[]) {
    setEntries(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }

  function addEntry(raw: Omit<TrackerEntry, "id" | "engagementRate" | "savedAt">) {
    if (editingEntry) {
      const updated = entries.map((e) =>
        e.id === editingEntry.id
          ? { ...e, ...raw, engagementRate: parseFloat(calcEngagement(raw).toFixed(2)) }
          : e
      );
      save(updated);
      setEditingEntry(null);
    } else {
      const entry: TrackerEntry = {
        ...raw,
        id: Date.now().toString(),
        engagementRate: parseFloat(calcEngagement(raw).toFixed(2)),
        url: raw.url || "",
        savedAt: new Date().toISOString(),
      };
      save([entry, ...entries]);
    }
    setShowModal(false);
  }

  function deleteEntry(id: string) {
    save(entries.filter((e) => e.id !== id));
  }

  function handleSort(col: keyof TrackerEntry) {
    if (sortBy === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortDir("desc");
    }
  }

  function exportCSV() {
    const headers = [
      "Creator", "Platform", "Page", "Status", "Content Type", "Caption",
      "Likes", "Comments", "Shares", "Views", "Followers",
      "Engagement Rate %", "Notes", "Link", "Saved At",
    ];
    const rows = entries.map((e) => [
      e.creator, e.platform, e.page ?? "", e.status ?? "", e.contentType,
      `"${e.caption.replace(/"/g, '""')}"`,
      e.likes, e.comments, e.shares, e.views,
      e.followers ?? "",
      e.engagementRate, `"${e.notes.replace(/"/g, '""')}"`,
      `"${(e.url ?? "").replace(/"/g, '""')}"`, e.savedAt,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `viral-tracker-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const displayed = entries
    .filter((e) => filterPage === "all" || e.page === filterPage)
    .filter((e) => filterPillar === "all" || e.pillar === filterPillar)
    .sort((a, b) => {
      const av = a[sortBy];
      const bv = b[sortBy];
      const cmp = typeof av === "number" && typeof bv === "number"
        ? av - bv
        : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-burgundy mb-1">
            Viral Tracker
          </h2>
          <p className="font-sans text-warm-gray text-sm">
            Track what's working — yours and theirs.
          </p>
        </div>
        <div className="flex gap-3">
          {entries.length > 0 && (
            <button onClick={exportCSV} className="btn-secondary text-sm">
              Export CSV
            </button>
          )}
          <button onClick={() => setShowModal(true)} className="btn-primary text-sm">
            + Add Entry
          </button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap items-center">
        <span className="font-sans text-xs text-warm-gray uppercase tracking-wide mr-1">Page</span>
        {(["all", ...PAGES] as const).map((p) => (
          <button
            key={p}
            onClick={() => setFilterPage(p as "all" | Page)}
            className={`px-3 py-1.5 rounded-full font-sans text-xs font-medium border transition-all ${
              filterPage === p
                ? "bg-burgundy text-white border-burgundy"
                : "bg-cream text-warm-gray border-light-tan"
            }`}
          >
            {p === "all" ? "All" : p === "Art" ? "Art page" : "Main page"}
          </button>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {(["all", ...PILLARS] as const).map((p) => (
          <button
            key={p}
            onClick={() => setFilterPillar(p as "all" | Pillar)}
            className={`px-3 py-1.5 rounded-full font-sans text-xs font-medium border transition-all ${
              filterPillar === p
                ? "bg-terracotta text-white border-terracotta"
                : "bg-cream text-warm-gray border-light-tan"
            }`}
          >
            {p === "all" ? "All" : p}
          </button>
        ))}
      </div>

      {displayed.length === 0 ? (
        <div className="card text-center py-16">
          <p className="font-serif text-2xl text-light-tan mb-2">
            {filterPillar === "all" ? "No entries yet" : `No ${filterPillar} entries yet`}
          </p>
          <p className="font-sans text-sm text-warm-gray">
            {filterPillar === "all"
              ? "Start tracking content that catches your eye."
              : `Add an entry and tag it as ${filterPillar}.`}
          </p>
        </div>
      ) : (
        <TrackerTable
          entries={displayed}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={handleSort}
          onDelete={deleteEntry}
          onEdit={(entry) => { setEditingEntry(entry); setShowModal(true); }}
        />
      )}

      {showModal && (
        <AddEntryModal
          onAdd={addEntry}
          onClose={() => { setShowModal(false); setEditingEntry(null); }}
          existing={editingEntry ?? undefined}
        />
      )}
    </div>
  );
}
