import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import ThemedText from "@components/ThemedText";
import ThemedView from "@components/ThemedView";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeProps } from "@theme";
import { useTheme } from "@shopify/restyle";
import { TouchableOpacity } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@providers/AuthProvider";
import config from "config";

type Plan = {
  _id: string;
  institution: string;
  superintendent: unknown;
};

export default function HomeScreen() {
  const theme = useTheme<ThemeProps>();
  const navigation = useNavigation();
  const { token, user } = useAuth().authState;

  const { data, isSuccess } = useQuery({
    queryKey: ["lessonInfo", user?.plan],
    queryFn: async (): Promise<Plan> => {
      const response = await fetch(config.apiBaseUrl + `/plans/${user?.plan}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const resJson = await response.json();
      if (!response.ok)
        throw new Error(resJson.message, { cause: resJson.error });

      return resJson;
    },
  });

  return (
    <ThemedView flex={1} backgroundColor="secondary" pt="safeArea">
      <FocusAwareStatusBar style="light" translucent />

      <ThemedView flexDirection="row" mx="s" mt="s" alignItems="center">
        <ThemedView flex={1} alignItems="center" pl="l">
          <ThemedText color="lightgrey" variant="body" fontWeight="bold">
            Minha EBD
          </ThemedText>
        </ThemedView>
        <Ionicons.Button
          name="menu"
          color={theme.colors.lightgrey}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          size={25}
          backgroundColor="transparent"
          underlayColor="transparent"
          style={{ padding: 0 }}
          iconStyle={{ marginRight: 0 }}
        />
      </ThemedView>

      <ThemedView flexDirection="column" alignItems="center" mt="xl" flex={1}>
        <ThemedView width={140} height={140} borderRadius={70} bg="gray" />
        <ThemedText variant="h1" color="white">
          Escola Bíblica
        </ThemedText>
        <ThemedText variant="body" color="white">
          {isSuccess && data ? data.institution : "Carregando..."}
        </ThemedText>

        <ThemedView mt="xxl" gap="m" flexDirection="column">
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Geral", { screen: "GeneralScreen" })
            }
            style={{
              backgroundColor: theme.colors.white,
              paddingVertical: theme.spacing.m,
              paddingHorizontal: theme.spacing.xxxl,
              borderRadius: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: theme.spacing.s,
            }}
          >
            <Ionicons name="trophy" color={theme.colors.primary} size={26} />
            <ThemedText color="primary" fontWeight="bold">
              {user?.role === "admin" || user?.role === "owner"
                ? "Ranque Geral"
                : "Ranque da Turma"}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Lessons", { screen: "LessonList" })
            }
            style={{
              backgroundColor: theme.colors.white,
              paddingVertical: theme.spacing.m,
              paddingHorizontal: theme.spacing.xxxl,
              borderRadius: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: theme.spacing.s,
            }}
          >
            <Ionicons name="book" color={theme.colors.primary} size={26} />
            <ThemedText color="primary" fontWeight="bold">
              Lições
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Turmas", { screen: "ClassList" })
            }
            style={{
              backgroundColor: theme.colors.white,
              paddingVertical: theme.spacing.m,
              paddingHorizontal: theme.spacing.xxxl,
              borderRadius: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: theme.spacing.s,
            }}
          >
            <Ionicons name="school" color={theme.colors.primary} size={26} />
            <ThemedText color="primary" fontWeight="bold">
              Turmas
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Cadastros", { screen: "RegisterList" })
            }
            style={{
              backgroundColor: theme.colors.white,
              paddingVertical: theme.spacing.m,
              paddingHorizontal: theme.spacing.xxxl,
              borderRadius: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: theme.spacing.s,
            }}
          >
            <Ionicons name="people" color={theme.colors.primary} size={26} />
            <ThemedText color="primary" fontWeight="bold">
              Cadastros
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}
