"use client";

import { useEffect, useState, type CSSProperties, type Ref } from "react";
import {
  ACCENT_COLORS,
  STAT_KEY_LABELS,
  STAT_ROW_LABELS,
} from "@/lib/gear/constants";
import {
  STAT_KEYS,
  STAT_ROWS,
  type AccentColor,
  type StatKey,
  type StatRow,
  type SurvivorStats,
} from "@/lib/gear/types";
import styles from "@/components/gear/styles/GearBoard.module.css";

const STAT_DRAFT_PATTERN = /^-?\d*$/;
const COMPLETE_STAT_PATTERN = /^-?\d+$/;

type StatsTableProps = {
  frameRef: Ref<HTMLDivElement>;
  name: string;
  accent: AccentColor;
  stats: SurvivorStats;
  onChange: (row: StatRow, key: StatKey, value: number) => void;
};

function accentStyle(accent: AccentColor): CSSProperties {
  return { "--sheet-accent": ACCENT_COLORS[accent] } as CSSProperties;
}

export function StatsTable({
  frameRef,
  name,
  accent,
  stats,
  onChange,
}: StatsTableProps) {
  return (
    <div ref={frameRef} className={styles.StatsFrame} style={accentStyle(accent)}>
      <table className={styles.StatsTable}>
        <thead>
          <tr>
            <th className={styles.StatsCorner} scope="col">
              {name}
            </th>
            {STAT_KEYS.map((key) => (
              <th key={key} className={styles.StatsHeader} scope="col">
                {STAT_KEY_LABELS[key]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {STAT_ROWS.map((row) => (
            <tr key={row}>
              <th className={styles.StatsRowLabel} scope="row">
                {STAT_ROW_LABELS[row]}
              </th>
              {STAT_KEYS.map((key) => (
                <td key={key} className={styles.StatsValue}>
                  <StatInput
                    label={`${STAT_ROW_LABELS[row]} ${STAT_KEY_LABELS[key]}`}
                    value={stats[row][key]}
                    onChange={(value) => onChange(row, key, value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const [draft, setDraft] = useState(String(value));

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  return (
    <input
      className={styles.StatsInput}
      aria-label={label}
      inputMode="numeric"
      value={draft}
      onChange={(event) => {
        const next = event.target.value;
        if (!STAT_DRAFT_PATTERN.test(next)) {
          return;
        }
        setDraft(next);
        if (COMPLETE_STAT_PATTERN.test(next)) {
          onChange(Number(next));
        }
      }}
      onBlur={() => {
        if (!COMPLETE_STAT_PATTERN.test(draft)) {
          setDraft(String(value));
        }
      }}
    />
  );
}
