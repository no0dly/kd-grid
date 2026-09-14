import {
  closestCorners,
  pointerWithin,
  type CollisionDetection,
  type Modifier,
} from "@dnd-kit/core";
import { DRAG_OVERLAY_SIZE } from "@/lib/gear/constants";

export const slotCollisionDetection: CollisionDetection = (args) => {
  const pointerHits = pointerWithin(args);
  return pointerHits.length > 0 ? pointerHits : closestCorners(args);
};

function pointerFromActivator(event: Event | null) {
  if (!event || !("clientX" in event) || !("clientY" in event)) {
    return null;
  }

  return {
    x: (event as PointerEvent).clientX,
    y: (event as PointerEvent).clientY,
  };
}

export const snapOverlayToCursor: Modifier = ({
  activatorEvent,
  draggingNodeRect,
  overlayNodeRect,
  transform,
}) => {
  const pointer = pointerFromActivator(activatorEvent);
  if (!pointer || !draggingNodeRect) {
    return transform;
  }

  const overlayWidth = overlayNodeRect?.width ?? DRAG_OVERLAY_SIZE;
  const overlayHeight = overlayNodeRect?.height ?? DRAG_OVERLAY_SIZE;

  return {
    ...transform,
    x: transform.x + (pointer.x - draggingNodeRect.left) - overlayWidth / 2,
    y: transform.y + (pointer.y - draggingNodeRect.top) - overlayHeight / 2,
  };
};

export function slotIndexFromDndId(id: string | number) {
  const value = String(id);

  if (value.startsWith("slot:")) {
    const index = Number(value.slice(5));
    return Number.isNaN(index) ? null : index;
  }

  if (value.startsWith("equipped:")) {
    const index = Number(value.slice(9));
    return Number.isNaN(index) ? null : index;
  }

  return null;
}
