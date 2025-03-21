import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RootTabParamList } from "../../types/navigation";
import { Ionicons } from "@expo/vector-icons";

const Tabs = createBottomTabNavigator<RootTabParamList>();

export default function TeacherRootTabNavigator() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let icon: keyof typeof Ionicons.glyphMap = "tablet-landscape-outline";

          if (route.name === "Inicio") icon = "home";
          if (route.name === "Turmas") icon = "school";
          if (route.name === "Cadastros") icon = "people";
          if (route.name === "Geral") icon = "stats-chart";

          return <Ionicons name={icon} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name={"Inicio"} component={() => <></>} />
    </Tabs.Navigator>
  );
}
