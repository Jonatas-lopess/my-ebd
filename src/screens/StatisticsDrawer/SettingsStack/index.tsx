import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SettingsStackParamList } from "@custom/types/navigation";
import SettingsScreen from "./SettingsScreen";
import AccountInfo from "./AccountInfo";
import { createComponentForStaticNavigation } from "@react-navigation/native";
import SettingsStackLayout from "./layout";
import TeacherAccess from "./TeacherAccess";
import AdminAccess from "./AdminAccess";

const StackConfig = createNativeStackNavigator<SettingsStackParamList>({
  initialRouteName: "SettingsList",
  screens: {
    SettingsList: SettingsScreen,
    SettingsAccountInfo: AccountInfo,
    SettingsTeacherAccess: TeacherAccess,
    SettingsAdminAccess: AdminAccess,
  },
  screenOptions: {
    headerShown: false,
  },
  layout: ({ children }) => (
    <SettingsStackLayout>{children}</SettingsStackLayout>
  ),
});

const SettingsNavigator = createComponentForStaticNavigation(
  StackConfig,
  "SettingsStack"
);

export default function SettingsStack() {
  return <SettingsNavigator />;
}
