import { Ionicons } from "@expo/vector-icons";
import ThemedView from "../../components/ThemedView";
import ThemedText from "../../components/ThemedText";
import { useTheme } from "@shopify/restyle";
import { ThemeProps } from "../../theme";
import { ScrollView } from "react-native";
import CustomCard from "../../components/CustomCard";

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
            contentContainerStyle={{ gap: 10, paddingHorizontal: 10 }}
          >
            <CustomCard
              text="Últimas 13 aulas"
              height={theme.spacing.xl}
              active
            />
            <CustomCard
              text="2º Trimestre"
              height={theme.spacing.xl}
              onPress={() => alert("oi")}
            />
            <CustomCard text="1º Trimestre" height={theme.spacing.xl} />
          </ScrollView>

          <ThemedView flexDirection="row" mt="xl" justifyContent="space-around">
            <CustomCard text="Matriculados: 22" height={34} active={false} />
            <CustomCard
              text="Média no Intervalo: 76%"
              height={34}
              active={false}
            />
          </ThemedView>

          <ThemedView
            mt="s"
            height="auto"
            backgroundColor="white"
            borderTopLeftRadius={20}
            borderTopRightRadius={20}
          >
            <ThemedView height={450} />
          </ThemedView>
        </ScrollView>
      </ThemedView>
    </ThemedView>
  );
}
