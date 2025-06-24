import { useNavigation } from "@react-navigation/native";
import ThemedView from "@components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import { FlatList, ScrollView, TouchableOpacity } from "react-native";
import ThemedText from "@components/ThemedText";
import IntervalControl, {
  IntervalOptionTypes,
} from "@components/IntervalControl";
import { useState } from "react";
import { ThemeProps } from "@theme";
import { useTheme } from "@shopify/restyle";
import { DataType } from "./type";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@providers/AuthProvider";
import config from "config";
import { ClassStackProps } from "@custom/types/navigation";

export default function ClassDetails({
  route,
}: ClassStackProps<"ClassDetails">) {
  const theme = useTheme<ThemeProps>();
  const { token } = useAuth().authState;
  const { classId } = route.params;
  const navigation = useNavigation();
  const [interval, setInterval] =
    useState<IntervalOptionTypes>("Últimas 13 aulas");

  const { data, error, isPending, isError } = useQuery({
    queryKey: ["classDetails", classId],
    queryFn: async () => {
      const res = await fetch(config.apiBaseUrl + "/classes/" + classId, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return res.json();
    },
  });

  const sortedData: DataType[] = (
    data?.students.map((student: string) => ({
      nome: student,
      pontos: 10,
    })) ?? []
  ).sort((a: DataType, b: DataType) => b.pontos - a.pontos);

  const handleCardPress = (newInterval: IntervalOptionTypes) => {
    setInterval(newInterval);
  };

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
            Turma
          </ThemedText>
        </ThemedView>

        <ThemedView mt="m">
          <IntervalControl interval={interval} onCardPress={handleCardPress} />
        </ThemedView>

        <ThemedView
          flex={1}
          mt="xxl"
          backgroundColor="white"
          borderTopLeftRadius={20}
          borderTopRightRadius={20}
        >
          <ThemedText color="black" fontWeight="bold" mt="m" textAlign="center">
            Ranking de Pontuação
          </ThemedText>
          <ThemedText color="gray" fontSize={12} textAlign="center">
            A pontuação é baseada no intervalo selecionado.
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
              data={sortedData}
              renderItem={({ item, index }) => (
                <ThemedView flexDirection="row" gap="s">
                  {index < 3 && (
                    <ThemedView
                      aspectRatio={1}
                      width={35}
                      borderRadius={100}
                      alignItems="center"
                      justifyContent="center"
                      style={{ backgroundColor: "#fff" }}
                    >
                      <ThemedText>{`${index + 1}º`}</ThemedText>
                    </ThemedView>
                  )}
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() =>
                      navigation.navigate("Turmas", {
                        screen: "StudentDetails",
                        params: { studentId: item.nome },
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
                      <ThemedText fontSize={16}>{item.nome}</ThemedText>
                      <ThemedText>{item.pontos}</ThemedText>
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
