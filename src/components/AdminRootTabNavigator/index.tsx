import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import StudentStack from "@screens/StudentStack";
import { AdminRootTabParamList } from "@custom/types/navigation";
import StatisticsDrawer from "@screens/StatisticsDrawer";
import LessonStack from "@screens/LessonStack";
import ClassStack from "@screens/ClassStack";

const Tabs = createBottomTabNavigator<AdminRootTabParamList>();

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
        <Tabs.Screen name="Inicio" component={LessonStack} />
        <Tabs.Screen name="Turmas" component={ClassStack} />
        <Tabs.Screen name="Cadastros" component={StudentStack} />
        <Tabs.Screen name="Geral" component={StatisticsDrawer} />
      </Tabs.Group>
    </Tabs.Navigator>
  );
}
