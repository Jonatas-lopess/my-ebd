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

      <ThemedView flex={1} py="s" gap="s" backgroundColor="white">
        <SettingsOptions.Group>
          <SettingsOptions.Card title="Pontuação" icon="trophy-outline" />
          <SettingsOptions.Card
            title="Notificações"
            icon="notifications-outline"
            disableSeparator
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
                params: { screen: "AccountInfo" },
              })
            }
          />
          <SettingsOptions.Card
            title="Acesso Administrativo"
            icon="key-outline"
            onPress={() =>
              navigation.navigate("Geral", {
                screen: "Settings",
                params: { screen: "AdminAccess" },
              })
            }
          />
          <SettingsOptions.Card
            title="Acesso aos Professores"
            icon="school-outline"
            onPress={() =>
              navigation.navigate("Geral", {
                screen: "Settings",
                params: { screen: "TeacherAccess" },
              })
            }
            disableSeparator
          />
        </SettingsOptions.Group>

        <SettingsOptions.Group>
          <SettingsOptions.Card
            title="Gerenciamento de sede"
            icon="home-outline"
            onPress={() =>
              navigation.navigate("Geral", {
                screen: "Settings",
                params: { screen: "ManageBranch" },
              })
            }
          />
          <SettingsOptions.Card
            title="Filiais"
            icon="business-outline"
            onPress={() =>
              navigation.navigate("Geral", {
                screen: "Settings",
                params: { screen: "ManageHeadquarter" },
              })
            }
            disableSeparator
          />
        </SettingsOptions.Group>
      </ThemedView>
    </ThemedView>
  );
}
