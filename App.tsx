import { ThemeProvider } from "@shopify/restyle";
import { theme } from "./src/theme";
import HomeScreen from "./src/screens/HomeScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStaticNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import StudentScreenStack from "./src/screens/StudentScreenStack";

const Tabs = createBottomTabNavigator({
  initialRouteName: "Inicio",
  screens: {
    Inicio: HomeScreen,
    Alunos: StudentScreenStack,
  },
  screenOptions: ({ route }) => ({
    headerShown: false,
    tabBarIcon: ({ color, size }) => {
      let icon: keyof typeof Ionicons.glyphMap = "tablet-landscape-outline";

      if (route.name === "Inicio") icon = "home";
      if (route.name === "Alunos") icon = "people";

      return <Ionicons name={icon} size={size} color={color} />;
    },
  }),
});

const TabNavigation = createStaticNavigation(Tabs);

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <TabNavigation />
    </ThemeProvider>
  );
}
