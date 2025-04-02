import { createComponentForStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeStackParamList } from "@custom/types/navigation";
import HomeScreen from "./HomeScreen";
import LessonDetails from "./LessonDetails";

const StackConfig = createNativeStackNavigator<HomeStackParamList>({
  initialRouteName: "Lessons_List",
  screens: {
    Lessons_List: HomeScreen,
    Lessons_Details: LessonDetails,
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
