import { CircularProgress } from "react-native-circular-progress";
import ThemedText from "../ThemedText";
import { useTheme } from "@shopify/restyle";
import { ThemeProps } from "../../theme";
import ThemedView from "../ThemedView";

type ChartCardProps = {
  title: string;
  value: number;
};

export default function ChartCard({ title, value }: ChartCardProps) {
  const theme = useTheme<ThemeProps>();

  return (
    <ThemedView
      alignItems="center"
      alignSelf="baseline"
      py="s"
      px="m"
      borderWidth={1}
      borderColor="gray"
      borderRadius={10}
    >
      <ThemedText variant="body" color="black">
        {title}
      </ThemedText>
      <CircularProgress
        size={80}
        width={15}
        fill={value}
        rotation={0}
        tintColor={theme.colors.secondary}
        backgroundColor="lightgrey"
      >
        {() => <ThemedText>{`${value}%`}</ThemedText>}
      </CircularProgress>
    </ThemedView>
  );
}
