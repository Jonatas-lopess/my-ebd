import { createComponentForStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ClassStackParamList } from "../../types/navigation";
import ClassScreen from "./ClassScreen";
import ClassDetails from "./ClassDetails";
import HistoryScreen from "../StudentStack/HistoryScreen";

const StackConfig = createNativeStackNavigator<ClassStackParamList>({
  initialRouteName: "Class_List",
  screens: {
    Class_List: ClassScreen,
    Class_Details: ClassDetails,
    Class_Details_Student: HistoryScreen,
  },
  screenOptions: {
    headerShown: false,
  },
});

const StackNavigator = createComponentForStaticNavigation(StackConfig, "Class");

export default function ClassStack() {
  return <StackNavigator />;
}
