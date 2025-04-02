import FocusAwareStatusBar from "../../../components/FocusAwareStatusBar";
import ThemedView from "../../../components/ThemedView";

type SettingsStackLayoutProps = {
  children: React.ReactNode;
};

export default function SettingsStackLayout({
  children,
}: SettingsStackLayoutProps) {
  return (
    <ThemedView flex={1} style={{ backgroundColor: "white" }}>
      <FocusAwareStatusBar style="dark" translucent />

      {children}
    </ThemedView>
  );
}
