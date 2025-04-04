import ThemedView from "@components/ThemedView";
import ThemedText from "@components/ThemedText";
import { Ionicons } from "@expo/vector-icons";

type NumberPickProps = {
  value: number;
  onChange: (value: number | null) => void;
  maxValue?: number;
  minValue?: number;
  isLocked?: boolean;
};

export default function NumberPick({
  value,
  onChange,
  maxValue,
  minValue,
  isLocked,
}: NumberPickProps) {
  return (
    <ThemedView flexDirection="row" gap="m">
      {!isLocked && (
        <Ionicons
          name="arrow-up"
          size={25}
          style={{ margin: 0 }}
          onPress={() => onChange(value + 1)}
          disabled={value === maxValue}
          color={value === maxValue ? "lightgrey" : "black"}
        />
      )}

      <ThemedText variant="h3">{value}</ThemedText>

      {!isLocked && (
        <Ionicons
          name="arrow-down"
          size={25}
          style={{ margin: 0 }}
          onPress={() => onChange(value - 1)}
          disabled={value === minValue}
          color={value === minValue ? "lightgrey" : "black"}
        />
      )}
    </ThemedView>
  );
}
