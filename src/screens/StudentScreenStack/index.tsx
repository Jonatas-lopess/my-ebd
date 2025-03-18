import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StudentScreen from "./StudentScreen";
import HistoryScreen from "./HistoryScreen";
import { StudentStackParamList } from "../../types/navigation";

export default function StudentScreenStack() {
  const Stack = createNativeStackNavigator<StudentStackParamList>();

  return (
    <Stack.Navigator
      initialRouteName="Alunos_Lista"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Alunos_Lista" component={StudentScreen} />
      <Stack.Screen name="Alunos_Historico" component={HistoryScreen} />
    </Stack.Navigator>
  );
}
