"use client";

import { ACCENT_COLORS, ACCENT_LABELS } from "@/lib/gear/constants";
import { ACCENT_PRESETS, type AccentColor } from "@/lib/gear/types";
import styles from "@/components/gear/styles/GearBoard.module.css";

type AccentPickerProps = {
  id: string;
  value: AccentColor;
  onChange: (accent: AccentColor) => void;
};

export function AccentPicker({ id, value, onChange }: AccentPickerProps) {
  const labelId = `accent-color-${id}`;

  return (
    <div className={styles.AccentPicker}>
      <span className={styles.NameLabel} id={labelId}>
        Color
      </span>
      <div className={styles.AccentSwatches} role="radiogroup" aria-labelledby={labelId}>
        {ACCENT_PRESETS.map((accent) => (
          <button
            key={accent}
            type="button"
            role="radio"
            aria-checked={value === accent}
            aria-label={ACCENT_LABELS[accent]}
            className={styles.AccentSwatch}
            style={{ backgroundColor: ACCENT_COLORS[accent] }}
            onClick={() => onChange(accent)}
          />
        ))}
      </div>
    </div>
  );
}
