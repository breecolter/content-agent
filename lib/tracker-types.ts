export const PILLARS = ["Art", "Beauty", "Hair", "Modeling", "Fashion", "Lifestyle", "Creative business"] as const;
export type Pillar = typeof PILLARS[number];

/** Which of Bree's accounts a reference is meant for. */
export const PAGES = ["Art", "Main"] as const;
export type Page = typeof PAGES[number];

/** Where a reference has got to in the recreate pipeline. */
export const STATUSES = ["To recreate", "Scripted", "Filmed", "Posted", "Skipped"] as const;
export type Status = typeof STATUSES[number];

export type TrackerEntry = {
  id: string;
  creator: string;
  platform: string;
  contentType: string;
  pillar: Pillar;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  engagementRate: number;
  notes: string;
  url: string;
  savedAt: string;
  // Optional so every entry saved before these columns existed still loads.
  followers?: number | null;
  page?: Page;
  status?: Status;
};
