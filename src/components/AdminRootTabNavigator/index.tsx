import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../../screens/HomeScreen";
import { Ionicons } from "@expo/vector-icons";
import StudentStack from "../../screens/StudentStack";
import ClassScreen from "../../screens/ClassStack/ClassScreen";
import { RootTabParamList } from "../../types/navigation";
import GeneralScreen from "../../screens/GeneralScreen";

const Tabs = createBottomTabNavigator<RootTabParamList>();

export default function AdminRootTabNavigator() {
  return (
    <Tabs.Navigator>
      <Tabs.Group
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let icon: keyof typeof Ionicons.glyphMap =
              "tablet-landscape-outline";

            if (route.name === "Inicio") icon = "home";
            if (route.name === "Turmas") icon = "school";
            if (route.name === "Cadastros") icon = "people";
            if (route.name === "Geral") icon = "stats-chart";

            return <Ionicons name={icon} size={size} color={color} />;
          },
        })}
      >
        <Tabs.Screen name="Inicio" component={HomeScreen} />
        <Tabs.Screen name="Turmas" component={ClassScreen} />
        <Tabs.Screen name="Cadastros" component={StudentStack} />
        <Tabs.Screen name="Geral" component={GeneralScreen} />
      </Tabs.Group>
    </Tabs.Navigator>
  );
}
