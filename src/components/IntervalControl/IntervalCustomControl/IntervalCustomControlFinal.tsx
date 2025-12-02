import ThemedText from "@components/ThemedText";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

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
  const today = new Date();

  return (
    <ThemedText
      fontSize={16}
      fontWeight="600"
      onPress={() =>
        DateTimePickerAndroid.open({
          value: finalDate ?? today,
          minimumDate: initialDate,
          maximumDate: today,
          onChange: (_, date) => onSelectDate(date),
        })
      }
    >
      {finalDate
        ? finalDate.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "Selecione fim"}
    </ThemedText>
  );
}
