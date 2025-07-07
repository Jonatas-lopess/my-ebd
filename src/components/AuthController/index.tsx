import { useAuth } from "@providers/AuthProvider";
import LoginStack from "@screens/LoginStack";
import AdminRootTabNavigator from "../AdminRootTabNavigator";
import TeacherRootTabNavigator from "../TeacherRootTabNavigator";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function AuthController() {
  const { authState } = useAuth();

  useEffect(() => {
    if (authState.isLoading === false) {
      SplashScreen.hideAsync();
    }
  }, [authState.isLoading]);

  if (authState.token === undefined || authState.user === undefined) {
    return <LoginStack />;
  }

  if (authState.user.role === "admin" || authState.user.role === "owner") {
    return <AdminRootTabNavigator />;
  }

  if (authState.user.role === "teacher") {
    return <TeacherRootTabNavigator />;
  }

  return <></>;
}
