import { Ionicons } from "@expo/vector-icons";
import ThemedView from "../../components/ThemedView";
import ThemedText from "../../components/ThemedText";
import { useTheme } from "@shopify/restyle";
import { ThemeProps } from "../../theme";
import { ScrollView } from "react-native";
import CustomTextCard from "../../components/CustomTextCard";
import { CircularProgress } from "react-native-circular-progress";
import ChartCard from "../../components/ChartCard";

export default function HomeScreen() {
  const theme = useTheme<ThemeProps>();
  const iconSize = theme.spacing.l;

  return (
    <ThemedView flex={1} backgroundColor="secondary">
      <ThemedView paddingTop="safeArea">
        <ScrollView>
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
            </ThemedView>
          </ThemedView>
        </ScrollView>
      </ThemedView>
    </ThemedView>
  );
}
