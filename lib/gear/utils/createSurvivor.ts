import {
  DEFAULT_SURVIVOR_NAME,
  SCOUT_SLOT_COUNT,
  SURVIVOR_SLOT_COUNT,
} from "@/lib/gear/constants";
import type { GridLayout, Survivor } from "@/lib/gear/types";

export function slotCountForLayout(layout: GridLayout) {
  return layout === "scout" ? SCOUT_SLOT_COUNT : SURVIVOR_SLOT_COUNT;
}

export function emptySlots(layout: GridLayout = "survivor"): (string | null)[] {
  return Array.from({ length: slotCountForLayout(layout) }, () => null);
}

export function createSurvivor(name = DEFAULT_SURVIVOR_NAME): Survivor {
  return {
    id: crypto.randomUUID(),
    name,
    screenshotName: "",
    gridLayout: "survivor",
    slots: emptySlots("survivor"),
    updatedAt: Date.now(),
  };
}
