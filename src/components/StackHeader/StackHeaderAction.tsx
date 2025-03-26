import { OpaqueColorValue } from "react-native";
import CustomIcon, { NamePropType } from "../CustomIcon";

type StackHeaderActionProps = {
  onPress: () => void;
  name: NamePropType;
  color?: string | OpaqueColorValue;
};

export default function StackHeaderAction({
  onPress,
  color,
  name,
}: StackHeaderActionProps) {
  return (
    <CustomIcon
      name={name}
      color={color}
      onPress={onPress}
      size={25}
      style={{ backgroundColor: "transparent" }}
    />
  );
}
