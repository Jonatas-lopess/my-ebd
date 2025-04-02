import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../../providers/AuthProvider";
import LoginStack from "../../screens/LoginStack";
import AdminRootTabNavigator from "../AdminRootTabNavigator";
import TeacherRootTabNavigator from "../TeacherRootTabNavigator";

export default function AuthController() {
  const { authState, loading } = useAuth();

  return loading ? (
    <></>
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
