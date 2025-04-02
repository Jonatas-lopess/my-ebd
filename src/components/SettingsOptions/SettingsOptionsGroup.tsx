import ThemedView from "@components/ThemedView";

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
