import ThemedText from "@components/ThemedText";
import ThemedView from "@components/ThemedView";
import { TouchableOpacity } from "react-native";

type CustomCarddPressableProps = {
  text: string;
  onPress: () => void;
};

export default function CustomCardPressable({
  text,
  onPress,
}: CustomCarddPressableProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <ThemedView
        py="xs"
        px="m"
        mt="s"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        borderRadius={25}
        borderWidth={1}
        borderColor="lightgrey"
      >
        <ThemedText fontSize={16}>{text}</ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );
}
