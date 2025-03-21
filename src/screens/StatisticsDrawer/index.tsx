import { createDrawerNavigator } from "@react-navigation/drawer";
import { StatisticsDrawerParamList } from "../../types/navigation";
import GeneralScreen from "../GeneralScreen";
import { createComponentForStaticNavigation } from "@react-navigation/native";
import CustomSettingsDrawer from "../../components/CustomSettingsDrawer";

const DrawerConfig = createDrawerNavigator<StatisticsDrawerParamList>({
  initialRouteName: "Statistics",
  screens: {
    Statistics: GeneralScreen,
    Settings: () => <></>,
  },
  screenOptions: {
    headerShown: false,
    drawerPosition: "right",
  },
  drawerContent: (props) => (
    <CustomSettingsDrawer {...props}></CustomSettingsDrawer>
  ),
});

const DrawerNavigator = createComponentForStaticNavigation(
  DrawerConfig,
  "Statistics"
);

export default function StatisticsDrawer() {
  return <DrawerNavigator />;
}
