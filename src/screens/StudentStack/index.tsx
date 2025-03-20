import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StudentScreen from "./StudentScreen";
import HistoryScreen from "./HistoryScreen";
import { StudentStackParamList } from "../../types/navigation";
import { createComponentForStaticNavigation } from "@react-navigation/native";

const StackConfig = createNativeStackNavigator<StudentStackParamList>({
  initialRouteName: "Alunos_Lista",
  screens: {
    Alunos_Lista: StudentScreen,
    Alunos_Historico: HistoryScreen,
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
