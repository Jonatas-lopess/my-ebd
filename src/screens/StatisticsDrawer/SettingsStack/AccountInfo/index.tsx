import { useNavigation } from "@react-navigation/native";
import ThemedView from "@components/ThemedView";
import { StackHeader } from "@components/StackHeader";
import { useAuth } from "@providers/AuthProvider";
import { CustomCard } from "@components/CustomCard";
import CustomIcon from "@components/CustomIcon";
import ThemedText from "@components/ThemedText";
import { Alert, TouchableOpacity } from "react-native";

export default function AccountInfo() {
  const navigation = useNavigation();
  const { user } = useAuth().authState;

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

        <CustomCard.Root>
          <CustomCard.Title>Recuperação de Senha</CustomCard.Title>
          <CustomCard.Detail>
            Token de recuperação necessário em caso de perda da senha. Clique no
            campo para copiá-lo.
          </CustomCard.Detail>
          <CustomCard.Pressable text={""} onPress={() => {}} />
        </CustomCard.Root>

        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              "Tem certeza?",
              "Essa ação é irreversível.",
              [{ text: "Cancelar" }, { text: "Excluir", onPress: () => {} }],
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
