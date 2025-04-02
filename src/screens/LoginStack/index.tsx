import { createComponentForStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginStackParamList } from "@custom/types/navigation";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";

const StackConfig = createNativeStackNavigator<LoginStackParamList>({
  initialRouteName: "Login",
  screens: {
    Login: LoginScreen,
    Register: RegisterScreen,
  },
  screenOptions: {
    headerShown: false,
  },
});

const LoginNavigator = createComponentForStaticNavigation(StackConfig, "Login");

export default function LoginStack() {
  return <LoginNavigator />;
}
