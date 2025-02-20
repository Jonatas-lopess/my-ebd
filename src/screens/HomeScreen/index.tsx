import { Ionicons } from "@expo/vector-icons";
import ThemedView from "../../components/ThemedView";
import ThemedText from "../../components/ThemedText";
import { useTheme } from "@shopify/restyle";
import { ThemeProps } from "../../theme";
import { ScrollView } from "react-native";

export default function HomeScreen() {
  const iconSize = useTheme<ThemeProps>().spacing.l;

  return (
    <ThemedView flex={1}>
      <ThemedView height="45%" backgroundColor="primary" paddingTop="safeArea">
        <ThemedView flexDirection="row" mx="s" mt="s">
          <ThemedView flex={1} alignItems="center" pl="l">
            <ThemedText color="gray" variant="body" fontWeight="bold">
              Minha EBD
            </ThemedText>
          </ThemedView>
          <Ionicons name="menu" size={iconSize} color="white" />
        </ThemedView>

        <ThemedView flexDirection="column" alignItems="center" mt="m">
          <ThemedText variant="header" color="white">
            Escola Bíblica
          </ThemedText>
          <ThemedText variant="body" color="white">
            Vila Mury
          </ThemedText>
        </ThemedView>

        <ScrollView horizontal={true} style={{ marginTop: 10 }}>
          <ThemedView
            width={150}
            height={30}
            backgroundColor="white"
            borderRadius={10}
            mx="s"
          />
          <ThemedView
            width={150}
            height={30}
            backgroundColor="white"
            borderRadius={10}
            mx="s"
          />
          <ThemedView
            width={150}
            height={30}
            backgroundColor="white"
            borderRadius={10}
            mx="s"
          />
        </ScrollView>
      </ThemedView>
    </ThemedView>
  );
}
