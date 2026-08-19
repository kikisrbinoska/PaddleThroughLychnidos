// Design tokens mirrored from the Tailwind `@theme` in src/index.css, for
// use anywhere a raw value is needed instead of a Tailwind class (inline
// styles, canvas/map layers, chart libraries, etc). Keep in sync manually.
export const colors = {
  primary: {
    900: "#1570EF",
    800: "#1D8CF0",
    700: "#23A0F5",
    600: "#2FADF7",
    500: "#52BEFA",
    400: "#7ACBFB",
    300: "#A5DDFC",
    200: "#CDEDFD",
    100: "#EAF9FE",
  },
  secondary: {
    900: "#1E9E3C",
    800: "#2FB047",
    700: "#45C158",
    600: "#5DCE6A",
    500: "#7ADB83",
    400: "#9AE6A0",
    300: "#BEF0C0",
    200: "#DEF7DD",
    100: "#F1FCEF",
  },
  brown: {
    900: "#6B3F1D",
    700: "#8A5A2E",
    500: "#B08256",
    300: "#D9BC98",
    100: "#F2E6D8",
  },
  nosijaRed: {
    900: "#8C1F1F",
    700: "#B22B26",
    500: "#D9432F",
    300: "#EF8471",
    100: "#FBDAD3",
  },
  nosijaGold: {
    900: "#A9770C",
    700: "#CC9A16",
    500: "#E8B923",
    300: "#F5D871",
    100: "#FCF0C8",
  },
  surface: {
    bg: "#FDFCF8",
    card: "#FFFFFF",
  },
  text: {
    primary: "#1A1A1A",
    secondary: "#6B6B6B",
  },
  border: {
    default: "#E5E5E0",
  },
} as const;

export const fontFamily = {
  sans: "'Manrope', system-ui, 'Segoe UI', Roboto, sans-serif",
} as const;
