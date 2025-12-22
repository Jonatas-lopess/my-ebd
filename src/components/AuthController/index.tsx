import { useAuth } from "@providers/AuthProvider";
import LoginStack from "@screens/LoginStack";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import AppDrawer from "@components/AppDrawer";
import { useFirstTimeOpen } from "utils/useFirstTimeOpen";

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function AuthController() {
  const { authState } = useAuth();
  const { isFirstTime, isLoading: isFirstTimeLoading } = useFirstTimeOpen();

  useEffect(() => {
    if (!authState.isLoading || !isFirstTimeLoading) {
      SplashScreen.hideAsync();
    }
  }, [authState.isLoading, isFirstTimeLoading]);

  if (authState.isLoading || isFirstTimeLoading) return null;

  if (authState.token === undefined || authState.user === undefined) {
    return <LoginStack isFirstTime={isFirstTime} />;
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
