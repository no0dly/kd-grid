import { toPng } from "html-to-image";

const GRID_BACKGROUND = "#1a1a1a";
const BANNER_BACKGROUND = "#0a0a0a";
const INVALID_FILENAME_CHARACTERS = /[<>:"/\\|?*\u0000-\u001f]/g;

export function screenshotFilenames(base: string) {
  const name = base.replace(INVALID_FILENAME_CHARACTERS, "").trim() || "survivor";
  return {
    grid: `${name}.png`,
    stats: `${name}_stats.png`,
    important: `${name}_abilities.png`,
  };
}

function stampFormValues(root: HTMLElement) {
  const restores: Array<() => void> = [];

  for (const control of root.querySelectorAll("input, textarea")) {
    if (control instanceof HTMLInputElement) {
      const previous = control.getAttribute("value");
      control.setAttribute("value", control.value);
      restores.push(() => {
        if (previous === null) {
          control.removeAttribute("value");
        } else {
          control.setAttribute("value", previous);
        }
      });
      continue;
    }

    if (control instanceof HTMLTextAreaElement) {
      const previous = control.innerHTML;
      control.textContent = control.value;
      restores.push(() => {
        control.innerHTML = previous;
      });
    }
  }

  return () => {
    for (const restore of restores) {
      restore();
    }
  };
}

async function captureNodePng(node: HTMLElement, backgroundColor: string) {
  const restore = stampFormValues(node);
  try {
    return await toPng(node, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor,
    });
  } finally {
    restore();
  }
}

function downloadDataUrl(filename: string, dataUrl: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

export async function downloadSurvivorShots(input: {
  baseName: string;
  grid: HTMLElement;
  stats: HTMLElement;
  important: HTMLElement;
}) {
  const names = screenshotFilenames(input.baseName);
  const shots = [
    {
      node: input.grid,
      filename: names.grid,
      backgroundColor: GRID_BACKGROUND,
    },
    {
      node: input.stats,
      filename: names.stats,
      backgroundColor: BANNER_BACKGROUND,
    },
    {
      node: input.important,
      filename: names.important,
      backgroundColor: BANNER_BACKGROUND,
    },
  ];

  const images: { filename: string; dataUrl: string }[] = [];
  for (const shot of shots) {
    images.push({
      filename: shot.filename,
      dataUrl: await captureNodePng(shot.node, shot.backgroundColor),
    });
  }

  for (const image of images) {
    downloadDataUrl(image.filename, image.dataUrl);
  }
}
