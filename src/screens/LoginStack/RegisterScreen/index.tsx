import ThemedText from "@components/ThemedText";
import ThemedView from "@components/ThemedView";
import { LoginStackParamList } from "@custom/types/navigation";
import { useAuth } from "@providers/AuthProvider";
import { useNavigation } from "@react-navigation/native";
import { SignInData } from "@services/AuthService";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function RegisterScreen({
  code,
}: LoginStackParamList["Signin"]) {
  const { onSignIn } = useAuth();
  const navigation = useNavigation();
  const [registerForm, setRegisterForm] = useState<SignInData>({
    code: code ?? "",
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  async function handleRegister() {
    if (isLoading) return;

    if (
      !registerForm.email ||
      !registerForm.password ||
      !registerForm.code ||
      !registerForm.name
    ) {
      return Alert.alert("Por favor, preencha todos os campos.");
    }

    setIsLoading(true);

    await onSignIn(registerForm);

    setIsLoading(false);
  }

  return (
    <ThemedView flex={1} justifyContent="center" alignItems="center" g="s">
      <ThemedView
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        gap="s"
      >
        <TextInput
          placeholder="Código de Registro"
          style={{
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderWidth: 1,
            borderColor: "lightgray",
            borderRadius: 5,
            width: 250,
          }}
          value={registerForm.code}
          onChangeText={(text) =>
            setRegisterForm({ ...registerForm, code: text })
          }
          onSubmitEditing={() => {}}
          editable={code === undefined}
          selectTextOnFocus={code === undefined}
        />
      </ThemedView>
      <ThemedView
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        gap="s"
      >
        <TextInput
          placeholder="Nome"
          style={{
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderWidth: 1,
            borderColor: "lightgray",
            borderRadius: 5,
            width: 250,
          }}
          value={registerForm.name}
          onChangeText={(text) =>
            setRegisterForm({ ...registerForm, name: text })
          }
          onSubmitEditing={() => {}}
        />
      </ThemedView>
      <ThemedView
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        gap="s"
      >
        <TextInput
          placeholder="Email"
          style={{
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderWidth: 1,
            borderColor: "lightgray",
            borderRadius: 5,
            width: 250,
          }}
          value={registerForm.email}
          onChangeText={(text) =>
            setRegisterForm({ ...registerForm, email: text })
          }
          onSubmitEditing={() => {}}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
        />
      </ThemedView>
      <ThemedView
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        gap="s"
      >
        <TextInput
          placeholder="Senha"
          style={{
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderWidth: 1,
            borderColor: "lightgray",
            borderRadius: 5,
            width: 250,
          }}
          secureTextEntry={true}
          value={registerForm.password}
          onChangeText={(text: string) =>
            setRegisterForm({ ...registerForm, password: text })
          }
          onSubmitEditing={handleRegister}
          returnKeyType="done"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </ThemedView>
      <TouchableOpacity
        style={{
          backgroundColor: "blue",
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 5,
          alignItems: "center",
        }}
        onPress={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="lightgray" />
        ) : (
          <ThemedText color="white">Registrar</ThemedText>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <ThemedText color="gray">
          Já tem uma conta?{" "}
          <ThemedText color="lightBlue" fontWeight="bold">
            Clique aqui
          </ThemedText>
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}
