import { toPng } from "html-to-image";
import { slugify } from "@/lib/gear/utils/slugify";

export async function downloadGridPng(
  node: HTMLElement,
  survivorName: string,
) {
  const dataUrl = await toPng(node, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: "#1a1a1a",
  });

  const link = document.createElement("a");
  link.download = `${slugify(survivorName)}-gear.png`;
  link.href = dataUrl;
  link.click();
}
