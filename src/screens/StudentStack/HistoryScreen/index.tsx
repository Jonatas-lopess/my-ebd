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

export default function HistoryScreen({
  route,
}: StudentStackProps<"Alunos_Historico">) {
  const { studentId } = route.params;
  const navigation = useNavigation();
  const theme = useTheme<ThemeProps>();
  const [interval, setInterval] =
    useState<IntervalOptionTypes>("Últimas 13 aulas");

  const DATA_HISTORY = [
    {
      mounth: 3,
      data: [
        { date: 25, lesson: 4, isPresent: true },
        { date: 11, lesson: 3, isPresent: false },
      ],
    },
    {
      mounth: 2,
      data: [
        { date: 25, lesson: 4, isPresent: true },
        { date: 11, lesson: 3, isPresent: false },
      ],
    },
    {
      mounth: 1,
      data: [
        { date: 14, lesson: 2, isPresent: false },
        { date: 7, lesson: 1, isPresent: true },
      ],
    },
  ];

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

  const PRESENCE = DATA_HISTORY.reduce(
    (acc, item) =>
      acc + item.data.reduce((acc, item) => acc + (item.isPresent ? 1 : 0), 0),
    0
  );

  const ABSCENCE = DATA_HISTORY.reduce(
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
            João
          </ThemedText>
          <ThemedText variant="body" color="white">
            Classe Jovem
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
              {PRESENCE}
            </ThemedText>
            <ThemedText variant="body" color="white">
              Presenças
            </ThemedText>
          </ThemedView>

          <ThemedView alignItems="center">
            <ThemedText variant="h2" color="white">
              {ABSCENCE}
            </ThemedText>
            <ThemedText variant="body" color="white">
              Ausências
            </ThemedText>
          </ThemedView>

          <ThemedView alignItems="center">
            <ThemedText variant="h2" color="white">
              22
            </ThemedText>
            <ThemedText variant="body" color="white">
              Pontos
            </ThemedText>
          </ThemedView>

          <ThemedView alignItems="center">
            <ThemedText variant="h2" color="white">
              {`${(PRESENCE / (PRESENCE + ABSCENCE)) * 100}%`}
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

          <SectionList
            scrollEnabled={false}
            contentContainerStyle={{
              gap: theme.spacing.xs,
              paddingHorizontal: 5,
            }}
            style={{ marginVertical: theme.spacing.s }}
            sections={DATA_HISTORY}
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
                    {item.date}
                  </ThemedText>
                  <ThemedText>{`Lição ${item.lesson}`}</ThemedText>
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
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}
