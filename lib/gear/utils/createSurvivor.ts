import { DEFAULT_SURVIVOR_NAME, SLOT_COUNT } from "@/lib/gear/constants";
import type { Survivor } from "@/lib/gear/types";

export function emptySlots(): (string | null)[] {
  return Array.from({ length: SLOT_COUNT }, () => null);
}

export function createSurvivor(name = DEFAULT_SURVIVOR_NAME): Survivor {
  return {
    id: crypto.randomUUID(),
    name,
    screenshotName: "",
    slots: emptySlots(),
    updatedAt: Date.now(),
  };
}
