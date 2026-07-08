"use client";

import type { HistoryEntry, CaptionResult } from "@/app/page";

type Props = {
  history: HistoryEntry[];
  onSelect: (captions: CaptionResult) => void;
  onDelete: (id: string) => void;
};

export default function CaptionHistory({ history, onSelect, onDelete }: Props) {
  return (
    <div className="space-y-3">
      <h3 className="font-serif text-lg font-semibold text-burgundy">Recent</h3>
      {history.map((entry) => (
        <div
          key={entry.id}
          className="card hover:border-terracotta transition-colors"
        >
          <div
            className="cursor-pointer"
            onClick={() => onSelect(entry.captions)}
          >
            <div className="flex justify-between items-start gap-4">
              <p className="font-sans text-sm text-gray-700 line-clamp-2">{entry.synopsis}</p>
              <span className="font-sans text-xs text-warm-gray whitespace-nowrap">
                {new Date(entry.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <span className="inline-block mt-2 font-sans text-xs text-terracotta">
              {entry.category}
            </span>
          </div>
          <button
            onClick={() => onDelete(entry.id)}
            className="mt-3 font-sans text-xs text-warm-gray hover:text-red-400 transition-colors"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
