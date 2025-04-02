import { TouchableOpacity } from "react-native";
import ThemedText from "@components/ThemedText";
import ThemedView from "@components/ThemedView";

type CustomBottomModalActionProps = {
  onPress: () => void;
};

export default function CustomBottomModalAction({
  onPress,
}: CustomBottomModalActionProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <ThemedView
        backgroundColor="secondary"
        py="xs"
        px="s"
        mb="m"
        mx="s"
        borderRadius={25}
      >
        <ThemedText
          fontSize={18}
          fontWeight="bold"
          textAlign="center"
          style={{ color: "#fff" }}
          textTransform="uppercase"
        >
          Criar
        </ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );
}
