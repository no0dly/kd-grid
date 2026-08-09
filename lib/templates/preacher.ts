import {
  BooleanNumber,
  BorderStyleTypes,
  HorizontalAlign,
  LocaleType,
  VerticalAlign,
  type ICellData,
  type IRange,
  type IStyleData,
  type IWorkbookData,
  type IWorksheetData,
  type IObjectMatrixPrimitiveType,
} from "@univerjs/presets";

const DEFAULT_SHEET_ID = "character-sheet";
/** A = labels; B:I = 8 data columns (MOV…SYS). */
const COL_COUNT = 9;
const LAST_COL = COL_COUNT - 1;
const LABEL_END_COL = 1;
const DATA_START_COL = 2;
/** Content ends at ability row 19; keep sheet tight with no spare blank rows. */
const ROW_COUNT = 20;
const ABILITY_ROW_COUNT = 4;

const THIN_BORDER = {
  s: BorderStyleTypes.THIN,
  cl: { rgb: "#000000" },
};

const STYLE_LABEL = "label";
const STYLE_VALUE = "value";
const STYLE_HEADER = "header";
const STYLE_SECTION = "section";

const BODY_FONT_SIZE = 11;
const SECTION_FONT_SIZE = 12;
const DEFAULT_ROW_HEIGHT = 22;
const LABEL_COLUMN_WIDTH = 56;
const COLUMN_B_WIDTH = 40;
const STAT_COLUMN_WIDTH = 44;

/** Soft teal + ivory paper palette for the character grid. */
const BG_LABEL = { rgb: "#D7EDE7" };
const BG_VALUE = { rgb: "#FFFFF0" };
const BG_HEADER = { rgb: "#C5E6DC" };
const BG_SECTION = { rgb: "#0F766E" };
const CL_SECTION = { rgb: "#F3F6F5" };

const STYLES: Record<string, IStyleData> = {
  [STYLE_LABEL]: {
    ff: "Arial",
    fs: BODY_FONT_SIZE,
    bl: BooleanNumber.TRUE,
    ht: HorizontalAlign.CENTER,
    vt: VerticalAlign.MIDDLE,
    bg: BG_LABEL,
    bd: {
      t: THIN_BORDER,
      b: THIN_BORDER,
      l: THIN_BORDER,
      r: THIN_BORDER,
    },
  },
  [STYLE_VALUE]: {
    ff: "Arial",
    fs: BODY_FONT_SIZE,
    ht: HorizontalAlign.CENTER,
    vt: VerticalAlign.MIDDLE,
    bg: BG_VALUE,
    bd: {
      t: THIN_BORDER,
      b: THIN_BORDER,
      l: THIN_BORDER,
      r: THIN_BORDER,
    },
  },
  [STYLE_HEADER]: {
    ff: "Arial",
    fs: BODY_FONT_SIZE,
    bl: BooleanNumber.TRUE,
    ht: HorizontalAlign.CENTER,
    vt: VerticalAlign.MIDDLE,
    bg: BG_HEADER,
    bd: {
      t: THIN_BORDER,
      b: THIN_BORDER,
      l: THIN_BORDER,
      r: THIN_BORDER,
    },
  },
  [STYLE_SECTION]: {
    ff: "Arial",
    fs: SECTION_FONT_SIZE,
    bl: BooleanNumber.TRUE,
    ht: HorizontalAlign.CENTER,
    vt: VerticalAlign.MIDDLE,
    bg: BG_SECTION,
    cl: CL_SECTION,
    bd: {
      t: THIN_BORDER,
      b: THIN_BORDER,
      l: THIN_BORDER,
      r: THIN_BORDER,
    },
  },
};

function cell(value: string | number | "", styleId: string): ICellData {
  return { v: value, s: styleId };
}

function emptyStyled(styleId: string): ICellData {
  return { v: "", s: styleId };
}

