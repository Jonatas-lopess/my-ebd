import { useNavigation } from "@react-navigation/native";
import FocusAwareStatusBar from "../../../components/FocusAwareStatusBar";
import { StackHeader } from "../../../components/StackHeader";
import ThemedView from "../../../components/ThemedView";
import ThemedText from "../../../components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import SettingsOptionsCard from "../../../components/SettingsOptions/SettingsOptionsCard";
import { SettingsOptions } from "../../../components/SettingsOptions";

export default function SettingsScreen() {
  const navigation = useNavigation();

  return (
    <ThemedView flex={1} style={{ backgroundColor: "white" }}>
      <FocusAwareStatusBar style="dark" translucent />

      <StackHeader.Root>
        <StackHeader.Content>
          <StackHeader.Action
            name="arrow-back"
            onPress={() => navigation.goBack()}
          />
          <StackHeader.Title>Configurações</StackHeader.Title>
        </StackHeader.Content>
        <StackHeader.Action name="menu" onPress={() => {}} />
      </StackHeader.Root>

      <ThemedView flex={1} py="s" backgroundColor="lightgrey">
        <SettingsOptions.Group>
          <SettingsOptions.Card title="Conta" icon="person-outline" />
          <SettingsOptions.Card
            title="Notificações"
            icon="notifications-outline"
          />
          <SettingsOptions.Card title="Pontuação" icon="trophy-outline" />
        </SettingsOptions.Group>
      </ThemedView>
    </ThemedView>
  );
}
