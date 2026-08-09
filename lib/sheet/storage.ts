import type { IWorkbookData } from "@univerjs/presets";

/** Bump the suffix when the default template layout changes so old saves are ignored. */
export const CHARACTER_SHEET_STORAGE_KEY = "kd-grid:character-sheet:v22";

export function saveWorkbookSnapshot(snapshot: IWorkbookData) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    CHARACTER_SHEET_STORAGE_KEY,
    JSON.stringify(snapshot),
  );
}

export function loadWorkbookSnapshot(): IWorkbookData | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(CHARACTER_SHEET_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as IWorkbookData;
  } catch {
    return null;
  }
}
