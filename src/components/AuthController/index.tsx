import { useAuth } from "@providers/AuthProvider";
import LoginStack from "@screens/LoginStack";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import AppDrawer from "@components/AppDrawer";

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

  if (authState.isLoading) return null;

  if (authState.token === undefined || authState.user === undefined) {
    return <LoginStack />;
  }

  return (
    <AppDrawer
      renderTab={
        authState.user.role === "admin" || authState.user.role === "owner"
          ? "admin"
          : "teacher"
      }
    />
  );
}
