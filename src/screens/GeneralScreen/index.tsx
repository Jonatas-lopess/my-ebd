import { Ionicons } from "@expo/vector-icons";
import ThemedView from "../../components/ThemedView";
import ThemedText from "../../components/ThemedText";
import { useTheme } from "@shopify/restyle";
import { ThemeProps } from "../../theme";
import { FlatList, ScrollView, SectionList } from "react-native";
import CustomTextCard from "../../components/CustomTextCard";
import ChartCard from "../../components/ChartCard";
import SwitchSelector from "react-native-switch-selector";
import FocusAwareStatusBar from "../../components/FocusAwareStatusBar";
import { useCallback, useState } from "react";
import IntervalControl, {
  IntervalOptionTypes,
} from "../../components/IntervalControl";
import { DrawerActions, useNavigation } from "@react-navigation/native";

export default function GeneralScreen() {
  const theme = useTheme<ThemeProps>();
  const navigation = useNavigation();

  const [selectedList, setSelectedList] = useState("alunos");
  const [interval, setInterval] =
    useState<IntervalOptionTypes>("Últimas 13 aulas");

  const DATA_STUDENTS = [
    {
      title: "Classe Homens",
      data: [
        { nome: "Josue", pontos: 12 },
        { nome: "Carlos", pontos: 10 },
      ],
    },
    {
      title: "Classe Jovem",
      data: [
        { nome: "Amanda", pontos: 14 },
        { nome: "Henrique", pontos: 14 },
        { nome: "João", pontos: 11 },
      ],
    },
  ];

  const DATA_TEACHERS = [
    { nome: "Marta", pontos: 12 },
    { nome: "Zé", pontos: 10 },
    { nome: "Amalia", pontos: 14 },
    { nome: "Ronaldo", pontos: 14 },
    { nome: "Diego", pontos: 11 },
  ];

  const handleCardPress = useCallback((newInterval: IntervalOptionTypes) => {
    setInterval(newInterval);
  }, []);

  return (
    <ThemedView flex={1} backgroundColor="secondary">
      <FocusAwareStatusBar style="light" translucent />

      <ThemedView paddingTop="safeArea">
        <ScrollView nestedScrollEnabled>
          <ThemedView flexDirection="row" mx="s" mt="s" alignItems="center">
            <ThemedView flex={1} alignItems="center" pl="l">
              <ThemedText color="gray" variant="body" fontWeight="bold">
                Minha EBD
              </ThemedText>
            </ThemedView>
            <Ionicons.Button
              name="menu"
              color={theme.colors.gray}
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              size={25}
              backgroundColor="transparent"
              underlayColor="transparent"
              style={{ padding: 0 }}
              iconStyle={{ marginRight: 0 }}
            />
          </ThemedView>

          <ThemedView flexDirection="column" alignItems="center" mt="m">
            <ThemedText variant="h1" color="white">
              Escola Bíblica
            </ThemedText>
            <ThemedText variant="body" color="white">
              Vila Mury
            </ThemedText>
          </ThemedView>

          <ThemedView mt="m">
            <IntervalControl
              interval={interval}
              onCardPress={handleCardPress}
            />
          </ThemedView>

          <ThemedView
            flexDirection="row"
            mt="xxxl"
            justifyContent="space-around"
          >
            <CustomTextCard text="Matriculados: 22" height={34} />
            <CustomTextCard text="Média no Intervalo: 76%" height={34} />
          </ThemedView>

          <ThemedView
            mt="s"
            height="auto"
            backgroundColor="white"
            borderTopLeftRadius={20}
            borderTopRightRadius={20}
          >
            <ThemedView alignItems="center">
              <ThemedText color="black" fontWeight="bold" mt="m">
                Ranking de Turmas
              </ThemedText>
              <ThemedText color="gray" fontSize={12}>
                O ranking é baseado no intervalo selecionado.
              </ThemedText>
            </ThemedView>

            <ScrollView
              horizontal={true}
              style={{ marginTop: 20 }}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 10, paddingHorizontal: 10 }}
            >
              <ChartCard title="1º Ano A" value={80} />
              <ChartCard title="1º Ano B" value={76} />
              <ChartCard title="1º Ano C" value={49} />
            </ScrollView>

            <ThemedView alignItems="center">
              <ThemedText color="black" fontWeight="bold" mt="m">
                Ranking de Presença
              </ThemedText>
              <ThemedText color="gray" fontSize={12}>
                A frequência é baseada no intervalo selecionado.
              </ThemedText>
            </ThemedView>

            <SwitchSelector
              options={[
                { label: "Alunos", value: "alunos" },
                { label: "Professores", value: "professores" },
              ]}
              onPress={(value: string) => setSelectedList(value)}
              initial={0}
              textColor={theme.colors.gray}
              selectedColor={theme.colors.white}
              buttonColor={theme.colors.gray}
              style={{ marginVertical: 10, marginHorizontal: 5 }}
            />

            {selectedList === "alunos" ? (
              <SectionList
                sections={DATA_STUDENTS}
                scrollEnabled={false}
                contentContainerStyle={{ gap: theme.spacing.s }}
                style={{ marginHorizontal: 10 }}
                renderItem={({ item }) => (
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
                )}
                renderSectionHeader={({ section: { title } }) => (
                  <ThemedText>{title}</ThemedText>
                )}
              />
            ) : (
              <FlatList
                data={DATA_TEACHERS}
                scrollEnabled={false}
                contentContainerStyle={{
                  gap: theme.spacing.s,
                  marginVertical: theme.spacing.s,
                  marginHorizontal: theme.spacing.s,
                }}
                renderItem={({ item }) => (
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
                )}
              />
            )}
          </ThemedView>
        </ScrollView>
      </ThemedView>
    </ThemedView>
  );
}
