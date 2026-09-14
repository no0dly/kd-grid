"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { AppHeader } from "@/components/app/AppHeader";
import { GearDragPreview } from "@/components/gear/grid/GearDragPreview";
import { GearSlot } from "@/components/gear/grid/GearSlot";
import { SurvivorNameField } from "@/components/gear/grid/SurvivorNameField";
import { GearPicker } from "@/components/gear/picker";
import { RecentRail } from "@/components/gear/recent";
import { POINTER_ACTIVATION_DISTANCE, SLOT_COUNT } from "@/lib/gear/constants";
import { useHasHydrated } from "@/lib/gear/hooks";
import { useSurvivor, useSurvivorActions } from "@/lib/gear/store";
import type { GearItem } from "@/lib/gear/types";
import { downloadGridPng } from "@/lib/gear/utils";
import {
  slotCollisionDetection,
  slotIndexFromDndId,
  snapOverlayToCursor,
} from "@/lib/gear/utils/dnd";
import { api } from "@/trpc/client";
import styles from "@/components/gear/styles/GearBoard.module.css";

export function GearGridPage() {
  const params = useParams<{ id: string }>();
  const survivorId = params.id;
  const hydrated = useHasHydrated();
  const survivor = useSurvivor(survivorId);
  const { setSlot, swapSlots } = useSurvivorActions();
  const { data: catalog = [], isLoading, error } = api.gear.list.useQuery();
  const gearById = useMemo(
    () => new Map(catalog.map((item) => [item.id, item])),
    [catalog],
  );
  const [pickerIndex, setPickerIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [activeItem, setActiveItem] = useState<GearItem | undefined>();
  const [shotStatus, setShotStatus] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: POINTER_ACTIVATION_DISTANCE },
    }),
  );

  function assignToSlot(index: number, gearId: string) {
    setSlot(survivorId, index, gearId);
    setSelectedIndex(index);
  }

  function handleRecentPick(gearId: string) {
    const target =
      selectedIndex ??
      survivor?.slots.findIndex((slot) => slot == null) ??
      -1;
    if (target < 0) {
      return;
    }
    assignToSlot(target, gearId);
  }

  function handlePickerSelect(gearId: string) {
    if (pickerIndex == null) {
      return;
    }
    assignToSlot(pickerIndex, gearId);
    setPickerIndex(null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveItem(undefined);
    const { active, over } = event;
    if (!over) {
      return;
    }

    const toIndex = slotIndexFromDndId(over.id);
    const data = active.data.current as
      | { type?: string; gearId?: string; index?: number }
      | undefined;
    const gearId = data?.gearId;
    if (toIndex == null || !gearId) {
      return;
    }

    if (data.type === "equipped" && typeof data.index === "number") {
      swapSlots(survivorId, data.index, toIndex);
      return;
    }

    assignToSlot(toIndex, gearId);
  }

  async function handleScreenshot() {
    if (!gridRef.current || !survivor) {
      return;
    }

    try {
      await downloadGridPng(gridRef.current, survivor.name);
      setShotStatus("Saved a PNG of the grid.");
    } catch (shotError) {
      console.error(shotError);
      setShotStatus("Could not capture the grid.");
    }
  }

  if (!hydrated) {
    return (
      <div className={styles.Page}>
        <AppHeader variant="dark" />
        <p className={styles.Missing}>Loading gear grid…</p>
      </div>
    );
  }

  if (!survivor) {
    return (
      <div className={styles.Page}>
        <AppHeader variant="dark" />
        <p className={styles.Missing}>
          That survivor was not found.{" "}
          <Link href="/survivors">Back to the roster</Link>
        </p>
      </div>
    );
  }

  return (
    <div className={styles.Page}>
      <AppHeader variant="dark">
        <Link href="/survivors" className={styles.Shot}>
          Roster
        </Link>
      </AppHeader>
      <DndContext
        sensors={sensors}
        collisionDetection={slotCollisionDetection}
        onDragStart={(event) => {
          const gearId = event.active.data.current?.gearId as string | undefined;
          setActiveItem(gearId ? gearById.get(gearId) : undefined);
        }}
        onDragCancel={() => setActiveItem(undefined)}
        onDragEnd={handleDragEnd}
      >
        <div className={styles.Layout}>
          <section className={styles.Stage}>
            <div className={styles.NameRow}>
              <SurvivorNameField
                key={survivor.id}
                id={survivor.id}
                name={survivor.name}
                className={styles.NameInput}
                errorClassName={styles.NameError}
              />
              <button
                type="button"
                className={styles.Shot}
                onClick={() => void handleScreenshot()}
              >
                Screenshot grid
              </button>
            </div>
            {error ? (
              <p className={styles.EmptyRecent}>Could not load the gear catalog.</p>
            ) : null}
            {isLoading ? (
              <p className={styles.EmptyRecent}>Loading gear catalog…</p>
            ) : null}
            {shotStatus ? <p className={styles.EmptyRecent}>{shotStatus}</p> : null}
            <div className={styles.BoardWrap}>
              <p className={styles.Kicker}>Gear grid</p>
              <p className={styles.Hint}>Drag a card onto another slot to swap</p>
              <div className={styles.GridHost}>
              <div ref={gridRef} className={styles.Grid}>
                {Array.from({ length: SLOT_COUNT }, (_, index) => {
                  const gearId = survivor.slots[index];
                  return (
                    <GearSlot
                      key={index}
                      index={index}
                      item={gearId ? gearById.get(gearId) : undefined}
                      onOpen={(slotIndex) => {
                        setSelectedIndex(slotIndex);
                        setPickerIndex(slotIndex);
                      }}
                      onClear={(slotIndex) => setSlot(survivor.id, slotIndex, null)}
                    />
                  );
                })}
              </div>
              </div>
            </div>
          </section>
          <RecentRail catalog={catalog} onPick={handleRecentPick} />
        </div>
        <DragOverlay dropAnimation={null} modifiers={[snapOverlayToCursor]}>
          {activeItem ? <GearDragPreview item={activeItem} /> : null}
        </DragOverlay>
      </DndContext>
      {pickerIndex != null ? (
        <GearPicker
          items={catalog}
          onSelect={handlePickerSelect}
          onClose={() => setPickerIndex(null)}
        />
      ) : null}
    </div>
  );
}
