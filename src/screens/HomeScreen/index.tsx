import FocusAwareStatusBar from "../../components/FocusAwareStatusBar";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemeProps } from "../../theme";
import { useTheme } from "@shopify/restyle";
import { FlatList } from "react-native";
import InfoCard from "../../components/InfoCard";

export default function HomeScreen() {
  const theme = useTheme<ThemeProps>();

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

      <ThemedView
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        mt="safeArea"
        py="m"
        mx="s"
      >
        <ThemedText color="secondary" fontSize={26} fontWeight="bold" pr="s">
          Minha EBD
        </ThemedText>

        <ThemedView flexDirection="row">
          <Ionicons.Button
            name="calendar-clear"
            color={theme.colors.gray}
            onPress={() => {}}
            size={25}
            backgroundColor="transparent"
            underlayColor="transparent"
            iconStyle={{ marginRight: 0 }}
          />
          <Ionicons.Button
            name="add-outline"
            color={theme.colors.gray}
            onPress={() => {}}
            size={25}
            backgroundColor="transparent"
            underlayColor="transparent"
            iconStyle={{ marginRight: 0 }}
          />
        </ThemedView>
      </ThemedView>

      <FlatList
        data={DATA_LESSONS}
        renderItem={({ item }) => (
          <InfoCard
            title={`${item.title} - ${item.date}`}
            detail={((item.presents / item.total) * 100).toFixed(2) + "%"}
            onPress={() => {}}
            onLongPress={() => {}}
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
