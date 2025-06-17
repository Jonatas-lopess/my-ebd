import ThemedText from "@components/ThemedText";
import ThemedView from "@components/ThemedView";
import { useAuth } from "@providers/AuthProvider";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function RegisterScreen() {
  const { onSignIn } = useAuth();
  const [registerForm, setRegisterForm] = useState({
    email: "",
    password: "",
    name: "",
    isLoading: false,
  });

  async function handleRegister() {
    if (registerForm.isLoading) return;

    if (!registerForm.email || !registerForm.password) {
      return Alert.alert("Please fill in all fields.");
    }

    setRegisterForm({ ...registerForm, isLoading: true });

    await onSignIn({
      email: registerForm.email,
      password: registerForm.password,
      name: registerForm.name,
    });

    setRegisterForm({ ...registerForm, isLoading: false });
  }

  return (
    <ThemedView flex={1} justifyContent="center" alignItems="center" g="s">
      <ThemedView
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        gap="s"
      >
        <ThemedText>Name:</ThemedText>
        <TextInput
          placeholder="Enter your name"
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
        <ThemedText>Email:</ThemedText>
        <TextInput
          placeholder="Enter your email"
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
        <ThemedText>Password:</ThemedText>
        <TextInput
          placeholder="Enter your password"
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
        disabled={registerForm.isLoading}
      >
        {registerForm.isLoading ? (
          <ActivityIndicator color="lightgray" />
        ) : (
          <ThemedText color="white">Login</ThemedText>
        )}
      </TouchableOpacity>
    </ThemedView>
  );
}
