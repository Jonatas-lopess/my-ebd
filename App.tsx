import { ThemeProvider } from "@shopify/restyle";
import { theme } from "./src/theme";
import AuthProvider from "./src/providers/AuthProvider";
import AuthController from "./src/components/AuthController";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <AuthController />
      </AuthProvider>
    </ThemeProvider>
  );
}
