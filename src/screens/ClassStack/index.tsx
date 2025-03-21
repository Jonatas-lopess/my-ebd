import { createComponentForStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ClassStackParamList } from "../../types/navigation";
import ClassScreen from "./ClassScreen";

const StackConfig = createNativeStackNavigator<ClassStackParamList>({
  initialRouteName: "Class_List",
  screens: {
    Class_List: ClassScreen,
    Class_Details: () => <></>,
  },
  screenOptions: {
    headerShown: false,
  },
});

const StackNavigator = createComponentForStaticNavigation(StackConfig, "Class");

export default function ClassStack() {
  return <StackNavigator />;
}
