import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { IconProps } from "@expo/vector-icons/build/createIconSet";

export type NamePropType =
  | keyof typeof Ionicons.glyphMap
  | keyof typeof FontAwesome.glyphMap;

type CustomIconProps = Omit<IconProps<"">, "name"> & {
  name: NamePropType;
};

export default function CustomIcon({
  name,
  color,
  onPress,
  ...props
}: CustomIconProps) {
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
      style={{ padding: 0, margin: 0 }}
      {...props}
    />
  ) : (
    <FontAwesome
      name={name as keyof typeof FontAwesome.glyphMap}
      color={color}
      onPress={onPress}
      style={{ padding: 0, margin: 0 }}
      {...props}
    />
  );
}
