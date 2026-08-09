import type { FUniver } from "@univerjs/presets";
import { protectLockedRanges } from "./protectLabels";
import { applySheetSizing } from "./styling";
import { syncSheetNameFromCharacterName } from "./syncSheetName";

/** Apply sizing, label locks, and tab-name sync to every sheet. */
export async function prepareWorkbook(univerAPI: FUniver) {
  const workbook = univerAPI.getActiveWorkbook();
  if (!workbook) {
    return;
  }

  for (const sheet of workbook.getSheets()) {
    applySheetSizing(sheet);
    await protectLockedRanges(univerAPI, sheet);
    syncSheetNameFromCharacterName(workbook, sheet);
  }
}
