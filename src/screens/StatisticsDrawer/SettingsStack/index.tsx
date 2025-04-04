import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SettingsStackParamList } from "@custom/types/navigation";
import SettingsScreen from "./SettingsScreen";
import AccountInfo from "./AccountInfo";
import { createComponentForStaticNavigation } from "@react-navigation/native";
import SettingsStackLayout from "./layout";
import TeacherAccess from "./TeacherAccess";
import AdminAccess from "./AdminAccess";
import ManageBranch from "./ManageBranch";
import ManageHeadquarter from "./ManageHeadquarter";

const StackConfig = createNativeStackNavigator<SettingsStackParamList>({
  initialRouteName: "SettingsList",
  screens: {
    SettingsList: SettingsScreen,
    AccountInfo: AccountInfo,
    TeacherAccess: TeacherAccess,
    AdminAccess: AdminAccess,
    ManageBranch: ManageBranch,
    ManageHeadquarter: ManageHeadquarter,
  },
  screenOptions: {
    headerShown: false,
  },
  screenLayout: ({ children }) => (
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
