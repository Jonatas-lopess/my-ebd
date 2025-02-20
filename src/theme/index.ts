import { createTheme } from "@shopify/restyle";
import { colors } from "./Colors";
import { spacing } from "./Spacing";

const theme = createTheme({
  colors,
  spacing,
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
