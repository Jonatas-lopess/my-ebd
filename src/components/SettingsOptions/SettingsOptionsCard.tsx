import { TouchableOpacity } from "react-native";
import CustomIcon, { NamePropType } from "../CustomIcon";
import ThemedText from "@components/ThemedText";
import ThemedView from "@components/ThemedView";

type SettingsOptionsCardProps = {
  icon: NamePropType;
  title: string;
  onPress?: () => void;
  disableSeparator?: boolean;
};

export default function SettingsOptionsCard({
  icon,
  title,
  onPress,
  disableSeparator = false,
}: SettingsOptionsCardProps) {
  const borderStyle = {
    borderBottomWidth: 1,
    borderBottomStartRadius: 100,
    borderBottomEndRadius: 30,
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <ThemedView
        padding="m"
        {...(disableSeparator ? {} : borderStyle)}
        borderBottomColor="lightgrey"
        flexDirection="row"
        gap="l"
      >
        <CustomIcon name={icon} size={20} color="black" />
        <ThemedText fontSize={16}>{title}</ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );
}
