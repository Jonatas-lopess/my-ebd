import { FlatList, Pressable, ScrollView } from "react-native";
import ThemedView from "../../../components/ThemedView";
import ThemedText from "../../../components/ThemedText";
import FocusAwareStatusBar from "../../../components/FocusAwareStatusBar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemeProps } from "../../../theme";
import { useTheme } from "@shopify/restyle";

export default function ClassScreen() {
  const theme = useTheme<ThemeProps>();

  const DATA_CLASS = [
    { id: 1, name: "Josué", students: 10, type: "Jovens" },
    { id: 2, name: "Abraão", students: 14, type: "Adultos" },
  ];

  return (
    <ThemedView flex={1} style={{ backgroundColor: "white" }}>
      <FocusAwareStatusBar style="dark" translucent />

      <ThemedView
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        mt="safeArea"
        py="m"
        mx="s"
      >
        <ThemedView flexDirection="row" alignItems="center">
          <ThemedText color="secondary" fontSize={26} fontWeight="bold" pr="s">
            Minha EBD
          </ThemedText>
          <ThemedText color="gray" fontSize={20}>
            • Vila Mury
          </ThemedText>
        </ThemedView>
        <Ionicons.Button
          name="add-outline"
          color={theme.colors.gray}
          onPress={() => {}}
          size={25}
          backgroundColor="transparent"
          underlayColor="transparent"
          style={{ marginRight: 5, padding: 0 }}
        />
      </ThemedView>

      <FlatList
        data={DATA_CLASS}
        renderItem={({ item }) => (
          <Pressable onPress={() => {}} onLongPress={() => alert("long press")}>
            <ThemedView
              style={{ backgroundColor: "white" }}
              borderRadius={10}
              py="s"
              px="m"
            >
              <ThemedView alignItems="center" flexDirection="row" mb="s">
                <ThemedText variant="h3" mr="xs">
                  {item.name}
                </ThemedText>
                <ThemedText variant="body" color="gray">
                  • {item.type}
                </ThemedText>
              </ThemedView>
              <ThemedView
                borderTopWidth={1}
                borderColor="lightgrey"
                flexDirection="row"
                justifyContent="space-around"
                pt="s"
              >
                <ThemedText>Alunos: {item.students}</ThemedText>
                <ThemedView borderLeftWidth={1} borderLeftColor="lightgrey" />
                <ThemedText>Presença: 100%</ThemedText>
              </ThemedView>
            </ThemedView>
          </Pressable>
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
