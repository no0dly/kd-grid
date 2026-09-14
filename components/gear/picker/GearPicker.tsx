"use client";

import { useMemo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { GearPickerCard } from "@/components/gear/picker/GearPickerCard";
import { PICKER_COLUMNS, PICKER_ROW_HEIGHT } from "@/lib/gear/constants";
import { useDebouncedSearch } from "@/lib/gear/hooks";
import type { GearItem } from "@/lib/gear/types";
import { chunk, filterGearByName } from "@/lib/gear/utils";
import styles from "@/components/gear/styles/GearBoard.module.css";

type GearPickerProps = {
  items: GearItem[];
  onSelect: (gearId: string) => void;
  onClose: () => void;
};

export function GearPicker({ items, onSelect, onClose }: GearPickerProps) {
  const { searchName, onInputChangeHandler } = useDebouncedSearch();
  const parentRef = useRef<HTMLDivElement>(null);
  const filtered = useMemo(
    () => filterGearByName(items, searchName),
    [items, searchName],
  );
  const rows = useMemo(
    () => chunk(filtered, PICKER_COLUMNS),
    [filtered],
  );

  // TanStack Virtual returns functions that React Compiler cannot memoize safely.
  // eslint-disable-next-line react-hooks/incompatible-library -- virtualizer identities are unstable by design
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => PICKER_ROW_HEIGHT,
    overscan: 5,
  });

  return (
    <div className={styles.Overlay} role="presentation" onClick={onClose}>
      <div
        className={styles.Dialog}
        role="dialog"
        aria-modal="true"
        aria-label="Select gear"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.DialogHead}>
          <h3 className={styles.DialogTitle}>Select gear</h3>
          <button type="button" className={styles.Close} onClick={onClose}>
            Close
          </button>
        </div>
        <input
          className={styles.Search}
          type="search"
          placeholder="Search gear…"
          onChange={onInputChangeHandler}
          autoFocus
        />
        <p className={styles.Count}>
          {filtered.length} of {items.length}
        </p>
        <div ref={parentRef} className={styles.PickerScroll}>
          {filtered.length === 0 ? (
            <p className={styles.EmptyRecent}>No gear matches that search.</p>
          ) : (
            <div
              style={{
                height: virtualizer.getTotalSize(),
                position: "relative",
                width: "100%",
              }}
            >
              {virtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[virtualRow.index];
                if (!row) {
                  return null;
                }

                return (
                  <div
                    key={virtualRow.key}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: virtualRow.size,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <div className={styles.PickerRow}>
                      {row.map((item) => (
                        <GearPickerCard
                          key={item.id}
                          item={item}
                          onSelect={onSelect}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
