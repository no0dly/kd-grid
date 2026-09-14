"use client";

import { useState } from "react";
import { useSurvivorActions } from "@/lib/gear/store";

type ScreenshotNameFieldProps = {
  id: string;
  screenshotName: string;
  className?: string;
  labelClassName?: string;
};

export function ScreenshotNameField({
  id,
  screenshotName,
  className,
  labelClassName,
}: ScreenshotNameFieldProps) {
  const { setScreenshotName } = useSurvivorActions();
  const [draft, setDraft] = useState(screenshotName);

  function commit() {
    const trimmed = draft.trim();
    setScreenshotName(id, trimmed);
    setDraft(trimmed);
  }

  return (
    <div>
      <label className={labelClassName} htmlFor={`screenshot-name-${id}`}>
        Screenshot
      </label>
      <input
        id={`screenshot-name-${id}`}
        className={className}
        value={draft}
        placeholder="Screenshot name"
        onChange={(event) => {
          const value = event.target.value;
          setDraft(value);
          setScreenshotName(id, value);
        }}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.currentTarget.blur();
          }
        }}
      />
    </div>
  );
}
