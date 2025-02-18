import { ThemeProvider } from "@shopify/restyle";
import { theme } from "./src/theme";
import { StatusBar } from "expo-status-bar";
import HomeScreen from "./src/screens/HomeScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStaticNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const MyTabs = createBottomTabNavigator({
  initialRouteName: "Home",
  screens: {
    Home: HomeScreen,
  },
  screenOptions: ({ route }) => ({
    headerShown: false,
    tabBarIcon: ({ color, size }) => {
      let icon: keyof typeof Ionicons.glyphMap = "tablet-landscape-outline";

      if (route.name === "Home") icon = "home";

      return <Ionicons name={icon} size={size} color={color} />;
    },
  }),
});

const TabNavigation = createStaticNavigation(MyTabs);

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <TabNavigation />
      <StatusBar style="light" translucent />
    </ThemeProvider>
  );
}
