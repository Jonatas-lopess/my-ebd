import { createComponentForStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ClassStackParamList } from "@custom/types/navigation";
import ClassScreen from "./ClassScreen";
import ClassDetails from "./ClassDetails";
import HistoryScreen from "../StudentStack/HistoryScreen";

const StackConfig = createNativeStackNavigator<ClassStackParamList>({
  initialRouteName: "ClassList",
  screens: {
    ClassList: ClassScreen,
    ClassDetails: ClassDetails,
    StudentDetails: HistoryScreen,
  },
  screenOptions: {
    headerShown: false,
  },
});

const StackNavigator = createComponentForStaticNavigation(StackConfig, "Class");

export default function ClassStack() {
  return <StackNavigator />;
}
