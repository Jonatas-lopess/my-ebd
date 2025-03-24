import { FlatList } from "react-native";
import ThemedView from "../../../components/ThemedView";
import ThemedText from "../../../components/ThemedText";
import FocusAwareStatusBar from "../../../components/FocusAwareStatusBar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemeProps } from "../../../theme";
import { useTheme } from "@shopify/restyle";
import InfoCard from "../../../components/InfoCard";
import { StackHeader } from "../../../components/StackHeader";

export default function ClassScreen() {
  const theme = useTheme<ThemeProps>();

  const DATA_CLASS = [
    { id: 1, name: "Josué", students: 10, type: "Jovens" },
    { id: 2, name: "Abraão", students: 14, type: "Adultos" },
  ];

  return (
    <ThemedView flex={1} style={{ backgroundColor: "white" }}>
      <FocusAwareStatusBar style="dark" translucent />

      <StackHeader.Root>
        <StackHeader.Content>
          <StackHeader.Title>Minha EBD</StackHeader.Title>
          <StackHeader.Detail>• Vila Mury</StackHeader.Detail>
        </StackHeader.Content>
        <StackHeader.Actions>
          <StackHeader.Action
            name="add-outline"
            onPress={() => {}}
            color={theme.colors.gray}
          />
        </StackHeader.Actions>
      </StackHeader.Root>

      <FlatList
        data={DATA_CLASS}
        renderItem={({ item }) => (
          <InfoCard
            title={item.name}
            detail={item.type}
            onPress={() => {}}
            onLongPress={() => {}}
            info={{ title: "Alunos", detail: item.students.toString() }}
            extraInfo={{ title: "Media", detail: "100%" }}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        style={{ backgroundColor: theme.colors.white }}
        contentContainerStyle={{
          gap: theme.spacing.s,
          marginTop: theme.spacing.s,
          paddingHorizontal: theme.spacing.s,
        }}
      />
    </ThemedView>
  );
}
