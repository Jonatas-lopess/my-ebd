import { Ionicons } from "@expo/vector-icons";
import ThemedView from "../../components/ThemedView";
import ThemedText from "../../components/ThemedText";
import { useTheme } from "@shopify/restyle";
import { ThemeProps } from "../../theme";
import { ScrollView, SectionList } from "react-native";
import CustomTextCard from "../../components/CustomTextCard";
import ChartCard from "../../components/ChartCard";
import SwitchSelector from "react-native-switch-selector";
import FocusAwareStatusBar from "../../components/FocusAwareStatusBar";

export default function HomeScreen() {
  const theme = useTheme<ThemeProps>();
  const iconSize = theme.spacing.l;

  const DATA = [
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

  return (
    <ThemedView flex={1} backgroundColor="secondary">
      <FocusAwareStatusBar style="light" translucent />

      <ThemedView paddingTop="safeArea">
        <ScrollView nestedScrollEnabled>
          <ThemedView flexDirection="row" mx="s" mt="s">
            <ThemedView flex={1} alignItems="center" pl="l">
              <ThemedText color="gray" variant="body" fontWeight="bold">
                Minha EBD
              </ThemedText>
            </ThemedView>
            <Ionicons name="menu" size={iconSize} color="white" />
          </ThemedView>

          <ThemedView flexDirection="column" alignItems="center" mt="m">
            <ThemedText variant="header" color="white">
              Escola Bíblica
            </ThemedText>
            <ThemedText variant="body" color="white">
              Vila Mury
            </ThemedText>
          </ThemedView>

          <ScrollView
            horizontal={true}
            style={{ marginTop: 20 }}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10, paddingHorizontal: 10 }}
          >
            <CustomTextCard
              text="Últimas 13 aulas"
              height={theme.spacing.xl}
              isActive
            />
            <CustomTextCard
              text="2º Trimestre"
              height={theme.spacing.xl}
              onPress={() => alert("oi")}
            />
            <CustomTextCard text="1º Trimestre" height={theme.spacing.xl} />
          </ScrollView>

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
              <SwitchSelector
                options={[
                  { label: "Alunos", value: "alunos" },
                  { label: "Professores", value: "professores" },
                ]}
                initial={0}
                textColor={theme.colors.gray}
                selectedColor={theme.colors.black}
                buttonColor={theme.colors.gray}
                style={{ marginVertical: 10, marginHorizontal: 5 }}
              />
              <SectionList
                sections={DATA}
                scrollEnabled={false}
                style={{ width: "90%", marginBottom: 10 }}
                renderItem={({ item, index, section }) => (
                  <ThemedView
                    p="s"
                    style={[
                      {
                        backgroundColor: "#ddd",
                        borderBottomColor: theme.colors.black,
                        borderBottomWidth: 1,
                        flexDirection: "row",
                        justifyContent: "space-between",
                      },
                      index === 0 && {
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                      },
                      index === section.data.length - 1 && {
                        borderBottomWidth: 0,
                        borderBottomLeftRadius: 10,
                        borderBottomRightRadius: 10,
                      },
                    ]}
                  >
                    <ThemedText>{item.nome}</ThemedText>
                    <ThemedText>{item.pontos}</ThemedText>
                  </ThemedView>
                )}
                renderSectionHeader={({ section: { title } }) => (
                  <ThemedText my="s">{title}</ThemedText>
                )}
              />
            </ThemedView>
          </ThemedView>
        </ScrollView>
      </ThemedView>
    </ThemedView>
  );
}
