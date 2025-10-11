import { createComponentForStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LessonStackParamList } from "@custom/types/navigation";
import HomeScreen from "./LessonScreen";
import LessonDetails from "./LessonDetails";
import ClassReport from "./ClassReport";

const StackConfig = createNativeStackNavigator<LessonStackParamList>({
  initialRouteName: "LessonList",
  screens: {
    LessonList: HomeScreen,
    LessonDetails: LessonDetails,
    ClassReport: ClassReport,
  },
  screenOptions: {
    headerShown: false,
  },
});

const StackNavigator = createComponentForStaticNavigation(
  StackConfig,
  "Lesson"
);

export default function LessonStack() {
  return <StackNavigator />;
}