function setCell(
  matrix: IObjectMatrixPrimitiveType<ICellData>,
  row: number,
  col: number,
  data: ICellData,
) {
  if (!matrix[row]) {
    matrix[row] = {};
  }
  matrix[row][col] = data;
}

function fillRowBorders(
  matrix: IObjectMatrixPrimitiveType<ICellData>,
  row: number,
  startCol: number,
  endCol: number,
  styleId: string,
) {
  for (let col = startCol; col <= endCol; col += 1) {
    if (!matrix[row]?.[col]) {
      setCell(matrix, row, col, emptyStyled(styleId));
    }
  }
}

/** Label / header ranges that should be locked from editing (A1 notation). */
export const PREACHER_LOCKED_RANGES = [
  "A1:B1",
  "A2:I2",
  "A3",
  "A4",
  "A5:B5",
  "A6:B6",
  "A7:B7",
  "A8:B8",
  "A9",
  "A10",
  "A11:B11",
  "A12:B12",
  "A13:B13",
  "A14:B14",
  "A15:B15",
  "A16:I16",
] as const;

export function nextCharacterSheetName(existingNames: string[]): string {
  const used = new Set(existingNames.map((name) => name.toLowerCase()));
  if (!used.has("character")) {
    return "Character";
  }

  let index = 2;
  while (used.has(`character ${index}`)) {
    index += 1;
  }
  return `Character ${index}`;
}

