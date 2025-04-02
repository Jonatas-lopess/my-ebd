import { TouchableOpacity } from "react-native";
import CustomIcon, { NamePropType } from "../CustomIcon";
import ThemedText from "@components/ThemedText";
import ThemedView from "@components/ThemedView";

type SettingsOptionsCardProps = {
  icon: NamePropType;
  title: string;
  onPress?: () => void;
};

export default function SettingsOptionsCard({
  icon,
  title,
  onPress,
}: SettingsOptionsCardProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <ThemedView
        padding="m"
        borderBottomWidth={1}
        borderBottomColor="lightgrey"
        borderBottomStartRadius={100}
        borderBottomEndRadius={30}
        flexDirection="row"
        gap="l"
      >
        <CustomIcon name={icon} size={20} color="black" />
        <ThemedText fontSize={16}>{title}</ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );
}
