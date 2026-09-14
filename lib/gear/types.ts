import type { GearRow } from "@/types/database.types";

export type GearItem = GearRow & {
  image_url: string;
};

export type GridLayout = "survivor" | "scout";

export type Survivor = {
  id: string;
  name: string;
  screenshotName: string;
  gridLayout: GridLayout;
  slots: (string | null)[];
  updatedAt: number;
};
