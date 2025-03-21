import { createTheme } from "@shopify/restyle";
import { colors } from "./Colors";
import { spacing } from "./Spacing";

const theme = createTheme({
  colors,
  spacing,
  textVariants: {
    h1: {
      fontWeight: "bold",
      fontSize: 34,
    },
    h2: {
      fontSize: 26,
      fontWeight: "bold",
    },
    h3: {
      fontSize: 20,
      fontWeight: "bold",
    },
    body: {
      fontSize: 14,
    },
    defaults: {
      // We can define a default text variant here.
    },
  },
});

type ThemeProps = typeof theme;
export { theme, ThemeProps };
