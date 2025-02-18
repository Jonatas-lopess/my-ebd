import { createTheme } from "@shopify/restyle";

const colors = {
  primary: "#2359CF",
  secondary: "#375AA5",
  lightBlue: "#0050FA",

  black: "#0B0B0B",
  white: "#F0F2F3",
};

const theme = createTheme({
  colors,
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  textVariants: {
    header: {
      fontWeight: "bold",
      fontSize: 34,
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
    },
    defaults: {
      // We can define a default text variant here.
    },
  },
});

type ThemeProps = typeof theme;
export { theme, ThemeProps };
