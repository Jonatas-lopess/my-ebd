import { createDrawerNavigator } from "@react-navigation/drawer";
import { StatisticsDrawerParamList } from "@custom/types/navigation";
import GeneralScreen from "./GeneralScreen";
import { createComponentForStaticNavigation } from "@react-navigation/native";
import CustomSettingsDrawer from "@components/CustomSettingsDrawer";
import Ionicons from "@expo/vector-icons/Ionicons";
import SettingsStack from "./SettingsStack";

const DrawerConfig = createDrawerNavigator<StatisticsDrawerParamList>({
  initialRouteName: "Statistics",
  screens: {
    Statistics: {
      screen: GeneralScreen,
      options: {
        title: "Estatísticas",
      },
    },
    Settings: {
      screen: SettingsStack,
      options: {
        title: "Configurações",
      },
    },
  },
  screenOptions: ({ route }) => ({
    headerShown: false,
    drawerPosition: "right",
    drawerStyle: {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    },
    drawerIcon: ({ color, size }) => {
      let icon: keyof typeof Ionicons.glyphMap | undefined = undefined;

      if (route.name === "Settings") icon = "settings";
      if (route.name === "Statistics") icon = "analytics";

      return icon && <Ionicons name={icon} size={size} color={color} />;
    },
  }),
  backBehavior: "initialRoute",
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
