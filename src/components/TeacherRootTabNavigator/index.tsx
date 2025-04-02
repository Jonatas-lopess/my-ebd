import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TeacherRootTabParamList } from "@custom/types/navigation";
import { Ionicons } from "@expo/vector-icons";
import StudentStack from "@screens/StudentStack";
import StatisticsDrawer from "@screens/StatisticsDrawer";
import LessonStack from "@screens/LessonStack";

const Tabs = createBottomTabNavigator<TeacherRootTabParamList>();

export default function TeacherRootTabNavigator() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let icon: keyof typeof Ionicons.glyphMap = "tablet-landscape-outline";

          if (route.name === "Inicio") icon = "home";
          if (route.name === "Alunos") icon = "school";
          if (route.name === "Geral") icon = "stats-chart";

          return <Ionicons name={icon} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name={"Inicio"} component={LessonStack} />
      <Tabs.Screen name={"Alunos"} component={StudentStack} />
      <Tabs.Screen name={"Geral"} component={StatisticsDrawer} />
    </Tabs.Navigator>
  );
}
