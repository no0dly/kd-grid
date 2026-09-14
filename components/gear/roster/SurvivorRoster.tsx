"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/app/AppHeader";
import { useHasHydrated } from "@/lib/gear/hooks";
import { useSurvivorActions, useSurvivors } from "@/lib/gear/store";
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
              Click a name to open that character’s gear grid.
            </p>
          </div>
          <button type="button" className={styles.Create} onClick={handleCreate}>
            New survivor
          </button>
        </div>

        {!hydrated ? (
          <p className={styles.Hint}>Loading survivors…</p>
        ) : (
          <table className={styles.Table}>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">
                  <span className={styles.SrOnly}>Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {survivors.map((survivor) => (
                <tr key={survivor.id}>
                  <td>
                    <Link
                      href={`/survivors/${survivor.id}`}
                      className={styles.NameLink}
                    >
                      {survivor.name}
                    </Link>
                  </td>
                  <td className={styles.Actions}>
                    <button
                      type="button"
                      className={styles.Delete}
                      onClick={() => deleteSurvivor(survivor.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
