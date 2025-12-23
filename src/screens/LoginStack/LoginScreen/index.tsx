import {
  ActivityIndicator,
  Alert,
  Keyboard,
  TextInput,
  TouchableOpacity,
} from "react-native";
import ThemedView from "@components/ThemedView";
import { useAuth } from "@providers/AuthProvider";
import ThemedText from "@components/ThemedText";
import { useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const { onLogIn } = useAuth();
  const navigation = useNavigation();
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    isLoading: false,
  });
  const passwordInputRef = useRef<TextInput>(null);

  async function handleLogin() {
    if (loginForm.isLoading) return;
    Keyboard.dismiss();

    if (!loginForm.email || !loginForm.password) {
      return Alert.alert("Please fill in all fields.");
    }

    setLoginForm({ ...loginForm, isLoading: true });

    await onLogIn(loginForm.email, loginForm.password);

    setLoginForm({ ...loginForm, isLoading: false });
  }

  return (
    <ThemedView flex={1} justifyContent="center" alignItems="center" g="s">
      <ThemedView
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
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
          value={loginForm.email}
          onChangeText={(text) => setLoginForm({ ...loginForm, email: text })}
          onSubmitEditing={() => passwordInputRef.current?.focus()}
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
      >
        <TextInput
          ref={passwordInputRef}
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
          value={loginForm.password}
          onChangeText={(text) =>
            setLoginForm({ ...loginForm, password: text })
          }
          onSubmitEditing={handleLogin}
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
        onPress={handleLogin}
        disabled={loginForm.isLoading}
      >
        {loginForm.isLoading ? (
          <ActivityIndicator color="lightgray" />
        ) : (
          <ThemedText color="white">Entrar</ThemedText>
        )}
      </TouchableOpacity>
      <ThemedText color="gray" mt="m" textAlign="center" fontSize={16}>
        Não tem uma conta?{" "}
        <ThemedText
          color="lightBlue"
          onPress={() => navigation.navigate("Signin", {})}
        >
          Inscreva-se
        </ThemedText>
      </ThemedText>
    </ThemedView>
  );
}
