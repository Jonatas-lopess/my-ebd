import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginStackParamList } from "@custom/types/navigation";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import IntroScreen from "./IntroScreen";
import PlanScreen from "./PlanScreen";

type Props = {
  isFirstTime: boolean;
};

const Stack = createNativeStackNavigator<LoginStackParamList>();

export default function LoginStack({ isFirstTime }: Props) {
  return (
    <Stack.Navigator
      initialRouteName={isFirstTime ? "IntroScreen" : "Login"}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="IntroScreen" component={IntroScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="PlanScreen" component={PlanScreen} />
      <Stack.Screen name="Signin" component={RegisterScreen} />
    </Stack.Navigator>
  );
}
