import type { FUniver } from "@univerjs/presets";
import { saveWorkbookSnapshot } from "./storage";

const DEFAULT_DEBOUNCE_MS = 400;

/**
 * Debounced localStorage persistence for the active workbook snapshot.
 */
export function createWorkbookPersister(
  univerAPI: FUniver,
  debounceMs = DEFAULT_DEBOUNCE_MS,
) {
  let timer: number | null = null;

  const persistNow = () => {
    const workbook = univerAPI.getActiveWorkbook();
    if (!workbook) {
      return;
    }
    saveWorkbookSnapshot(workbook.save());
  };

  const schedulePersist = () => {
    if (typeof window === "undefined") {
      return;
    }
    if (timer != null) {
      window.clearTimeout(timer);
    }
    timer = window.setTimeout(() => {
      timer = null;
      persistNow();
    }, debounceMs);
  };

  const dispose = () => {
    if (timer != null) {
      window.clearTimeout(timer);
      timer = null;
    }
  };

  return { schedulePersist, persistNow, dispose };
}
