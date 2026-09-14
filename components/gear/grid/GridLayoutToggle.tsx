"use client";

import type { GridLayout } from "@/lib/gear/types";
import styles from "@/components/gear/styles/GearBoard.module.css";

type GridLayoutToggleProps = {
  value: GridLayout;
  onChange: (layout: GridLayout) => void;
};

export function GridLayoutToggle({ value, onChange }: GridLayoutToggleProps) {
  const isScout = value === "scout";

  return (
    <button
      type="button"
      className={styles.ScoutToggle}
      role="switch"
      aria-checked={isScout}
      onClick={() => onChange(isScout ? "survivor" : "scout")}
    >
      <span className={styles.ScoutToggleKnob} aria-hidden />
      <span className={styles.ScoutToggleLabel}>Scout</span>
    </button>
  );
}
