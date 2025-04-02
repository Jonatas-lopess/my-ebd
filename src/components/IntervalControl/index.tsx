import { ScrollView } from "react-native";
import CustomTextCard from "../CustomTextCard";
import { ThemeProps } from "@theme";
import { useTheme } from "@shopify/restyle";

export type IntervalOptionTypes =
  | "Últimas 13 aulas"
  | "2º Trimestre"
  | "1º Trimestre";

type IntervalControlProps = {
  interval: IntervalOptionTypes;
  onCardPress: (value: IntervalOptionTypes) => void;
};

export default function IntervalControl({
  interval,
  onCardPress,
}: IntervalControlProps) {
  const theme = useTheme<ThemeProps>();

  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        gap: 10,
        paddingHorizontal: theme.spacing.s,
      }}
    >
      <CustomTextCard
        text="Últimas 13 aulas"
        height={theme.spacing.xl}
        isActive={interval === "Últimas 13 aulas"}
        onPress={() => onCardPress("Últimas 13 aulas")}
      />
      <CustomTextCard
        text="2º Trimestre"
        height={theme.spacing.xl}
        isActive={interval === "2º Trimestre"}
        onPress={() => onCardPress("2º Trimestre")}
      />
      <CustomTextCard
        text="1º Trimestre"
        height={theme.spacing.xl}
        isActive={interval === "1º Trimestre"}
        onPress={() => onCardPress("1º Trimestre")}
      />
    </ScrollView>
  );
}
