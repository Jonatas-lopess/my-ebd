import { FlatList } from "react-native";
import ThemedView from "../../../components/ThemedView";
import FocusAwareStatusBar from "../../../components/FocusAwareStatusBar";
import { ThemeProps } from "../../../theme";
import { useTheme } from "@shopify/restyle";
import InfoCard from "../../../components/InfoCard";
import { StackHeader } from "../../../components/StackHeader";
import { useNavigation } from "@react-navigation/native";

export default function ClassScreen() {
  const theme = useTheme<ThemeProps>();
  const navigation = useNavigation();

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
            onPress={() =>
              navigation.navigate("Turmas", {
                screen: "Class_Details",
                params: { classId: item.id.toString() },
              })
            }
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
