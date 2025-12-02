import ThemedText from "@components/ThemedText";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

type Props = {
  initialDate?: Date;
  onSelectDate: (date: Date | undefined) => void;
};

export default function IntervalCustomControlInitial({
  initialDate,
  onSelectDate,
}: Props) {
  const today = new Date();

  return (
    <ThemedText
      fontSize={16}
      fontWeight="600"
      onPress={() =>
        DateTimePickerAndroid.open({
          value: initialDate ?? today,
          maximumDate: today,
          onChange: (_, date) => onSelectDate(date),
        })
      }
    >
      {initialDate
        ? initialDate.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "Selecione início"}
    </ThemedText>
  );
}
