import type { FUniver, IDisposable, IWorksheetData } from "@univerjs/presets";
import {
  createCharacterWorksheetData,
  nextCharacterSheetName,
} from "@/lib/templates/preacher";
import { protectLockedRanges } from "./protectLabels";
import { applySheetSizing } from "./styling";
import {
  shouldSyncSheetNameFromRanges,
  syncSheetNameFromCharacterName,
} from "./syncSheetName";

const INSERT_SHEET_COMMAND_ID = "sheet.command.insert-sheet";

export type SheetLifecycleOptions = {
  onSheetCountChange?: (count: number) => void;
  onDirty?: () => void;
};

function sheetLooksTemplated(sheet?: Partial<IWorksheetData> | null): boolean {
  const nameLabel = sheet?.cellData?.[0]?.[0]?.v;
  return nameLabel === "Name";
}

function buildTemplatedSheet(univerAPI: FUniver): IWorksheetData {
  const workbook = univerAPI.getActiveWorkbook();
  const existingNames =
    workbook?.getSheets().map((sheet) => sheet.getSheetName()) ?? [];
  const name = nextCharacterSheetName(existingNames);
  return createCharacterWorksheetData({ name });
}

/** Insert a new character sheet with the titles-only template. */
export function addCharacterSheet(univerAPI: FUniver) {
  const workbook = univerAPI.getActiveWorkbook();
  if (!workbook) {
    return null;
  }

  const sheetData = buildTemplatedSheet(univerAPI);
  return workbook.insertSheet(sheetData.name, { sheet: sheetData });
}

/**
 * Replace only the active sheet with a fresh titles-only template.
 * Other sheets are left unchanged.
 */
export function resetActiveSheetToTemplate(univerAPI: FUniver) {
  const workbook = univerAPI.getActiveWorkbook();
  const activeSheet = workbook?.getActiveSheet();
  if (!workbook || !activeSheet) {
    return null;
  }

  const sheets = workbook.getSheets();
  const index = sheets.findIndex(
    (sheet) => sheet.getSheetId() === activeSheet.getSheetId(),
  );
  const otherNames = sheets
    .filter((sheet) => sheet.getSheetId() !== activeSheet.getSheetId())
    .map((sheet) => sheet.getSheetName());
  const name = nextCharacterSheetName(otherNames);
  const sheetData = createCharacterWorksheetData({ name });

  // Insert template at the same tab position, then remove the old sheet.
  const created = workbook.insertSheet(name, {
    index: index >= 0 ? index : undefined,
    sheet: sheetData,
  });

  workbook.deleteSheet(activeSheet);

  if (created) {
    workbook.setActiveSheet(created);
  }

  return created;
}

/**
 * Ensure "+" new sheets get the character template, then lock titles.
 * Syncs tab names to the character Name cell and notifies sheet count / dirty.
 */
export function wireSheetLifecycle(
  univerAPI: FUniver,
  options: SheetLifecycleOptions = {},
): IDisposable {
  const { onSheetCountChange, onDirty } = options;
  const disposables: IDisposable[] = [];

  disposables.push(
    univerAPI.addEvent(univerAPI.Event.BeforeCommandExecute, (event) => {
      if (event.id !== INSERT_SHEET_COMMAND_ID || !event.params) {
        return;
      }

      const params = event.params as {
        sheet?: IWorksheetData;
        index?: number;
        unitId?: string;
      };

      if (sheetLooksTemplated(params.sheet)) {
        return;
      }

      params.sheet = buildTemplatedSheet(univerAPI);
    }),
  );

  disposables.push(
    univerAPI.addEvent(univerAPI.Event.SheetCreated, (params) => {
      const label = params.worksheet.getRange("A1").getValue();
      if (label === "Name") {
        applySheetSizing(params.worksheet);
        void protectLockedRanges(univerAPI, params.worksheet);
        syncSheetNameFromCharacterName(params.workbook, params.worksheet);
      }
      onSheetCountChange?.(params.workbook.getSheets().length);
      onDirty?.();
    }),
  );

  disposables.push(
    univerAPI.addEvent(univerAPI.Event.SheetValueChanged, (params) => {
      if (shouldSyncSheetNameFromRanges(params.effectedRanges)) {
        const workbook = univerAPI.getActiveWorkbook();
        if (workbook) {
          const sheetIds = new Set(
            params.effectedRanges.map((range) => range.getSheetId()),
          );

          for (const sheetId of sheetIds) {
            const sheet = workbook.getSheetBySheetId(sheetId);
            if (!sheet) {
              continue;
            }
            syncSheetNameFromCharacterName(workbook, sheet);
          }
        }
      }

      onDirty?.();
    }),
  );

  disposables.push(
    univerAPI.addEvent(univerAPI.Event.SheetDeleted, (params) => {
      onSheetCountChange?.(params.workbook.getSheets().length);
      onDirty?.();
    }),
  );

  disposables.push(
    univerAPI.addEvent(univerAPI.Event.ActiveSheetChanged, (params) => {
      onSheetCountChange?.(params.workbook.getSheets().length);
    }),
  );

  // Persist after tab rename (including Name-cell sync).
  if ("SheetNameChanged" in univerAPI.Event) {
    disposables.push(
      univerAPI.addEvent(univerAPI.Event.SheetNameChanged, () => {
        onDirty?.();
      }),
    );
  }

  return {
    dispose() {
      for (const disposable of disposables) {
        disposable.dispose();
      }
    },
  };
}
