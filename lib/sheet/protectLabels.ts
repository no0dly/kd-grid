import type { FUniver } from "@univerjs/presets";
import { PREACHER_LOCKED_RANGES } from "@/lib/templates/preacher";

type SheetLike = NonNullable<
  ReturnType<NonNullable<ReturnType<FUniver["getActiveWorkbook"]>>["getActiveSheet"]>
>;

/**
 * Lock label/header cells on a worksheet while leaving value cells editable.
 */
export async function protectLockedRanges(
  univerAPI: FUniver,
  targetSheet?: SheetLike,
) {
  const workbook = univerAPI.getActiveWorkbook();
  if (!workbook) {
    return;
  }

  workbook.getWorkbookPermission().setPermissionDialogVisible(false);

  const sheet = targetSheet ?? workbook.getActiveSheet();
  if (!sheet) {
    return;
  }

  const permission = sheet.getWorksheetPermission();

  const existing = await permission.listRangeProtectionRules();
  if (existing.length > 0) {
    await permission.unprotectRules(existing.map((rule) => rule.id));
  }

  const configs = PREACHER_LOCKED_RANGES.map((a1) => ({
    ranges: [sheet.getRange(a1)],
    options: {
      name: `locked:${a1}`,
      allowViewByOthers: true,
    },
  }));

  const rules = await permission.protectRanges(configs);

  await Promise.all(
    rules.map((rule) =>
      rule.setPoint(univerAPI.Enum.RangePermissionPoint.Edit, false),
    ),
  );
}
