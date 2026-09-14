import type { GearItem } from "@/lib/gear/types";

export function filterGearByName(items: GearItem[], query: string) {
  const term = query.trim().toLowerCase();
  if (!term) {
    return items;
  }

  return items.filter((item) => item.name.toLowerCase().includes(term));
}
