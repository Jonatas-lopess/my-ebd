import { DimensionValue, TouchableWithoutFeedback } from "react-native";
import ThemedText from "../ThemedText";
import ThemedView from "../ThemedView";

type CustomTextCardProps = {
  text: string;
  height?: DimensionValue;
  isActive?: boolean;
  onPress?: () => void;
};

export default function CustomTextCard({
  text,
  isActive = false,
  height,
  onPress,
}: CustomTextCardProps) {
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (isActive != true) onPress;
      }}
    >
      <ThemedView
        borderRadius={18}
        backgroundColor={isActive ? "white" : "primary"}
        paddingVertical="s"
        paddingHorizontal="m"
        height={height}
        alignItems="center"
        justifyContent="center"
      >
        <ThemedText color={isActive ? "lightBlue" : "white"}>{text}</ThemedText>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
}
