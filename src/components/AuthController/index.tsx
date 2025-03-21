import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../../providers/AuthProvider";
import LoginStack from "../../screens/LoginStack";
import AdminRootTabNavigator from "../AdminRootTabNavigator";
import TeacherRootTabNavigator from "../TeacherRootTabNavigator";

export default function AuthController() {
  const { user } = useAuth();

  const isLoggedIn = !!user;

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        user.role === "admin" ? (
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
