import { ThemeProvider } from "@shopify/restyle";
import { theme } from "./src/theme";
import AuthProvider from "./src/providers/AuthProvider";
import AuthController from "./src/components/AuthController";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <GestureHandlerRootView>
            <AuthController />
          </GestureHandlerRootView>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
