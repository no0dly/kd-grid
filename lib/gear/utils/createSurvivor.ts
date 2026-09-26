import {
  DEFAULT_SURVIVOR_NAME,
  SCOUT_SLOT_COUNT,
  SURVIVOR_SLOT_COUNT,
} from "@/lib/gear/constants";
import {
  ACCENT_PRESETS,
  STAT_KEYS,
  STAT_ROWS,
  type AccentColor,
  type GridLayout,
  type StatBlock,
  type StatKey,
  type Survivor,
  type SurvivorStats,
} from "@/lib/gear/types";

export function slotCountForLayout(layout: GridLayout) {
  return layout === "scout" ? SCOUT_SLOT_COUNT : SURVIVOR_SLOT_COUNT;
}

export function emptySlots(layout: GridLayout = "survivor"): (string | null)[] {
  return Array.from({ length: slotCountForLayout(layout) }, () => null);
}

export function emptyStatBlock(): StatBlock {
  return {
    mov: 0,
    acc: 0,
    str: 0,
    eva: 0,
    spd: 0,
    lck: 0,
    tor: 0,
    sys: 0,
  };
}

export function emptyStats(): SurvivorStats {
  return {
    prm: emptyStatBlock(),
    tmp: emptyStatBlock(),
  };
}

const ACCENT_SET = new Set<string>(ACCENT_PRESETS);

export function normalizeAccent(value: unknown): AccentColor {
  return typeof value === "string" && ACCENT_SET.has(value)
    ? (value as AccentColor)
    : "red";
}

function normalizeStatValue(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? Math.trunc(value) : 0;
}

export function normalizeStats(value: unknown): SurvivorStats {
  const source =
    value && typeof value === "object" ? (value as Partial<SurvivorStats>) : {};
  const stats = emptyStats();

  for (const row of STAT_ROWS) {
    const block = source[row];
    const record =
      block && typeof block === "object"
        ? (block as Partial<Record<StatKey, unknown>>)
        : {};
    for (const key of STAT_KEYS) {
      stats[row][key] = normalizeStatValue(record[key]);
    }
  }

  return stats;
}

export function hydrateSurvivor(survivor: Survivor): Survivor {
  const gridLayout: GridLayout =
    survivor.gridLayout === "scout" ? "scout" : "survivor";
  const slotCount = slotCountForLayout(gridLayout);
  const raw = survivor as Survivor & {
    accent?: unknown;
    important?: unknown;
    stats?: unknown;
  };

  return {
    ...survivor,
    screenshotName: survivor.screenshotName ?? "",
    accent: normalizeAccent(raw.accent),
    important: typeof raw.important === "string" ? raw.important : "",
    stats: normalizeStats(raw.stats),
    gridLayout,
    slots: Array.from({ length: slotCount }, (_, index) =>
      survivor.slots?.[index] === undefined ? null : survivor.slots[index],
    ),
  };
}

export function createSurvivor(name = DEFAULT_SURVIVOR_NAME): Survivor {
  return {
    id: crypto.randomUUID(),
    name,
    screenshotName: "",
    accent: "red",
    important: "",
    stats: emptyStats(),
    gridLayout: "survivor",
    slots: emptySlots("survivor"),
    updatedAt: Date.now(),
  };
}
