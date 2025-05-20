import { useAuth } from "@providers/AuthProvider";
import LoginStack from "@screens/LoginStack";
import AdminRootTabNavigator from "../AdminRootTabNavigator";
import TeacherRootTabNavigator from "../TeacherRootTabNavigator";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function AuthController() {
  const { authState } = useAuth();

  if (authState.isLoading === false) {
    SplashScreen.hideAsync();
  }

  if (authState.token === undefined) {
    return <LoginStack />;
  }

  if (authState.user?.role === "admin") {
    return <AdminRootTabNavigator />;
  }

  return <TeacherRootTabNavigator />;
}
