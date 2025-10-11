import { GeneralStackParamList } from "@custom/types/navigation";
import { createComponentForStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./HomeScreen";
import GeneralScreen from "@screens/GeneralStack/GeneralScreen";

const StackConfig = createNativeStackNavigator<GeneralStackParamList>({
  initialRouteName: "Home",
  screens: {
    Home: HomeScreen,
    GeneralScreen: GeneralScreen,
  },
  screenOptions: {
    headerShown: false,
  },
});

const StackNavigator = createComponentForStaticNavigation(
  StackConfig,
  "General"
);

export default function GeneralStack() {
  return <StackNavigator />;
}
