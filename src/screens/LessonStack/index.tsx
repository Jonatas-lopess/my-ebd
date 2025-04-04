import { createComponentForStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeStackParamList } from "@custom/types/navigation";
import HomeScreen from "./HomeScreen";
import LessonDetails from "./LessonDetails";
import ClassReport from "./ClassReport";

const StackConfig = createNativeStackNavigator<HomeStackParamList>({
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
