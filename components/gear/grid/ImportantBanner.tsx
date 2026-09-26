"use client";

import type { CSSProperties, Ref } from "react";
import { ACCENT_COLORS } from "@/lib/gear/constants";
import type { AccentColor } from "@/lib/gear/types";
import styles from "@/components/gear/styles/GearBoard.module.css";

type ImportantBannerProps = {
  frameRef: Ref<HTMLDivElement>;
  accent: AccentColor;
  value: string;
  onChange: (value: string) => void;
};

export function ImportantBanner({
  frameRef,
  accent,
  value,
  onChange,
}: ImportantBannerProps) {
  const frameStyle = {
    "--sheet-accent": ACCENT_COLORS[accent],
  } as CSSProperties;

  return (
    <div ref={frameRef} className={styles.ImportantBanner} style={frameStyle}>
      <div className={styles.ImportantLabel}>Important</div>
      <textarea
        className={styles.ImportantInput}
        value={value}
        rows={1}
        aria-label="Important"
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
