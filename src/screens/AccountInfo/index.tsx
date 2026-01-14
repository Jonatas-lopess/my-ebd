import { useNavigation } from "@react-navigation/native";
import ThemedView from "@components/ThemedView";
import { StackHeader } from "@components/StackHeader";
import { useAuth } from "@providers/AuthProvider";
import { CustomCard } from "@components/CustomCard";
import CustomIcon from "@components/CustomIcon";
import ThemedText from "@components/ThemedText";
import { Alert, TextInput, TouchableOpacity } from "react-native";
import AuthService from "@services/AuthService";
import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import Toast from "react-native-toast-message";
import {
  BottomSheetModalProvider,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { CustomBottomModal } from "@components/CustomBottomModal";
import { useTheme } from "@shopify/restyle";
import { ThemeProps } from "@theme";
import { useRef, useState } from "react";

export default function AccountInfo() {
  const navigation = useNavigation();
  const { user, token } = useAuth().authState;
  const { onLogOut } = useAuth();
  const theme = useTheme<ThemeProps>();
  const [password, setPassword] = useState<string>("");
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  async function handleDelete() {
    if (!token) return console.log("No token found. Cannot delete account.");

    const response = await AuthService.deleteAccount(token, password);

    if (response.status === 200) {
      Toast.show({
        type: "success",
        text1: "Conta excluída com sucesso.",
      });

      onLogOut();
    } else {
      console.log("Failed to delete account:", response.data);
      Alert.alert("Erro ao excluir a conta. Tente novamente mais tarde.");
    }
  }

  return (
    <BottomSheetModalProvider>
      <FocusAwareStatusBar style="light" translucent />

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
          onPress={() => bottomSheetModalRef.current?.present()}
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

      <CustomBottomModal.Root ref={bottomSheetModalRef}>
        <CustomBottomModal.Content title="">
          <ThemedView padding="m" gap="m">
            <ThemedText fontSize={18} fontWeight="700">
              Para excluir sua conta, digite sua senha abaixo:
            </ThemedText>
            <ThemedView
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <TextInput
                placeholder="Senha"
                placeholderTextColor={theme.colors.gray}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  color: theme.colors.black,
                  borderWidth: 1,
                  borderColor: "lightgray",
                  borderRadius: 5,
                  width: 250,
                }}
                secureTextEntry={true}
                value={password}
                onChangeText={(text) => setPassword(text)}
                onSubmitEditing={() =>
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
                returnKeyType="done"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </ThemedView>
          </ThemedView>
          <CustomBottomModal.Action
            text="Confirmar"
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
          />
        </CustomBottomModal.Content>
      </CustomBottomModal.Root>
    </BottomSheetModalProvider>
  );
}
