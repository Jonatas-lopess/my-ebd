import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { OpaqueColorValue } from "react-native";

type StackHeaderActionProps = {
  onPress: () => void;
  name: keyof typeof Ionicons.glyphMap | keyof typeof FontAwesome.glyphMap;
  color?: string | OpaqueColorValue;
};

export default function StackHeaderAction({
  onPress,
  color,
  name,
}: StackHeaderActionProps) {
  const isIncludedInIonicons = (
    checkType:
      | keyof typeof Ionicons.glyphMap
      | keyof typeof FontAwesome.glyphMap
  ) => {
    const icons = {
      ...Ionicons.glyphMap,
    };

    return Object.keys(icons).includes(checkType);
  };

  return isIncludedInIonicons(name) ? (
    <Ionicons
      name={name as keyof typeof Ionicons.glyphMap}
      color={color}
      onPress={onPress}
      size={25}
      backgroundColor="transparent"
      underlayColor="transparent"
      iconStyle={{ marginRight: 0 }}
    />
  ) : (
    <FontAwesome
      name={name as keyof typeof FontAwesome.glyphMap}
      color={color}
      onPress={onPress}
      size={22}
      backgroundColor="transparent"
      underlayColor="transparent"
      iconStyle={{ marginRight: 0 }}
    />
  );
}
