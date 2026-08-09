import type { FUniver } from "@univerjs/presets";

type SheetLike = NonNullable<
  ReturnType<NonNullable<ReturnType<FUniver["getActiveWorkbook"]>>["getActiveSheet"]>
>;

const BODY_FONT_SIZE = 11;
const LABEL_COLUMN_WIDTH = 56;
const COLUMN_B_WIDTH = 40;
const STAT_COLUMN_WIDTH = 44;
const DEFAULT_ROW_HEIGHT = 22;
const SIZED_ROW_COUNT = 20;

/**
 * Applies default column/row sizes (and base font) via Facade API.
 * Users can still change fonts from the Univer toolbar and drag edges to resize.
 */
export function applySheetSizing(sheet: SheetLike) {
  sheet.setColumnWidths(0, 1, LABEL_COLUMN_WIDTH);
  sheet.setColumnWidths(1, 1, COLUMN_B_WIDTH);
  sheet.setColumnWidths(2, 7, STAT_COLUMN_WIDTH);
  sheet.setRowHeights(0, SIZED_ROW_COUNT, DEFAULT_ROW_HEIGHT);

  const nameValue = sheet.getRange("C1");
  nameValue.setFontFamily("Arial").setFontSize(BODY_FONT_SIZE);
}

export function applyDemoStyling(univerAPI: FUniver) {
  const sheet = univerAPI.getActiveWorkbook()?.getActiveSheet();
  if (!sheet) {
    return;
  }
  applySheetSizing(sheet);
}
