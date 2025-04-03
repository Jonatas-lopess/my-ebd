import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StudentScreen from "./StudentScreen";
import HistoryScreen from "./HistoryScreen";
import { StudentStackParamList } from "@custom/types/navigation";
import { createComponentForStaticNavigation } from "@react-navigation/native";

const StackConfig = createNativeStackNavigator<StudentStackParamList>({
  initialRouteName: "RegisterList",
  screens: {
    RegisterList: StudentScreen,
    RegisterHistory: HistoryScreen,
  },
  screenOptions: { headerShown: false },
});

const StudentNavigator = createComponentForStaticNavigation(
  StackConfig,
  "Alunos"
);

export default function StudentStack() {
  return <StudentNavigator />;
}
