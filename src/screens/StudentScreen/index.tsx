import { useTheme } from "@shopify/restyle";
import { ThemeProps } from "../../theme";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import FocusAwareStatusBar from "../../components/FocusAwareStatusBar";

export default function StudentScreen() {
  const theme = useTheme<ThemeProps>();

  return (
    <ThemedView flex={1} backgroundColor="white">
      <FocusAwareStatusBar style="dark" translucent />

      <ThemedView paddingTop="safeArea">
        <ThemedText color="gray" variant="body" fontWeight="bold">
          Minha EBD
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}
