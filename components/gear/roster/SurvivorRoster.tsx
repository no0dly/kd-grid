"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/app/AppHeader";
import { useHasHydrated } from "@/lib/gear/hooks";
import { useSurvivorActions, useSurvivors } from "@/lib/gear/store";
import { survivorListLabel } from "@/lib/gear/utils";
import styles from "./SurvivorRoster.module.css";

export function SurvivorRoster() {
  const hydrated = useHasHydrated();
  const survivors = useSurvivors();
  const { createSurvivor, deleteSurvivor } = useSurvivorActions();
  const router = useRouter();

  function handleCreate() {
    const id = createSurvivor();
    router.push(`/survivors/${id}`);
  }

  return (
    <div className={styles.Page}>
      <AppHeader variant="dark" />
      <div className={styles.Content}>
        <div className={styles.Intro}>
          <div>
            <p className={styles.Kicker}>Settlement</p>
            <h2 className={styles.Title}>Choose a survivor</h2>
            <p className={styles.Hint}>
              Click a survivor to open that character’s gear grid.
            </p>
          </div>
          <button type="button" className={styles.Create} onClick={handleCreate}>
            New survivor
          </button>
        </div>

        {!hydrated ? (
          <p className={styles.Hint}>Loading survivors…</p>
        ) : (
          <div className={styles.List}>
            <div className={styles.ListHead}>
              <span>Name</span>
              <span className={styles.SrOnly}>Actions</span>
            </div>
            {survivors.map((survivor) => (
              <div key={survivor.id} className={styles.Row}>
                <Link
                  href={`/survivors/${survivor.id}`}
                  className={styles.RowLink}
                >
                  {survivorListLabel(survivor)}
                </Link>
                <button
                  type="button"
                  className={styles.Delete}
                  onClick={() => deleteSurvivor(survivor.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
