import { useNavigation } from "@react-navigation/native";
import ThemedView from "@components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import { FlatList, ScrollView, TouchableOpacity } from "react-native";
import ThemedText from "@components/ThemedText";
import { ThemeProps } from "@theme";
import { useTheme } from "@shopify/restyle";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@providers/AuthProvider";
import config from "config";
import { ClassStackProps } from "@custom/types/navigation";
import { _Class } from "../ClassScreen/type";

export default function ClassDetails({
  route,
}: ClassStackProps<"ClassDetails">) {
  const theme = useTheme<ThemeProps>();
  const { token } = useAuth().authState;
  const { classId } = route.params;
  const navigation = useNavigation();

  const { data: classDetails } = useQuery({
    queryKey: ["classDetails", classId],
    queryFn: async (): Promise<_Class> => {
      const res = await fetch(config.apiBaseUrl + "/classes/" + classId, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const resJson = await res.json();
      if (!res.ok) throw new Error(resJson.message, { cause: resJson.error });

      return resJson;
    },
  });

  const { data, error, isPending, isError } = useQuery({
    queryKey: ["classRegister"],
    queryFn: async () => {
      const res = await fetch(
        config.apiBaseUrl + "/registers?class=" + classId,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const resJson = await res.json();
      if (!res.ok) throw new Error(resJson.message, { cause: resJson.error });

      return resJson;
    },
  });

  return (
    <ThemedView flex={1} backgroundColor="secondary" pt="safeArea">
      <FocusAwareStatusBar style="light" translucent />

      <ThemedView flexDirection="row" mx="s" mt="s" alignItems="center">
        <Ionicons
          name="arrow-back"
          size={25}
          color="white"
          onPress={() => navigation.goBack()}
        />
        <ThemedView flex={1} alignItems="center" mr="l">
          <ThemedText color="gray" variant="body" fontWeight="bold">
            Resumo Geral
          </ThemedText>
        </ThemedView>
      </ThemedView>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} nestedScrollEnabled>
        <ThemedView flexDirection="column" alignItems="center" mt="m">
          <ThemedText variant="h1" color="white">
            {classDetails?.name ?? "Turma"}
          </ThemedText>
        </ThemedView>

        <ThemedView
          flex={1}
          mt="xxl"
          backgroundColor="white"
          borderTopLeftRadius={20}
          borderTopRightRadius={20}
        >
          <ThemedText color="black" fontWeight="bold" my="m" textAlign="center">
            Lista de Registros
          </ThemedText>

          {isPending && (
            <ThemedView flex={1} justifyContent="center" alignItems="center">
              <ThemedText>Carregando...</ThemedText>
            </ThemedView>
          )}
          {isError && (
            <ThemedView flex={1} justifyContent="center" alignItems="center">
              <ThemedText>
                Erro ao carregar os dados: {error.message}
              </ThemedText>
            </ThemedView>
          )}
          {data && (
            <FlatList
              data={data}
              renderItem={({ item }) => (
                <ThemedView flexDirection="row" gap="s">
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() =>
                      navigation.navigate("Turmas", {
                        screen: "StudentDetails",
                        params: { studentId: item._id },
                      })
                    }
                  >
                    <ThemedView
                      py="s"
                      px="m"
                      flexDirection="row"
                      justifyContent="space-between"
                      alignItems="center"
                      borderRadius={20}
                      style={{
                        backgroundColor: "#fff",
                      }}
                    >
                      <ThemedText fontSize={16}>{item.name}</ThemedText>
                    </ThemedView>
                  </TouchableOpacity>
                </ThemedView>
              )}
              scrollEnabled={false}
              contentContainerStyle={{
                gap: theme.spacing.s,
                marginVertical: theme.spacing.s,
                marginHorizontal: theme.spacing.s,
              }}
            />
          )}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}
