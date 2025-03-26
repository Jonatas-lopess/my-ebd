import ThemedView from "../ThemedView";

type SettingsOptionsGroupProps = {
  children: React.ReactNode;
};

export default function SettingsOptionsGroup({
  children,
}: SettingsOptionsGroupProps) {
  return (
    <ThemedView style={{ backgroundColor: "white" }}>{children}</ThemedView>
  );
}
