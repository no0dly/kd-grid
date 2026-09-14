"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";
import {
  DEFAULT_SURVIVOR_NAME,
  RECENT_CAP,
  SLOT_COUNT,
  SURVIVOR_STORAGE_KEY,
} from "@/lib/gear/constants";
import type { Survivor } from "@/lib/gear/types";
import {
  createSurvivor,
  isNameTaken,
  nextUniqueName,
  normalizeSurvivorName,
  uniquifySurvivorNames,
} from "@/lib/gear/utils";

type SurvivorState = {
  survivors: Survivor[];
  recentGearIds: string[];
};

type SurvivorActions = {
  createSurvivor: (name?: string) => string;
  renameSurvivor: (id: string, name: string) => boolean;
  setScreenshotName: (id: string, screenshotName: string) => void;
  deleteSurvivor: (id: string) => void;
  setSlot: (survivorId: string, index: number, gearId: string | null) => void;
  swapSlots: (survivorId: string, fromIndex: number, toIndex: number) => void;
  pushRecent: (gearId: string) => void;
  removeRecent: (gearId: string) => void;
};

type SurvivorStore = SurvivorState & SurvivorActions;

export const useSurvivorStoreBase = create<SurvivorStore>()(
  persist(
    (set, get) => ({
      survivors: [createSurvivor()],
      recentGearIds: [],
      createSurvivor: (name) => {
        const survivor = createSurvivor(
          nextUniqueName(name ?? DEFAULT_SURVIVOR_NAME, get().survivors),
        );
        set((state) => ({
          survivors: [...state.survivors, survivor],
        }));
        return survivor.id;
      },
      renameSurvivor: (id, name) => {
        const trimmed = normalizeSurvivorName(name);
        if (isNameTaken(trimmed, get().survivors, id)) {
          return false;
        }

        set((state) => ({
          survivors: state.survivors.map((survivor) =>
            survivor.id === id
              ? { ...survivor, name: trimmed, updatedAt: Date.now() }
              : survivor,
          ),
        }));
        return true;
      },
      setScreenshotName: (id, screenshotName) => {
        set((state) => ({
          survivors: state.survivors.map((survivor) =>
            survivor.id === id
              ? {
                  ...survivor,
                  screenshotName,
                  updatedAt: Date.now(),
                }
              : survivor,
          ),
        }));
      },
      deleteSurvivor: (id) => {
        set((state) => {
          const remaining = state.survivors.filter(
            (survivor) => survivor.id !== id,
          );
          return {
            survivors:
              remaining.length > 0
                ? remaining
                : [createSurvivor(nextUniqueName(DEFAULT_SURVIVOR_NAME, []))],
          };
        });
      },
      setSlot: (survivorId, index, gearId) => {
        if (index < 0 || index >= SLOT_COUNT) {
          return;
        }

        set((state) => ({
          survivors: state.survivors.map((survivor) => {
            if (survivor.id !== survivorId) {
              return survivor;
            }
            const slots = [...survivor.slots];
            slots[index] = gearId;
            return { ...survivor, slots, updatedAt: Date.now() };
          }),
          recentGearIds: gearId
            ? [
                gearId,
                ...state.recentGearIds.filter((id) => id !== gearId),
              ].slice(0, RECENT_CAP)
            : state.recentGearIds,
        }));
      },
      swapSlots: (survivorId, fromIndex, toIndex) => {
        if (
          fromIndex === toIndex ||
          fromIndex < 0 ||
          toIndex < 0 ||
          fromIndex >= SLOT_COUNT ||
          toIndex >= SLOT_COUNT
        ) {
          return;
        }

        set((state) => ({
          survivors: state.survivors.map((survivor) => {
            if (survivor.id !== survivorId) {
              return survivor;
            }
            const slots = [...survivor.slots];
            const from = slots[fromIndex];
            slots[fromIndex] = slots[toIndex] ?? null;
            slots[toIndex] = from ?? null;
            return { ...survivor, slots, updatedAt: Date.now() };
          }),
        }));
      },
      pushRecent: (gearId) => {
        set((state) => ({
          recentGearIds: [
            gearId,
            ...state.recentGearIds.filter((id) => id !== gearId),
          ].slice(0, RECENT_CAP),
        }));
      },
      removeRecent: (gearId) => {
        set((state) => ({
          recentGearIds: state.recentGearIds.filter((id) => id !== gearId),
        }));
      },
    }),
    {
      name: SURVIVOR_STORAGE_KEY,
      merge: (persisted, current) => {
        const stored = persisted as Partial<SurvivorState> | undefined;
        const survivors =
          stored?.survivors && stored.survivors.length > 0
            ? stored.survivors.map((survivor) => ({
                ...survivor,
                screenshotName: survivor.screenshotName ?? "",
                slots: Array.from({ length: SLOT_COUNT }, (_, index) =>
                  survivor.slots?.[index] === undefined
                    ? null
                    : survivor.slots[index],
                ),
              }))
            : current.survivors;

        return {
          ...current,
          ...stored,
          survivors: uniquifySurvivorNames(survivors),
          recentGearIds: stored?.recentGearIds ?? current.recentGearIds,
        };
      },
    },
  ),
);

export const useSurvivorStore = <T,>(selector: (state: SurvivorStore) => T) =>
  useSurvivorStoreBase(selector);

export const useSurvivors = () =>
  useSurvivorStore((state) => state.survivors);

export const useRecentGearIds = () =>
  useSurvivorStore((state) => state.recentGearIds);

export const useSurvivor = (id: string | undefined) =>
  useSurvivorStore((state) =>
    id ? (state.survivors.find((survivor) => survivor.id === id) ?? null) : null,
  );

export const useSurvivorActions = () =>
  useSurvivorStoreBase(
    useShallow((state) => ({
      createSurvivor: state.createSurvivor,
      renameSurvivor: state.renameSurvivor,
      setScreenshotName: state.setScreenshotName,
      deleteSurvivor: state.deleteSurvivor,
      setSlot: state.setSlot,
      swapSlots: state.swapSlots,
      pushRecent: state.pushRecent,
      removeRecent: state.removeRecent,
    })),
  );
