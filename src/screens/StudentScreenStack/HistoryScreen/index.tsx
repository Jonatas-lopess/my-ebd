import { useNavigation } from "@react-navigation/native";
import FocusAwareStatusBar from "../../../components/FocusAwareStatusBar";
import ThemedText from "../../../components/ThemedText";
import ThemedView from "../../../components/ThemedView";
import { StudentStackScreenProps } from "../../../types/navigation";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native";
import CustomTextCard from "../../../components/CustomTextCard";
import { ThemeProps } from "../../../theme";
import { useTheme } from "@shopify/restyle";

export default function HistoryScreen({
  route,
}: StudentStackScreenProps<"Alunos_Historico">) {
  const { studentId } = route.params;
  const navigation = useNavigation();
  const theme = useTheme<ThemeProps>();

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

      <ScrollView nestedScrollEnabled>
        <ThemedView flexDirection="column" alignItems="center" mt="m">
          <ThemedText variant="header" color="white">
            João
          </ThemedText>
          <ThemedText variant="body" color="white">
            Classe Jovem
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
          mt="s"
          height="auto"
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

          <ThemedView height={100}></ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}
