import { ThemeProvider } from "@shopify/restyle";
import { theme } from "./src/theme";
import AuthProvider from "./src/providers/AuthProvider";
import AuthController from "./src/components/AuthController";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <GestureHandlerRootView>
          <AuthController />
        </GestureHandlerRootView>
      </ThemeProvider>
    </AuthProvider>
  );
}
