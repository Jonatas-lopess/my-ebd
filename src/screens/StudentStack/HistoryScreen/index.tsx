import { useNavigation } from "@react-navigation/native";
import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import ThemedText from "@components/ThemedText";
import ThemedView from "@components/ThemedView";
import { StudentStackProps } from "@custom/types/navigation";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, SectionList } from "react-native";
import { ThemeProps } from "@theme";
import { useTheme } from "@shopify/restyle";
import { useCallback, useState } from "react";
import IntervalControl, {
  IntervalOptionTypes,
} from "@components/IntervalControl";
import { useQuery } from "@tanstack/react-query";
import config from "config";
import { useAuth } from "@providers/AuthProvider";
import { Rollcall } from "@screens/LessonStack/type";
import Register from "../StudentScreen/type";

type GroupedRollcall = {
  mounth: number;
  data: Rollcall[];
};

export default function HistoryScreen({
  route,
}: StudentStackProps<"RegisterHistory">) {
  const { studentId } = route.params;
  const { token } = useAuth().authState;
  const navigation = useNavigation();
  const theme = useTheme<ThemeProps>();
  const [interval, setInterval] =
    useState<IntervalOptionTypes>("Últimas 13 aulas");

  const { data: info } = useQuery({
    queryKey: ["register_info", studentId],
    queryFn: async (): Promise<Register> => {
      const response = await fetch(
        `${config.apiBaseUrl}/registers/${studentId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.json();
    },
  });

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["rollcalls", studentId],
    queryFn: async (): Promise<Rollcall[]> => {
      const response = await fetch(
        `${config.apiBaseUrl}/rollcalls?register=${studentId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.json();
    },
  });

  const groupedData = data?.reduce((acc: GroupedRollcall[], item) => {
    const modItem = {
      ...item,
      date: new Date(item.lesson.date),
    };
    const key = modItem.date.getMonth() + 1;
    const groupIndex = acc.findIndex((i) => i.mounth === key);

    if (groupIndex === -1) {
      acc.push({
        mounth: key,
        data: [modItem],
      });
    } else {
      acc[groupIndex].data.push(modItem);
    }

    return acc;
  }, []);

  const MOUNTHS = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const presence = groupedData?.reduce(
    (acc, item) =>
      acc + item.data.reduce((acc, item) => acc + (item.isPresent ? 1 : 0), 0),
    0
  );

  const abscence = groupedData?.reduce(
    (acc, item) =>
      acc + item.data.reduce((acc, item) => acc + (item.isPresent ? 0 : 1), 0),
    0
  );

  const handleCardPress = useCallback((newInterval: IntervalOptionTypes) => {
    setInterval(newInterval);
  }, []);

  return (
    <ThemedView flex={1} backgroundColor="secondary" pt="safeArea">
      <FocusAwareStatusBar style="light" translucent />

      <ThemedView flexDirection="row" mx="s" mt="s" alignItems="center">
        <Ionicons.Button
          name="arrow-back"
          size={20}
          color="white"
          backgroundColor="transparent"
          style={{
            padding: 0,
          }}
          underlayColor="transparent"
          onPress={() => navigation.goBack()}
        />
        <ThemedView flex={1} alignItems="center" pr="l">
          <ThemedText color="gray" variant="body" fontWeight="bold">
            Histórico
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ScrollView nestedScrollEnabled contentContainerStyle={{ flexGrow: 1 }}>
        <ThemedView flexDirection="column" alignItems="center" mt="m">
          <ThemedText variant="h1" color="white">
            {info?.name ?? "Nome do Aluno"}
          </ThemedText>
          <ThemedText variant="body" color="white">
            Classe {info?.class?.name ?? ""}
          </ThemedText>
        </ThemedView>

        <ThemedView mt="l">
          <IntervalControl interval={interval} onCardPress={handleCardPress} />
        </ThemedView>

        <ThemedView
          flexDirection="row"
          justifyContent="space-between"
          my="m"
          mx="s"
        >
          <ThemedView alignItems="center">
            <ThemedText variant="h2" color="white">
              {presence ?? 0}
            </ThemedText>
            <ThemedText variant="body" color="white">
              Presenças
            </ThemedText>
          </ThemedView>

          <ThemedView alignItems="center">
            <ThemedText variant="h2" color="white">
              {abscence ?? 0}
            </ThemedText>
            <ThemedText variant="body" color="white">
              Ausências
            </ThemedText>
          </ThemedView>

          <ThemedView alignItems="center">
            <ThemedText variant="h2" color="white">
              0
            </ThemedText>
            <ThemedText variant="body" color="white">
              Pontos
            </ThemedText>
          </ThemedView>

          <ThemedView alignItems="center">
            <ThemedText variant="h2" color="white">
              {`${
                presence && abscence
                  ? (presence / (presence + abscence)) * 100
                  : 0
              }%`}
            </ThemedText>
            <ThemedText variant="body" color="white">
              Aproveitamento
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView
          height="auto"
          flex={1}
          backgroundColor="white"
          borderTopLeftRadius={20}
          borderTopRightRadius={20}
        >
          <ThemedView alignItems="center">
            <ThemedText color="black" fontWeight="bold" mt="m">
              Histórico de Presença
            </ThemedText>
            <ThemedText color="gray" fontSize={12}>
              O histórico é exibido conforme o intervalo selecionado
            </ThemedText>
          </ThemedView>

          {isPending && (
            <ThemedView flex={1} justifyContent="center" alignItems="center">
              <ThemedText>Carregando...</ThemedText>
            </ThemedView>
          )}
          {isError && (
            <ThemedView flex={1} justifyContent="center" alignItems="center">
              <ThemedText>
                Erro ao carregar histótico de aulas: {error.message}
              </ThemedText>
            </ThemedView>
          )}
          {groupedData && (
            <SectionList
              scrollEnabled={false}
              contentContainerStyle={{
                gap: theme.spacing.xs,
                paddingHorizontal: 5,
              }}
              style={{ marginVertical: theme.spacing.s }}
              sections={groupedData.sort((a, b) => b.mounth - a.mounth)}
              renderItem={({ item }) => (
                <ThemedView
                  flexDirection="row"
                  borderRadius={20}
                  borderWidth={1}
                  borderColor="gray"
                  justifyContent="space-between"
                >
                  <ThemedView flexDirection="row" alignItems="center" gap="s">
                    <ThemedText
                      p="xs"
                      textAlign="center"
                      textAlignVertical="center"
                      style={{
                        aspectRatio: 1,
                        width: 30,
                        backgroundColor: theme.colors.lightgrey,
                        borderRadius: 50,
                      }}
                    >
                      {item.lesson.date.getDate()}
                    </ThemedText>
                    <ThemedText>{`Lição ${item.lesson.number}`}</ThemedText>
                  </ThemedView>
                  <Ionicons
                    name={item.isPresent ? "checkmark-circle" : "close-circle"}
                    size={30}
                    style={{ margin: 0 }}
                    color={item.isPresent ? "green" : "red"}
                  />
                </ThemedView>
              )}
              renderSectionHeader={({ section: { mounth } }) => (
                <ThemedView alignItems="center">
                  <ThemedText
                    px="m"
                    py="xs"
                    style={{
                      backgroundColor: theme.colors.lightgrey,
                      borderRadius: 20,
                    }}
                  >
                    {MOUNTHS[mounth - 1]}
                  </ThemedText>
                </ThemedView>
              )}
            />
          )}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}
