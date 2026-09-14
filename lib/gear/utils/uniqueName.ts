import {
  DEFAULT_SURVIVOR_NAME,
  DUPLICATE_NAME_ERROR,
} from "@/lib/gear/constants";
import type { Survivor } from "@/lib/gear/types";

export function normalizeSurvivorName(name: string) {
  return name.trim() || DEFAULT_SURVIVOR_NAME;
}

export function namesMatch(left: string, right: string) {
  return left.trim().toLowerCase() === right.trim().toLowerCase();
}

export function isNameTaken(
  name: string,
  survivors: Survivor[],
  excludeId?: string,
) {
  const normalized = normalizeSurvivorName(name);
  return survivors.some(
    (survivor) =>
      survivor.id !== excludeId && namesMatch(survivor.name, normalized),
  );
}

export function duplicateNameError(
  value: string,
  survivors: Survivor[],
  excludeId: string,
) {
  if (!value.trim()) {
    return null;
  }

  return isNameTaken(value, survivors, excludeId) ? DUPLICATE_NAME_ERROR : null;
}

export function nextUniqueName(
  base: string,
  survivors: Survivor[],
  excludeId?: string,
) {
  const normalized = normalizeSurvivorName(base);
  if (!isNameTaken(normalized, survivors, excludeId)) {
    return normalized;
  }

  let suffix = 2;
  let candidate = `${normalized} ${suffix}`;
  while (isNameTaken(candidate, survivors, excludeId)) {
    suffix += 1;
    candidate = `${normalized} ${suffix}`;
  }
  return candidate;
}

export function uniquifySurvivorNames(survivors: Survivor[]) {
  const used = new Set<string>();

  return survivors.map((survivor) => {
    let name = normalizeSurvivorName(survivor.name);
    const base = name;
    let suffix = 2;

    while (used.has(name.toLowerCase())) {
      name = `${base} ${suffix}`;
      suffix += 1;
    }

    used.add(name.toLowerCase());
    return name === survivor.name ? survivor : { ...survivor, name };
  });
}
