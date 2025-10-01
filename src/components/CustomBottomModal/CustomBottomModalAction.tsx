import { TouchableOpacity } from "react-native";
import ThemedText from "@components/ThemedText";
import ThemedView from "@components/ThemedView";

type CustomBottomModalActionProps = {
  text?: string;
  onPress: () => void;
};

export default function CustomBottomModalAction({
  text = "Criar",
  onPress,
}: CustomBottomModalActionProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <ThemedView
        backgroundColor="secondary"
        py="xs"
        px="s"
        mb="m"
        borderRadius={25}
      >
        <ThemedText
          fontSize={18}
          fontWeight="bold"
          textAlign="center"
          style={{ color: "#fff" }}
          textTransform="uppercase"
        >
          {text}
        </ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );
}
