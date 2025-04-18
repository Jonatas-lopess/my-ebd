import { DimensionValue, Pressable } from "react-native";
import ThemedText from "@components/ThemedText";
import ThemedView from "@components/ThemedView";

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
    <Pressable onPress={onPress}>
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
    </Pressable>
  );
}
