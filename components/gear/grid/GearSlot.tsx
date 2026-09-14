"use client";

import { useDraggable, useDroppable } from "@dnd-kit/core";
import { GearCardImage } from "@/components/gear/grid/GearCardImage";
import { ClearIcon, ReplaceIcon } from "@/components/gear/icons";
import type { GearItem } from "@/lib/gear/types";
import styles from "@/components/gear/styles/GearBoard.module.css";

type GearSlotProps = {
  index: number;
  item?: GearItem;
  onOpen: (index: number) => void;
  onClear: (index: number) => void;
};

export function GearSlot({ index, item, onOpen, onClear }: GearSlotProps) {
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `slot:${index}`,
    data: { type: "slot", index },
  });
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `equipped:${index}`,
    data: { type: "equipped", index, gearId: item?.id },
    disabled: !item,
  });

  return (
    <div
      ref={setDropRef}
      className={`${styles.Slot} ${isOver ? styles.SlotOver : ""} ${isDragging ? styles.SlotDragging : ""}`}
    >
      {item ? (
        <>
          <button
            type="button"
            className={styles.CardButton}
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            onClick={() => onOpen(index)}
            aria-label={`${item.name}, drag to swap or click to replace`}
          >
            <GearCardImage item={item} fill sizes="22vw" />
          </button>
          <div className={styles.Actions}>
            <button
              type="button"
              className={styles.Action}
              onClick={() => onOpen(index)}
              aria-label={`Replace ${item.name}`}
              title="Replace"
            >
              <ReplaceIcon className={styles.ActionIcon} />
            </button>
            <button
              type="button"
              className={styles.Action}
              onClick={() => onClear(index)}
              aria-label={`Clear ${item.name}`}
              title="Clear"
            >
              <ClearIcon className={styles.ActionIcon} />
            </button>
          </div>
        </>
      ) : (
        <button
          type="button"
          className={styles.Empty}
          onClick={() => onOpen(index)}
          aria-label={`Empty gear slot ${index + 1}`}
        >
          +
        </button>
      )}
    </div>
  );
}
