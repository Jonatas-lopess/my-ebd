import ThemedView from "@components/ThemedView";
import { TouchableOpacity } from "react-native";

type InfoCardRootProps = {
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
};

export default function InfoCardRoot({
  children,
  onPress,
  onLongPress,
}: InfoCardRootProps) {
  return (
    <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
      <ThemedView
        style={{ backgroundColor: "white" }}
        borderRadius={10}
        py="s"
        px="m"
      >
        {children}
      </ThemedView>
    </TouchableOpacity>
  );
}
