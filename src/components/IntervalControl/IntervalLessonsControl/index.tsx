import { TextInput } from "react-native";
import { IntervalLessonsObj } from "..";
import { useTheme } from "@shopify/restyle";
import { ThemeProps } from "@theme";

type Props = {
  interval: IntervalLessonsObj | null;
  onSelect: ((interval: IntervalLessonsObj) => void) | undefined;
};

export default function IntervalLessonsControl({ interval, onSelect }: Props) {
  const theme = useTheme<ThemeProps>();

  return (
    <TextInput
      placeholder="Qnt."
      placeholderTextColor="#a0a0a0"
      value={interval ? interval.lessonsCount.toString() : ""}
      keyboardType="numeric"
      onChangeText={(text) => {
        if (onSelect) onSelect({ lessonsCount: Number(text) });
      }}
      style={{
        borderWidth: 1,
        borderColor: theme.colors.lightgrey,
        borderRadius: 25,
        padding: theme.spacing.s,
      }}
    />
  );
}
