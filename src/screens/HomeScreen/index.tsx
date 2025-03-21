import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";

export default function HomeScreen() {
  return (
    <ThemedView flex={1} style={{ backgroundColor: "white" }}>
      <ThemedText>Home</ThemedText>
    </ThemedView>
  );
}
