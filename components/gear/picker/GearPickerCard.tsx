import { GearCardImage } from "@/components/gear/grid/GearCardImage";
import type { GearItem } from "@/lib/gear/types";
import styles from "@/components/gear/styles/GearBoard.module.css";

type GearPickerCardProps = {
  item: GearItem;
  onSelect: (gearId: string) => void;
};

export function GearPickerCard({ item, onSelect }: GearPickerCardProps) {
  return (
    <button
      type="button"
      className={styles.PickerCard}
      onClick={() => onSelect(item.id)}
    >
      <div className={styles.PickerThumb}>
        <GearCardImage item={item} fill sizes="180px" />
      </div>
      <span className={styles.PickerName}>{item.name}</span>
    </button>
  );
}
