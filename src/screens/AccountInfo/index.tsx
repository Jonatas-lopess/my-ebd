import { useNavigation } from "@react-navigation/native";
import ThemedView from "@components/ThemedView";
import { StackHeader } from "@components/StackHeader";
import { useAuth } from "@providers/AuthProvider";
import { CustomCard } from "@components/CustomCard";
import CustomIcon from "@components/CustomIcon";
import ThemedText from "@components/ThemedText";
import { Alert, TouchableOpacity } from "react-native";
import AuthService from "@services/AuthService";

export default function AccountInfo() {
  const navigation = useNavigation();
  const { user, token } = useAuth().authState;
  const { onLogOut } = useAuth();

  async function handleDelete() {
    if (!token) return console.log("No token found. Cannot delete account.");

    const response = await AuthService.deleteAccount(token);

    if (response.status === 200) {
      Alert.alert("Conta excluída com sucesso.");
      onLogOut();
    } else {
      console.log("Failed to delete account:", response.data);
      Alert.alert("Erro ao excluir a conta. Tente novamente mais tarde.");
    }
  }

  return (
    <>
      <StackHeader.Root>
        <StackHeader.Content>
          <StackHeader.Action
            name="arrow-back"
            onPress={() => navigation.goBack()}
          />
          <StackHeader.Title>Dados da Conta</StackHeader.Title>
        </StackHeader.Content>
      </StackHeader.Root>

      <ThemedView flex={1} py="s" gap="s" backgroundColor="white">
        <CustomCard.Root>
          <CustomCard.Title>Nome Pessoal</CustomCard.Title>
          <CustomCard.Detail>
            Seu nome pode ser visto pelos administradores da escola.
          </CustomCard.Detail>
          <CustomCard.Pressable
            text={(user?.name || user?.register?.name) ?? ""}
            onPress={() => {}}
          />
        </CustomCard.Root>

        <CustomCard.Root>
          <CustomCard.Title>Email de Acesso</CustomCard.Title>
          <CustomCard.Detail>
            O email de acesso é usado para fazer o acesso a conta.
          </CustomCard.Detail>
          <CustomCard.Pressable text={user?.email ?? ""} onPress={() => {}} />
        </CustomCard.Root>

        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              "Tem certeza?",
              "Essa ação é irreversível.",
              [
                { text: "Cancelar" },
                { text: "Excluir", onPress: handleDelete },
              ],
              { cancelable: true }
            )
          }
        >
          <ThemedView
            flexDirection="row"
            p="m"
            gap="s"
            alignItems="center"
            style={{ backgroundColor: "white" }}
          >
            <CustomIcon name="trash" size={24} color="red" />
            <ThemedText fontSize={16} style={{ color: "red" }}>
              Excluir conta
            </ThemedText>
          </ThemedView>
        </TouchableOpacity>
      </ThemedView>
    </>
  );
}
