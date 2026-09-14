"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { UniverSheetsCorePreset } from "@univerjs/preset-sheets-core";
import UniverPresetSheetsCoreEnUS from "@univerjs/preset-sheets-core/locales/en-US";
import {
  createUniver,
  LocaleType,
  mergeLocales,
  type FUniver,
  type IDisposable,
  type IWorkbookData,
} from "@univerjs/presets";
import { createPreacherWorkbook } from "@/lib/templates/preacher";
import { AppHeader } from "@/components/app/AppHeader";
import {
  addCharacterSheet,
  CHARACTER_SHEET_UNIVER_UI,
  createWorkbookPersister,
  kdGridTheme,
  loadWorkbookSnapshot,
  prepareWorkbook,
  resetActiveSheetToTemplate,
  wireSheetLifecycle,
} from "@/lib/sheet";

import "@univerjs/preset-sheets-core/lib/index.css";

type StatusMessage = {
  type: "ok" | "error";
  text: string;
};

type Persister = ReturnType<typeof createWorkbookPersister>;

export function CharacterSheet() {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<FUniver | null>(null);
  const lifecycleRef = useRef<IDisposable | null>(null);
  const persisterRef = useRef<Persister | null>(null);
  const [ready, setReady] = useState(false);
  const [sheetCount, setSheetCount] = useState(1);
  const [status, setStatus] = useState<StatusMessage | null>(null);

  const mountWorkbook = useCallback(async (data: IWorkbookData, restored: boolean) => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    lifecycleRef.current?.dispose();
    lifecycleRef.current = null;
    persisterRef.current?.dispose();
    persisterRef.current = null;

    if (apiRef.current) {
      apiRef.current.dispose();
      apiRef.current = null;
    }

    const { univerAPI } = createUniver({
      theme: kdGridTheme,
      locale: LocaleType.EN_US,
      locales: {
        [LocaleType.EN_US]: mergeLocales(UniverPresetSheetsCoreEnUS),
      },
      presets: [
        UniverSheetsCorePreset({
          container,
          ...CHARACTER_SHEET_UNIVER_UI,
          sheets: {
            protectedRangeShadow: false,
          },
        }),
      ],
    });

    apiRef.current = univerAPI;
    const persister = createWorkbookPersister(univerAPI);
    persisterRef.current = persister;

    lifecycleRef.current = wireSheetLifecycle(univerAPI, {
      onSheetCountChange: setSheetCount,
      onDirty: persister.schedulePersist,
    });

    univerAPI.createWorkbook(data);
    setSheetCount(univerAPI.getActiveWorkbook()?.getSheets().length ?? 1);

    try {
      await prepareWorkbook(univerAPI);
      persister.persistNow();
      setStatus({
        type: "ok",
        text: restored
          ? "Restored your last saved sheets. Changes auto-save in this browser."
          : "Titles locked. Changes auto-save in this browser.",
      });
    } catch (error) {
      console.error(error);
      setStatus({
        type: "error",
        text: "Sheet loaded, but locking titles failed. Values are still editable.",
      });
    }

    setReady(true);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const timer = window.setTimeout(() => {
      if (cancelled) {
        return;
      }
      const saved = loadWorkbookSnapshot();
      void mountWorkbook(saved ?? createPreacherWorkbook(), !!saved);
    }, 0);

    const flushOnLeave = () => {
      persisterRef.current?.persistNow();
    };
    window.addEventListener("beforeunload", flushOnLeave);
    window.addEventListener("pagehide", flushOnLeave);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.removeEventListener("beforeunload", flushOnLeave);
      window.removeEventListener("pagehide", flushOnLeave);
      persisterRef.current?.persistNow();
      persisterRef.current?.dispose();
      persisterRef.current = null;
      lifecycleRef.current?.dispose();
      lifecycleRef.current = null;
      apiRef.current?.dispose();
      apiRef.current = null;
    };
  }, [mountWorkbook]);

  function handleReset() {
    const api = apiRef.current;
    if (!api) {
      return;
    }

    const sheet = resetActiveSheetToTemplate(api);
    if (!sheet) {
      setStatus({ type: "error", text: "Could not reset the active sheet." });
      return;
    }

    setSheetCount(api.getActiveWorkbook()?.getSheets().length ?? sheetCount);
    persisterRef.current?.schedulePersist();
    setStatus({
      type: "ok",
      text: `Reset “${sheet.getSheetName()}” to the titles-only template.`,
    });
  }

  function handleAddSheet() {
    const api = apiRef.current;
    if (!api) {
      return;
    }

    const sheet = addCharacterSheet(api);
    if (!sheet) {
      setStatus({ type: "error", text: "Could not create a new sheet." });
      return;
    }

    setSheetCount(api.getActiveWorkbook()?.getSheets().length ?? sheetCount + 1);
    persisterRef.current?.schedulePersist();
    setStatus({
      type: "ok",
      text: `Added “${sheet.getSheetName()}” with the character template.`,
    });
  }

  function handleDeleteSheet() {
    const workbook = apiRef.current?.getActiveWorkbook();
    if (!workbook) {
      return;
    }

    const sheets = workbook.getSheets();
    if (sheets.length <= 1) {
      setStatus({
        type: "error",
        text: "Can't delete the last sheet. Add another first.",
      });
      return;
    }

    const activeName = workbook.getActiveSheet()?.getSheetName() ?? "sheet";
    const deleted = workbook.deleteActiveSheet();
    if (!deleted) {
      setStatus({
        type: "error",
        text: "Could not delete the active sheet.",
      });
      return;
    }

    setSheetCount(workbook.getSheets().length);
    persisterRef.current?.schedulePersist();
    setStatus({
      type: "ok",
      text: `Deleted “${activeName}”.`,
    });
  }

  return (
    <div className="flex h-dvh flex-col bg-[linear-gradient(180deg,#e8f2ef_0%,#f3f6f5_40%,#eef1f0_100%)] text-[#14201c]">
      <AppHeader variant="light">
        <button
          type="button"
          className="rounded border border-[#0c5f59] bg-[#0f766e] px-3 py-1.5 text-sm text-white hover:bg-[#0c5f59] disabled:opacity-50"
          onClick={handleAddSheet}
          disabled={!ready}
        >
          New sheet
        </button>
        <button
          type="button"
          className="rounded border border-[#d0d8d5] bg-white/80 px-3 py-1.5 text-sm text-[#2b342f] hover:bg-white disabled:opacity-50"
          onClick={handleDeleteSheet}
          disabled={!ready || sheetCount <= 1}
          title={
            sheetCount <= 1
              ? "Add another sheet before deleting"
              : "Delete the active sheet tab"
          }
        >
          Delete sheet
        </button>
        <button
          type="button"
          className="rounded border border-[#d0d8d5] bg-white/80 px-3 py-1.5 text-sm text-[#2b342f] hover:bg-white disabled:opacity-50"
          onClick={handleReset}
          disabled={!ready}
          title="Reset the active sheet to the titles-only template"
        >
          Reset
        </button>
      </AppHeader>

      {status ? (
        <p
          className={`px-4 py-2 text-sm ${
            status.type === "error"
              ? "bg-red-50 text-red-800"
              : "bg-[#e8f7f3] text-[#0a4b47]"
          }`}
        >
          {status.text}
        </p>
      ) : null}

      <div
        ref={containerRef}
        className="univer-host min-h-0 flex-1 overflow-hidden bg-[#f3f6f5]"
      />
    </div>
  );
}
