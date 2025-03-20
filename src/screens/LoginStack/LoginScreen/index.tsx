import { TouchableOpacity } from "react-native";
import ThemedView from "../../../components/ThemedView";
import { useAuth } from "../../../providers/AuthProvider";
import ThemedText from "../../../components/ThemedText";

export default function LoginScreen() {
  const { setSessionUser } = useAuth();

  const handleLogin = () => {
    setSessionUser({
      name: "John Doe",
      role: "admin",
    });
  };

  return (
    <ThemedView flex={1} justifyContent="center" alignItems="center">
      <TouchableOpacity
        style={{
          backgroundColor: "blue",
          paddingVertical: 5,
          paddingHorizontal: 10,
          borderRadius: 5,
        }}
        onPress={handleLogin}
      >
        <ThemedText color="white">Login</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}