/** Titles-only blank character worksheet (labels/headers; empty values). */
export function createCharacterWorksheetData(options?: {
  id?: string;
  name?: string;
}): IWorksheetData {
  const cellData: IObjectMatrixPrimitiveType<ICellData> = {};
  const mergeData: IRange[] = [];

  const merge = (
    startRow: number,
    startColumn: number,
    endRow: number,
    endColumn: number,
  ) => {
    mergeData.push({ startRow, startColumn, endRow, endColumn });
  };

  /** Rows 1–15: label spans A:B (two columns). */
  const setDoubleLabel = (row: number, label: string, styleId = STYLE_LABEL) => {
    setCell(cellData, row, 0, cell(label, styleId));
    fillRowBorders(cellData, row, 1, LABEL_END_COL, styleId);
    merge(row, 0, row, LABEL_END_COL);
  };

  setDoubleLabel(0, "Name");
  setCell(cellData, 0, DATA_START_COL, emptyStyled(STYLE_VALUE));
  fillRowBorders(cellData, 0, DATA_START_COL + 1, LAST_COL, STYLE_VALUE);
  merge(0, DATA_START_COL, 0, LAST_COL);

  // Stats headers start at B2 (MOV…SYS in B:I)
  const stats = ["MOV", "ACC", "STR", "EVA", "SPD", "LCK", "TOR", "SYS"];
  const STAT_START_COL = 1;
  setCell(cellData, 1, 0, emptyStyled(STYLE_HEADER));
  stats.forEach((stat, index) => {
    setCell(cellData, 1, STAT_START_COL + index, cell(stat, STYLE_HEADER));
  });

  // PRM / TMP: label only in A; values under MOV…SYS (B:I)
  for (const { row, label } of [
    { row: 2, label: "PRM" },
    { row: 3, label: "TMP" },
  ]) {
    setCell(cellData, row, 0, cell(label, STYLE_LABEL));
    for (let col = STAT_START_COL; col < STAT_START_COL + stats.length; col += 1) {
      setCell(cellData, row, col, emptyStyled(STYLE_VALUE));
    }
  }

  const labelRows = [
    { row: 4, label: "Character" },
    { row: 5, label: "Tenet" },
    { row: 6, label: "Knowledge" },
    { row: 7, label: "Knowledge" },
  ];

  for (const { row, label } of labelRows) {
    setDoubleLabel(row, label);
    setCell(cellData, row, DATA_START_COL, emptyStyled(STYLE_VALUE));
    fillRowBorders(cellData, row, DATA_START_COL + 1, LAST_COL, STYLE_VALUE);
    merge(row, DATA_START_COL, row, LAST_COL);
  }

  // CRG / UND: label only in A | B number | C:I text
  for (const { row, label } of [
    { row: 8, label: "CRG" },
    { row: 9, label: "UND" },
  ]) {
    setCell(cellData, row, 0, cell(label, STYLE_LABEL));
    setCell(cellData, row, 1, emptyStyled(STYLE_VALUE));
    setCell(cellData, row, DATA_START_COL, emptyStyled(STYLE_VALUE));
    fillRowBorders(cellData, row, DATA_START_COL + 1, LAST_COL, STYLE_VALUE);
    merge(row, DATA_START_COL, row, LAST_COL);
  }

  for (const row of [10, 11, 12]) {
    setDoubleLabel(row, "Disorder");
    setCell(cellData, row, DATA_START_COL, emptyStyled(STYLE_VALUE));
    fillRowBorders(cellData, row, DATA_START_COL + 1, LAST_COL, STYLE_VALUE);
    merge(row, DATA_START_COL, row, LAST_COL);
  }

  for (const { row, label } of [
    { row: 13, label: "FA" },
    { row: 14, label: "SFA" },
  ]) {
    setDoubleLabel(row, label);
    setCell(cellData, row, DATA_START_COL, emptyStyled(STYLE_VALUE));
    fillRowBorders(cellData, row, DATA_START_COL + 1, LAST_COL, STYLE_VALUE);
    merge(row, DATA_START_COL, row, LAST_COL);
  }

  setCell(cellData, 15, 0, cell("Abilities/Impairments", STYLE_SECTION));
  fillRowBorders(cellData, 15, 1, LAST_COL, STYLE_SECTION);
  merge(15, 0, 15, LAST_COL);

  for (let index = 0; index < ABILITY_ROW_COUNT; index += 1) {
    const row = 16 + index;
    setCell(cellData, row, 0, emptyStyled(STYLE_VALUE));
    fillRowBorders(cellData, row, 1, LAST_COL, STYLE_VALUE);
    merge(row, 0, row, LAST_COL);
  }

  const columnData: Record<number, { w: number; hd: number }> = {
    0: { w: LABEL_COLUMN_WIDTH, hd: 0 },
    1: { w: COLUMN_B_WIDTH, hd: 0 },
  };
  for (let col = 2; col < COL_COUNT; col += 1) {
    columnData[col] = { w: STAT_COLUMN_WIDTH, hd: 0 };
  }

  const rowData: Record<number, { h: number; hd: number }> = {};
  for (let row = 0; row < ROW_COUNT; row += 1) {
    rowData[row] = { h: DEFAULT_ROW_HEIGHT, hd: 0 };
  }

  return {
    id: options?.id ?? `character-${crypto.randomUUID()}`,
    name: options?.name ?? "Character",
    tabColor: "",
    hidden: 0,
    rowCount: ROW_COUNT,
    columnCount: COL_COUNT,
    zoomRatio: 1,
    freeze: {
      startRow: -1,
      startColumn: -1,
      ySplit: 0,
      xSplit: 0,
    },
    scrollTop: 0,
    scrollLeft: 0,
    defaultColumnWidth: STAT_COLUMN_WIDTH,
    defaultRowHeight: DEFAULT_ROW_HEIGHT,
    mergeData,
    cellData,
    rowData,
    columnData,
    showGridlines: 1,
    rowHeader: { width: 26, hidden: 0 },
    columnHeader: { height: 14, hidden: 0 },
    rightToLeft: 0,
  };
}

/** Workbook snapshot with one titles-only character sheet. */
export function createPreacherWorkbook(): IWorkbookData {
  const sheet = createCharacterWorksheetData({
    id: DEFAULT_SHEET_ID,
    name: "Character",
  });

  return {
    id: "preacher-workbook",
    name: "Character Sheet",
    appVersion: "0.25.1",
    locale: LocaleType.EN_US,
    styles: STYLES,
    sheetOrder: [sheet.id],
    sheets: {
      [sheet.id]: sheet,
    },
  };
}
