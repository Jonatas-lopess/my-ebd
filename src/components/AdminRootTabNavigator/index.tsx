import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import RegisterStack from "@screens/RegisterStack";
import { AdminRootTabParamList } from "@custom/types/navigation";
import LessonStack from "@screens/LessonStack";
import ClassStack from "@screens/ClassStack";
import GeneralScreen from "@screens/GeneralScreen";

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

            if (route.name === "Lessons") icon = "book";
            if (route.name === "Turmas") icon = "school";
            if (route.name === "Cadastros") icon = "people";
            if (route.name === "Geral") icon = "stats-chart";

            return <Ionicons name={icon} size={size} color={color} />;
          },
        })}
      >
        <Tabs.Screen name="Geral" component={GeneralScreen} />
        <Tabs.Screen
          name="Lessons"
          options={{ title: "Lições" }}
          component={LessonStack}
        />
        <Tabs.Screen name="Turmas" component={ClassStack} />
        <Tabs.Screen name="Cadastros" component={RegisterStack} />
      </Tabs.Group>
    </Tabs.Navigator>
  );
}
