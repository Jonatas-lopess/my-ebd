import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../../screens/HomeScreen";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../providers/AuthProvider";
import StudentStack from "../../screens/StudentStack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../../screens/LoginScreen";

const Tabs = createBottomTabNavigator();

export default function RootTabNavigator() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Tabs.Navigator>
        {user ? (
          <Tabs.Group
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarIcon: ({ color, size }) => {
                let icon: keyof typeof Ionicons.glyphMap =
                  "tablet-landscape-outline";

                if (route.name === "Inicio") icon = "home";
                if (route.name === "Alunos") icon = "people";

                return <Ionicons name={icon} size={size} color={color} />;
              },
            })}
          >
            <Tabs.Screen name="Inicio" component={HomeScreen} />
            <Tabs.Screen name="Alunos" component={StudentStack} />
          </Tabs.Group>
        ) : (
          <Tabs.Screen
            name="Login"
            component={LoginScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="log-in" size={size} color={color} />
              ),
            }}
          />
        )}
      </Tabs.Navigator>
    </NavigationContainer>
  );
}
