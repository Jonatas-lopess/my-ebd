import { createBox, createText } from "@shopify/restyle";
import { ThemeProps } from "../../theme";

const ThemedView = createBox<ThemeProps>();
const ThemedText = createText<ThemeProps>();

export default function HomeScreen() {
  return (
    <ThemedView
      flex={1}
      bg="primary"
      justifyContent="center"
      alignItems="center"
    >
      <ThemedText color="white">
        Open up App.tsx to start working on your app!
      </ThemedText>
    </ThemedView>
  );
}
