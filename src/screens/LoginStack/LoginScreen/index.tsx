import { TouchableOpacity } from "react-native";
import ThemedView from "../../../components/ThemedView";
import { useAuth } from "../../../providers/AuthProvider";
import ThemedText from "../../../components/ThemedText";

export default function LoginScreen() {
  const { onLogIn } = useAuth();

  function handleLogin(role: "admin" | "teacher") {
    const email = role === "admin" ? "user1" : "user2";

    onLogIn(email, "password");
  }

  return (
    <ThemedView flex={1} justifyContent="center" alignItems="center" g="s">
      <TouchableOpacity
        style={{
          backgroundColor: "blue",
          paddingVertical: 5,
          paddingHorizontal: 10,
          borderRadius: 5,
        }}
        onPress={() => handleLogin("admin")}
      >
        <ThemedText color="white">Login as admin</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: "blue",
          paddingVertical: 5,
          paddingHorizontal: 10,
          borderRadius: 5,
        }}
        onPress={() => handleLogin("teacher")}
      >
        <ThemedText color="white">Login as teacher</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}
