import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../../providers/AuthProvider";
import LoginStack from "../../screens/LoginStack";
import RootTabNavigator from "../RootTabNavigator";
import { RootStackParamList } from "../../types/navigation";
import { NavigationContainer } from "@react-navigation/native";

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const { user } = useAuth();

  const isLoggedIn = !!user;

  return (
    <NavigationContainer>
      <RootStack.Navigator>
        {isLoggedIn ? (
          <RootStack.Screen
            name="Tab"
            component={RootTabNavigator}
            options={{ headerShown: false }}
          />
        ) : (
          <RootStack.Screen
            name="LoginStack"
            component={LoginStack}
            options={{ headerShown: false }}
          />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
