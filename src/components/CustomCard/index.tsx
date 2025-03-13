import { DimensionValue, TouchableWithoutFeedback } from "react-native";
import ThemedText from "../ThemedText";
import ThemedView from "../ThemedView";

type CustomCardProps = {
  text: string;
  height?: DimensionValue;
  active?: boolean;
  onPress?: () => void;
};

export default function CustomCard({
  text,
  active,
  height,
  onPress,
}: CustomCardProps) {
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (active != true) onPress;
      }}
    >
      <ThemedView
        borderRadius={18}
        backgroundColor={active ? "white" : "primary"}
        paddingVertical="s"
        paddingHorizontal="m"
        height={height}
        alignItems="center"
        justifyContent="center"
      >
        <ThemedText color={active ? "lightBlue" : "white"}>{text}</ThemedText>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
}
