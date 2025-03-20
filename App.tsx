import { ThemeProvider } from "@shopify/restyle";
import { theme } from "./src/theme";
import RootTabNavigator from "./src/components/RootTabNavigator";
import AuthProvider from "./src/providers/AuthProvider";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <RootTabNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}
