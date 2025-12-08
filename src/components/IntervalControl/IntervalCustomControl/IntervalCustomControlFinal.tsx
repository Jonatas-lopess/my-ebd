import ThemedText from "@components/ThemedText";
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useTheme } from "@shopify/restyle";
import { ThemeProps } from "@theme";

type Props = {
  initialDate?: Date;
  finalDate?: Date;
  onSelectDate: (date: Date | undefined) => void;
};

export default function IntervalCustomControlFinal({
  initialDate,
  finalDate,
  onSelectDate,
}: Props) {
  const theme = useTheme<ThemeProps>();
  const today = new Date();

  function handleOnChange(event: DateTimePickerEvent, date?: Date) {
    if (event.type === "set") {
      onSelectDate(date);
    }
  }

  return (
    <ThemedText
      style={{
        borderWidth: 1,
        borderColor: theme.colors.lightgrey,
        padding: theme.spacing.s,
        borderRadius: 25,
      }}
      onPress={() =>
        DateTimePickerAndroid.open({
          value: finalDate ?? today,
          minimumDate: initialDate,
          maximumDate: today,
          onChange: handleOnChange,
        })
      }
    >
      {finalDate
        ? finalDate.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "Selecione Fim"}
    </ThemedText>
  );
}
