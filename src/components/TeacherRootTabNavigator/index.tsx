import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TeacherRootTabParamList } from "../../types/navigation";
import { Ionicons } from "@expo/vector-icons";
import StudentStack from "../../screens/StudentStack";
import HomeScreen from "../../screens/HomeScreen";
import GeneralScreen from "../../screens/GeneralScreen";

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
      <Tabs.Screen name={"Inicio"} component={HomeScreen} />
      <Tabs.Screen name={"Alunos"} component={StudentStack} />
      <Tabs.Screen name={"Geral"} component={GeneralScreen} />
    </Tabs.Navigator>
  );
}
