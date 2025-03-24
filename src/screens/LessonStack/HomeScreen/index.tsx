import FocusAwareStatusBar from "../../../components/FocusAwareStatusBar";
import ThemedText from "../../../components/ThemedText";
import ThemedView from "../../../components/ThemedView";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemeProps } from "../../../theme";
import { useTheme } from "@shopify/restyle";
import { FlatList } from "react-native";
import InfoCard from "../../../components/InfoCard";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../providers/AuthProvider";
import { StackHeader } from "../../../components/StackHeader";

export default function HomeScreen() {
  const theme = useTheme<ThemeProps>();
  const navigation = useNavigation();
  const { user } = useAuth();

  const DATA_LESSONS = [
    {
      id: "aDe1",
      title: "Aula 1",
      date: "10/01/2023",
      total: 32,
      presents: 20,
    },
  ];

  return (
    <ThemedView flex={1} style={{ backgroundColor: "white" }}>
      <FocusAwareStatusBar style="dark" translucent />

      <StackHeader.Root>
        <StackHeader.Title>Minha EBD</StackHeader.Title>
        <StackHeader.Actions>
          <StackHeader.Action
            name="calendar-clear"
            onPress={() => {}}
            color={theme.colors.gray}
          />
          <StackHeader.Action
            name="add-outline"
            onPress={() => {}}
            color={theme.colors.gray}
          />
        </StackHeader.Actions>
      </StackHeader.Root>

      <FlatList
        data={DATA_LESSONS}
        renderItem={({ item }) => (
          <InfoCard
            title={`${item.title} - ${item.date}`}
            detail={((item.presents / item.total) * 100).toFixed(2) + "%"}
            onPress={() =>
              navigation.navigate("Inicio", {
                screen: "Lessons_Details",
                params: { lessonId: item.id },
              })
            }
            onLongPress={() => user?.role === "admin" && alert("edit")}
            info={{ title: "Presentes", detail: item.presents.toString() }}
            extraInfo={{
              title: "Ausentes",
              detail: (item.total - item.presents).toString(),
            }}
          />
        )}
        keyExtractor={(item) => item.id}
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
