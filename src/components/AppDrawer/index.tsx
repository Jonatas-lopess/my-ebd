import AdminRootTabNavigator from "@components/AdminRootTabNavigator";
import CustomSettingsDrawer from "@components/CustomSettingsDrawer";
import TeacherRootTabNavigator from "@components/TeacherRootTabNavigator";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AppDrawerParamList } from "@custom/types/navigation";
import AccountInfo from "@screens/AccountInfo";
import TeacherAccess from "@screens/TeacherAccess";
import AdminAccess from "@screens/AdminAccess";
import ManageBranch from "@screens/ManageBranch";
import ManageHeadquarter from "@screens/ManageHeadquarter";
import ScoreOptions from "@screens/ScoreOptions";

type AppDrawerProps = {
  renderTab: "admin" | "teacher";
};

const Drawer = createDrawerNavigator<AppDrawerParamList>();

export default function AppDrawer({ renderTab }: AppDrawerProps) {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        drawerPosition: "right",
        drawerStyle: {
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        },
        drawerIcon: ({ color, size }) => {
          let icon: keyof typeof Ionicons.glyphMap | undefined = undefined;

          if (route.name === "Home") icon = "home";

          return icon && <Ionicons name={icon} size={size} color={color} />;
        },
      })}
      drawerContent={(props) => (
        <CustomSettingsDrawer {...props}></CustomSettingsDrawer>
      )}
    >
      <Drawer.Screen
        name="Home"
        component={
          renderTab === "admin"
            ? AdminRootTabNavigator
            : TeacherRootTabNavigator
        }
      />
      <Drawer.Screen name="AccountInfo" component={AccountInfo} />
      <Drawer.Screen name="TeacherAccess" component={TeacherAccess} />
      <Drawer.Screen name="AdminAccess" component={AdminAccess} />
      <Drawer.Screen name="ManageBranch" component={ManageBranch} />
      <Drawer.Screen name="ManageHeadquarter" component={ManageHeadquarter} />
      <Drawer.Screen name="ScoreOptions" component={ScoreOptions} />
    </Drawer.Navigator>
  );
}
