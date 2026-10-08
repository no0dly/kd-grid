import type { AccentColor, StatKey, StatRow } from "@/lib/gear/types";

export const GEAR_BUCKET = "gear";
export const GEAR_IMAGE_WIDTH = 1084;
export const GEAR_IMAGE_HEIGHT = 1092;
export const SURVIVOR_SLOT_COUNT = 9;
export const SCOUT_SLOT_COUNT = 4;
export const DRAG_OVERLAY_SIZE = 120;
export const RECENT_CAP = 24;
export const SEARCH_DEBOUNCE_MS = 400;
export const SURVIVOR_STORAGE_KEY = "kd-grid:survivors:v1";
export const DEFAULT_SURVIVOR_NAME = "New Survivor";
export const DUPLICATE_NAME_ERROR = "That name is already used.";
export const PICKER_COLUMNS = 3;
export const PICKER_ROW_HEIGHT = 230;
export const POINTER_ACTIVATION_DISTANCE = 8;

export const ACCENT_COLORS = {
  red: "#8f3538",
  orange: "#c46a1a",
  cyan: "#1E507B",
  blue: "#3F5E58",
  black: "#141414",
} as const satisfies Record<AccentColor, string>;

export const STAT_KEY_LABELS = {
  mov: "MOV",
  acc: "ACC",
  str: "STR",
  eva: "EVA",
  spd: "SPD",
  lck: "LCK",
  tor: "TOR",
  sys: "SYS",
} as const satisfies Record<StatKey, string>;

export const STAT_ROW_LABELS = {
  prm: "PRM",
  tmp: "TMP",
} as const satisfies Record<StatRow, string>;

export const ACCENT_LABELS = {
  red: "Red",
  orange: "Orange",
  cyan: "Cyan",
  blue: "Blue",
  black: "Black",
} as const satisfies Record<AccentColor, string>;
