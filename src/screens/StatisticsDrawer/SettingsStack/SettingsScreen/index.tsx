import { DrawerActions, useNavigation } from "@react-navigation/native";
import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import { StackHeader } from "@components/StackHeader";
import ThemedView from "@components/ThemedView";
import { SettingsOptions } from "@components/SettingsOptions";

export default function SettingsScreen() {
  const navigation = useNavigation();

  return (
    <ThemedView flex={1} style={{ backgroundColor: "white" }}>
      <FocusAwareStatusBar style="dark" translucent />

      <StackHeader.Root>
        <StackHeader.Title>Configurações</StackHeader.Title>
        <StackHeader.Action
          name="menu"
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        />
      </StackHeader.Root>

      <ThemedView flex={1} py="s" gap="s" backgroundColor="lightgrey">
        <SettingsOptions.Group>
          <SettingsOptions.Card title="Pontuação" icon="trophy-outline" />
          <SettingsOptions.Card
            title="Notificações"
            icon="notifications-outline"
          />
        </SettingsOptions.Group>

        <SettingsOptions.Group>
          <SettingsOptions.Card title="Dados da Igreja" icon="flag-outline" />
          <SettingsOptions.Card
            title="Dados da Conta"
            icon="person-outline"
            onPress={() =>
              navigation.navigate("Geral", {
                screen: "Settings",
                params: { screen: "SettingsAccountInfo" },
              })
            }
          />
          <SettingsOptions.Card
            title="Acesso Administrativo"
            icon="key-outline"
          />
          <SettingsOptions.Card
            title="Acesso aos Professores"
            icon="school-outline"
          />
        </SettingsOptions.Group>

        <SettingsOptions.Group>
          <SettingsOptions.Card
            title="Gerenciamento de sede"
            icon="home-outline"
          />
          <SettingsOptions.Card title="Filiais" icon="business-outline" />
        </SettingsOptions.Group>
      </ThemedView>
    </ThemedView>
  );
}
