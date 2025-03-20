import { ThemeProvider } from "@shopify/restyle";
import { theme } from "./src/theme";
import AuthProvider from "./src/providers/AuthProvider";
import RootStackNavigator from "./src/components/RootStackNavigator";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <RootStackNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}
