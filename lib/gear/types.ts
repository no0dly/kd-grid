import type { GearRow } from "@/types/database.types";

export type GearItem = GearRow & {
  image_url: string;
};

export type Survivor = {
  id: string;
  name: string;
  screenshotName: string;
  slots: (string | null)[];
  updatedAt: number;
};
