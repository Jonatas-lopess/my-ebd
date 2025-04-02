import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../../providers/AuthProvider";
import LoginStack from "../../screens/LoginStack";
import AdminRootTabNavigator from "../AdminRootTabNavigator";
import TeacherRootTabNavigator from "../TeacherRootTabNavigator";
import { Text, View } from "react-native";

export default function AuthController() {
  const { authState, loading } = useAuth();

  return loading ? (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Text style={{ textAlign: "center" }}>Carregando...</Text>
    </View>
  ) : (
    <NavigationContainer>
      {authState ? (
        authState.user.role === "admin" ? (
          <AdminRootTabNavigator />
        ) : (
          <TeacherRootTabNavigator />
        )
      ) : (
        <LoginStack />
      )}
    </NavigationContainer>
  );
}
