import FocusAwareStatusBar from "../../../components/FocusAwareStatusBar";
import ThemedView from "../../../components/ThemedView";
import { StudentStackScreenProps } from "../../../types/navigation";

export default function HistoryScreen({
  route,
}: StudentStackScreenProps<"Alunos_Historico">) {
  const { studentId } = route.params;

  return (
    <ThemedView flex={1} backgroundColor="secondary">
      <FocusAwareStatusBar style="dark" />
    </ThemedView>
  );
}
