import { GearCardImage } from "@/components/gear/grid/GearCardImage";
import { DRAG_OVERLAY_SIZE } from "@/lib/gear/constants";
import type { GearItem } from "@/lib/gear/types";
import styles from "@/components/gear/styles/GearBoard.module.css";

type GearDragPreviewProps = {
  item: GearItem;
};

export function GearDragPreview({ item }: GearDragPreviewProps) {
  return (
    <div className={styles.PickerThumb} style={{ width: DRAG_OVERLAY_SIZE }}>
      <GearCardImage item={item} fill sizes={`${DRAG_OVERLAY_SIZE}px`} />
    </div>
  );
}
