"use client";

import React, { useState } from "react";
import type { TrackerEntry } from "@/app/tracker/page";

type Props = {
  entries: TrackerEntry[];
  sortBy: keyof TrackerEntry;
  sortDir: "asc" | "desc";
  onSort: (col: keyof TrackerEntry) => void;
  onDelete: (id: string) => void;
  onEdit: (entry: TrackerEntry) => void;
};

const COLS: { key: keyof TrackerEntry; label: string; sortable: boolean }[] = [
  { key: "creator", label: "Creator", sortable: true },
  { key: "platform", label: "Platform", sortable: true },
  { key: "contentType", label: "Type", sortable: true },
  { key: "views", label: "Views", sortable: true },
  { key: "likes", label: "Likes", sortable: true },
  { key: "comments", label: "Comments", sortable: true },
  { key: "shares", label: "Shares", sortable: true },
  { key: "engagementRate", label: "Eng. Rate", sortable: true },
];

function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

export default function TrackerTable({ entries, sortBy, sortDir, onSort, onDelete, onEdit }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-light-tan bg-white">
      <table className="w-full text-sm font-sans">
        <thead>
          <tr className="border-b border-light-tan bg-cream">
            {COLS.map((col) => (
              <th
                key={col.key}
                onClick={() => col.sortable && onSort(col.key)}
                className={`text-left px-4 py-3 font-medium text-warm-gray whitespace-nowrap select-none ${
                  col.sortable ? "cursor-pointer hover:text-terracotta" : ""
                }`}
              >
                {col.label}
                {sortBy === col.key && (
                  <span className="ml-1 text-terracotta">
                    {sortDir === "desc" ? "↓" : "↑"}
                  </span>
                )}
              </th>
            ))}
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => (
            <React.Fragment key={entry.id}>
              <tr
                onClick={() => toggleExpand(entry.id)}
                className={`border-b border-light-tan cursor-pointer hover:bg-cream transition-colors ${
                  expandedId === entry.id ? "bg-cream" : i % 2 === 0 ? "" : "bg-cream/30"
                }`}
              >
                <td className="px-4 py-3 font-medium text-gray-800">{entry.creator}</td>
                <td className="px-4 py-3 text-warm-gray">{entry.platform}</td>
                <td className="px-4 py-3 text-warm-gray">{entry.contentType}</td>
                <td className="px-4 py-3">{fmt(entry.views)}</td>
                <td className="px-4 py-3">{fmt(entry.likes)}</td>
                <td className="px-4 py-3">{fmt(entry.comments)}</td>
                <td className="px-4 py-3">{fmt(entry.shares)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`font-semibold ${
                      entry.engagementRate >= 5
                        ? "text-green-600"
                        : entry.engagementRate >= 2
                        ? "text-terracotta"
                        : "text-warm-gray"
                    }`}
                  >
                    {entry.engagementRate.toFixed(2)}%
                  </span>
                </td>
                <td className="px-4 py-3 text-warm-gray text-xs">
                  {expandedId === entry.id ? "▲" : "▼"}
                </td>
              </tr>

              {expandedId === entry.id && (
                <tr className="border-b border-light-tan bg-cream">
                  <td colSpan={9} className="px-6 py-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {entry.caption && (
                        <div>
                          <p className="font-sans text-xs font-semibold text-warm-gray uppercase tracking-wide mb-1">
                            Caption / Hook
                          </p>
                          <p className="font-sans text-sm text-gray-700 leading-relaxed">
                            {entry.caption}
                          </p>
                        </div>
                      )}
                      {entry.notes && (
                        <div>
                          <p className="font-sans text-xs font-semibold text-warm-gray uppercase tracking-wide mb-1">
                            What made this work
                          </p>
                          <p className="font-sans text-sm text-gray-700 leading-relaxed">
                            {entry.notes}
                          </p>
                        </div>
                      )}
                      {!entry.caption && !entry.notes && (
                        <p className="font-sans text-sm text-warm-gray italic">No notes added.</p>
                      )}
                    </div>
                    <div className="mt-3">
                      <span className="inline-block font-sans text-xs font-semibold text-terracotta bg-cream border border-light-tan px-3 py-1 rounded-full">
                        {entry.pillar}
                      </span>
                    </div>

                    {entry.url && (
                      <div className="mt-3">
                        <p className="font-sans text-xs font-semibold text-warm-gray uppercase tracking-wide mb-1">
                          Video Link
                        </p>
                        <a
                          href={entry.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="font-sans text-sm text-terracotta hover:text-burgundy underline underline-offset-2 break-all transition-colors"
                        >
                          {entry.url}
                        </a>
                      </div>
                    )}
                    <div className="mt-4 flex justify-between items-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); onEdit(entry); }}
                        className="text-xs font-medium text-terracotta hover:text-burgundy transition-colors"
                      >
                        Edit entry
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete(entry.id); }}
                        className="text-xs text-warm-gray hover:text-red-500 transition-colors"
                      >
                        Remove entry
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
