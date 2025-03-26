import CustomIcon, { NamePropType } from "../CustomIcon";
import ThemedText from "../ThemedText";
import ThemedView from "../ThemedView";

type SettingsOptionsCardProps = {
  icon: NamePropType;
  title: string;
};

export default function SettingsOptionsCard({
  icon,
  title,
}: SettingsOptionsCardProps) {
  return (
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
  );
}
