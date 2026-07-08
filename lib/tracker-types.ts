export const PILLARS = ["Art", "Beauty", "Hair", "Modeling", "Lifestyle"] as const;
export type Pillar = typeof PILLARS[number];

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
};
