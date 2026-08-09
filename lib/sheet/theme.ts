import { defaultTheme, type Theme } from "@univerjs/presets";

/**
 * Ink + teal UI theme for KD Grid.
 * Light chrome with a petroleum-teal accent (avoids default blue/purple look).
 */
export const kdGridTheme: Theme = {
  ...defaultTheme,
  white: "#F3F6F5",
  black: "#14201C",
  primary: {
    50: "#E8F7F3",
    100: "#CDEFE6",
    200: "#9AD9C8",
    300: "#5FBFAB",
    400: "#2A9F8C",
    500: "#0F766E",
    600: "#0C5F59",
    700: "#0A4B47",
    800: "#083B38",
    900: "#062E2C",
  },
  gray: {
    50: "#F4F6F5",
    100: "#E6EBE9",
    200: "#D0D8D5",
    300: "#A3B0AB",
    400: "#73827C",
    500: "#53635D",
    600: "#3A4641",
    700: "#2B342F",
    800: "#1F2623",
    900: "#171C1A",
  },
  "loop-color": {
    1: "primary.400",
    2: "green.500",
    3: "jiqing.500",
    4: "yellow.400",
    5: "orange.400",
    6: "blue.500",
    7: "pink.400",
    8: "gray.700",
    9: "primary.600",
    10: "red.400",
    11: "green.600",
    12: "yellow.600",
  },
};
