"use client";

import { useDraggable } from "@dnd-kit/core";
import { GearCardImage } from "@/components/gear/grid/GearCardImage";
import { ClearIcon } from "@/components/gear/icons";
import type { GearItem } from "@/lib/gear/types";
import styles from "@/components/gear/styles/GearBoard.module.css";

type RecentItemProps = {
  item: GearItem;
  onPick: (gearId: string) => void;
  onRemove: (gearId: string) => void;
};

export function RecentItem({ item, onPick, onRemove }: RecentItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `recent:${item.id}`,
    data: { type: "recent", gearId: item.id },
  });

  return (
    <div
      className={`${styles.RecentItem} ${isDragging ? styles.RecentItemDragging : ""}`}
    >
      <button
        type="button"
        ref={setNodeRef}
        className={styles.RecentPick}
        {...listeners}
        {...attributes}
        onClick={() => onPick(item.id)}
      >
        <div className={styles.RecentThumb}>
          <GearCardImage item={item} fill sizes="72px" />
        </div>
        <span className={styles.RecentName}>{item.name}</span>
      </button>
      <button
        type="button"
        className={styles.RecentRemove}
        aria-label={`Remove ${item.name} from latest gear`}
        title="Remove"
        onClick={() => onRemove(item.id)}
      >
        <ClearIcon className={styles.ActionIcon} />
      </button>
    </div>
  );
}
