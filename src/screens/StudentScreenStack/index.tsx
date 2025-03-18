import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import StudentScreen from "./StudentScreen";
import HistoryScreen from "./HistoryScreen";

type StudentScreenStackParamList = {
  Alunos_Lista: undefined;
  Alunos_Historico: { studentId: string };
};

export type StudentStackTypes =
  NativeStackNavigationProp<StudentScreenStackParamList>;

export default function StudentScreenStack() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName="Alunos_Lista">
      <Stack.Screen
        name="Alunos_Lista"
        component={StudentScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Alunos_Historico" component={HistoryScreen} />
    </Stack.Navigator>
  );
}
