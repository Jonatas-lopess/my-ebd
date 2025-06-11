import { Ionicons } from "@expo/vector-icons";
import TextButton from "@components/TextButton";
import ThemedText from "@components/ThemedText";
import ThemedView from "@components/ThemedView";
import FakeCurrencyInput from "react-native-currency-input";
import { useRef } from "react";

type DefaultProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
};

type BooleanScoreProps = DefaultProps & {
  type: "BooleanScore";
  onClick: () => void;
  onChange?: never;
  value: boolean;
};

type NumberScoreProps = DefaultProps & {
  type: "NumberScore";
  onChange: (value: number | null) => void;
  onClick?: never;
  value: number;
};

type ScoreOptionProps = BooleanScoreProps | NumberScoreProps;

export default function ScoreOption({
  type,
  onClick,
  onChange,
  icon,
  title,
  value,
}: ScoreOptionProps) {
  const inputRef = useRef<FakeCurrencyInput>(null);

  return (
    <TextButton
      justifyContent="space-between"
      variant="outline"
      {...(type === "BooleanScore"
        ? {
            onClick: onClick,
          }
        : {
            onClick: () => inputRef.current?.focus(),
          })}
    >
      <ThemedView flexDirection="row" alignItems="center">
        <Ionicons name={icon} size={25} style={{ margin: 0 }} />
        <ThemedText fontSize={16} fontWeight="bold" ml="s">
          {title}
        </ThemedText>
      </ThemedView>

      {type === "BooleanScore" && (
        <Ionicons
          name={value ? "checkmark-circle" : "close-circle"}
          size={28}
          style={{ margin: 0, padding: 0 }}
          color={value ? "green" : "red"}
        />
      )}

      {type === "NumberScore" && (
        <FakeCurrencyInput
          ref={inputRef}
          value={value}
          placeholder="R$0,00"
          prefix="R$"
          delimiter="."
          separator=","
          precision={2}
          minValue={0}
          onChangeValue={onChange}
          style={{
            textAlignVertical: "center",
            padding: 0,
            margin: 0,
            fontWeight: "bold",
            fontSize: 20,
          }}
        />
      )}
    </TextButton>
  );
}
