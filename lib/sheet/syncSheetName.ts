import type { FUniver } from "@univerjs/presets";
import { nextCharacterSheetName } from "@/lib/templates/preacher";

/** Character display name lives in the merged value cell next to the "Name" label. */
export const CHARACTER_NAME_CELL = "C1";
const NAME_ROW = 0;
const NAME_COL = 2;
const MAX_SHEET_NAME_LENGTH = 31;

type SheetLike = NonNullable<
  ReturnType<NonNullable<ReturnType<FUniver["getActiveWorkbook"]>>["getActiveSheet"]>
>;
type WorkbookLike = NonNullable<ReturnType<FUniver["getActiveWorkbook"]>>;
type RangeLike = ReturnType<SheetLike["getRange"]>;

function sanitizeSheetName(raw: string): string {
  return raw
    .trim()
    .replace(/[:\\/?*[\]]/g, "")
    .slice(0, MAX_SHEET_NAME_LENGTH);
}

function uniqueSheetName(
  desired: string,
  workbook: WorkbookLike,
  currentSheetId: string,
): string {
  const used = new Set(
    workbook
      .getSheets()
      .filter((sheet) => sheet.getSheetId() !== currentSheetId)
      .map((sheet) => sheet.getSheetName().toLowerCase()),
  );

  if (!desired) {
    const otherNames = workbook
      .getSheets()
      .filter((sheet) => sheet.getSheetId() !== currentSheetId)
      .map((sheet) => sheet.getSheetName());
    return nextCharacterSheetName(otherNames);
  }

  let candidate = desired;
  let index = 2;
  while (used.has(candidate.toLowerCase())) {
    const suffix = ` ${index}`;
    candidate =
      desired.slice(0, MAX_SHEET_NAME_LENGTH - suffix.length) + suffix;
    index += 1;
  }

  return candidate;
}

function rangeTouchesNameCell(range: RangeLike): boolean {
  const startRow = range.getRow();
  const startCol = range.getColumn();
  const endRow = range.getLastRow();
  const endCol = range.getLastColumn();

  return (
    startRow <= NAME_ROW &&
    endRow >= NAME_ROW &&
    startCol <= NAME_COL &&
    endCol >= NAME_COL
  );
}

export function readCharacterName(sheet: SheetLike): string {
  const range = sheet.getRange(CHARACTER_NAME_CELL);
  const display = range.getDisplayValue?.();
  const value = display ?? range.getValue();
  if (value == null) {
    return "";
  }
  return String(value).trim();
}

/** Rename the worksheet tab to match the character Name cell. */
export function syncSheetNameFromCharacterName(
  workbook: WorkbookLike,
  sheet: SheetLike,
) {
  const characterName = readCharacterName(sheet);
  const desired = uniqueSheetName(
    sanitizeSheetName(characterName),
    workbook,
    sheet.getSheetId(),
  );

  if (sheet.getSheetName() === desired) {
    return desired;
  }

  sheet.setName(desired);
  return desired;
}

export function shouldSyncSheetNameFromRanges(ranges: RangeLike[]): boolean {
  return ranges.some(rangeTouchesNameCell);
}
