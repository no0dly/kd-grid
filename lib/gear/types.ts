import type { GearRow } from "@/types/database.types";

export type GearItem = GearRow & {
  image_url: string;
};

export type GridLayout = "survivor" | "scout";

export const ACCENT_PRESETS = ["red", "orange", "cyan", "blue", "black"] as const;

export type AccentColor = (typeof ACCENT_PRESETS)[number];

export const STAT_KEYS = [
  "mov",
  "acc",
  "str",
  "eva",
  "spd",
  "lck",
  "tor",
  "sys",
] as const;

export const STAT_ROWS = ["prm", "tmp"] as const;

export type StatKey = (typeof STAT_KEYS)[number];

export type StatRow = (typeof STAT_ROWS)[number];

export type StatBlock = Record<StatKey, number>;

export type SurvivorStats = Record<StatRow, StatBlock>;

export type Survivor = {
  id: string;
  name: string;
  screenshotName: string;
  accent: AccentColor;
  important: string;
  stats: SurvivorStats;
  gridLayout: GridLayout;
  slots: (string | null)[];
  updatedAt: number;
};
