import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterScreen from "./RegisterScreen";
import HistoryScreen from "./HistoryScreen";
import { RegisterStackParamList } from "@custom/types/navigation";
import { createComponentForStaticNavigation } from "@react-navigation/native";

const StackConfig = createNativeStackNavigator<RegisterStackParamList>({
  initialRouteName: "RegisterList",
  screens: {
    RegisterList: RegisterScreen,
    RegisterHistory: HistoryScreen,
  },
  screenOptions: { headerShown: false },
});

const RegisterNavigator = createComponentForStaticNavigation(
  StackConfig,
  "Alunos"
);

export default function RegisterStack() {
  return <RegisterNavigator />;
}
