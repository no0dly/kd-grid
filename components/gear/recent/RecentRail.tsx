"use client";

import { useMemo } from "react";
import { RecentItem } from "@/components/gear/recent/RecentItem";
import { useDebouncedSearch } from "@/lib/gear/hooks";
import { useRecentGearIds, useSurvivorActions } from "@/lib/gear/store";
import type { GearItem } from "@/lib/gear/types";
import { filterGearByName } from "@/lib/gear/utils";
import styles from "@/components/gear/styles/GearBoard.module.css";

type RecentRailProps = {
  catalog: GearItem[];
  onPick: (gearId: string) => void;
};

export function RecentRail({ catalog, onPick }: RecentRailProps) {
  const recentGearIds = useRecentGearIds();
  const { removeRecent } = useSurvivorActions();
  const { searchName, onInputChangeHandler } = useDebouncedSearch();
  const gearById = useMemo(
    () => new Map(catalog.map((item) => [item.id, item])),
    [catalog],
  );
  const recentItems = useMemo(
    () =>
      filterGearByName(
        recentGearIds
          .map((id) => gearById.get(id))
          .filter((item): item is GearItem => Boolean(item)),
        searchName,
      ),
    [gearById, recentGearIds, searchName],
  );

  return (
    <aside className={styles.Rail}>
      <h3 className={styles.RailTitle}>Latest gear</h3>
      <input
        className={styles.Search}
        type="search"
        placeholder="Search recent…"
        onChange={onInputChangeHandler}
      />
      <div className={styles.RecentList}>
        {recentItems.length === 0 ? (
          <p className={styles.EmptyRecent}>
            Gear you place on the grid will appear here.
          </p>
        ) : (
          recentItems.map((item) => (
            <RecentItem
              key={item.id}
              item={item}
              onPick={onPick}
              onRemove={removeRecent}
            />
          ))
        )}
      </div>
    </aside>
  );
}
