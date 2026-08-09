import type { IUniverSheetsCorePresetConfig } from "@univerjs/preset-sheets-core";

type MenuConfig = NonNullable<IUniverSheetsCorePresetConfig["menu"]>;

function hide(ids: string[]): MenuConfig {
  return Object.fromEntries(ids.map((id) => [id, { hidden: true }]));
}

/** Hide formula and number-format UI (tabs/toolbar items) for a character-sheet app. */
export const CHARACTER_SHEET_MENU: MenuConfig = hide([
  // Formulas
  "formula-ui.operation.insert-function",
  "formula-ui.operation.more-functions",
  "formula-ui.operation.help-function",
  "formula-ui.operation.search-function",
  "formula-ui.operation.change-ref-to-absolute",
  "sheet.command.copy-formula-only",
  "sheet.command.paste-formula",
  // Number / data format
  "sheet.operation.open.numfmt.panel",
  "sheet.operation.close.numfmt.panel",
  "sheet.command.numfmt.add.decimal.command",
  "sheet.command.numfmt.subtract.decimal.command",
  "sheet.command.numfmt.set.currency",
  "sheet.command.numfmt.set.percent",
  "sheet.command.numfmt.set.numfmt",
]);

export const CHARACTER_SHEET_UNIVER_UI: Partial<IUniverSheetsCorePresetConfig> = {
  formulaBar: false,
  statusBarStatistic: false,
  disableTextFormatAlert: true,
  disableTextFormatMark: true,
  menu: CHARACTER_SHEET_MENU,
};
