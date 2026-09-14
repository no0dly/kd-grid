import Image from "next/image";
import { GEAR_IMAGE_HEIGHT, GEAR_IMAGE_WIDTH } from "@/lib/gear/constants";
import type { GearItem } from "@/lib/gear/types";

type GearCardImageProps = {
  item: GearItem;
  sizes?: string;
  fill?: boolean;
};

export function GearCardImage({
  item,
  sizes = "220px",
  fill = false,
}: GearCardImageProps) {
  if (fill) {
    return (
      <Image
        src={item.image_url}
        alt={item.name}
        fill
        loading="lazy"
        className="object-cover"
        sizes={sizes}
      />
    );
  }

  return (
    <Image
      src={item.image_url}
      alt={item.name}
      width={GEAR_IMAGE_WIDTH}
      height={GEAR_IMAGE_HEIGHT}
      loading="lazy"
      style={{ width: "100%", height: "auto", display: "block" }}
      sizes={sizes}
    />
  );
}
