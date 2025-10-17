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
          else if (route.name === "AccountInfo") icon = "person";
          else if (route.name === "TeacherAccess") icon = "school";
          else if (route.name === "AdminAccess") icon = "shield-checkmark";
          else if (route.name === "ManageBranch") icon = "business";
          else if (route.name === "ManageHeadquarter") icon = "business-sharp";
          else if (route.name === "ScoreOptions") icon = "stats-chart";

          return icon && <Ionicons name={icon} size={size} color={color} />;
        },
      })}
      drawerContent={(props) => (
        <CustomSettingsDrawer {...props}></CustomSettingsDrawer>
      )}
    >
      <Drawer.Screen
        name="Home"
        options={{ title: "Inicio" }}
        component={
          renderTab === "admin"
            ? AdminRootTabNavigator
            : TeacherRootTabNavigator
        }
      />
      <Drawer.Screen
        name="AccountInfo"
        options={{ title: "Minha Conta" }}
        component={AccountInfo}
      />
      {renderTab === "admin" && (
        <>
          <Drawer.Screen
            name="TeacherAccess"
            options={{ title: "Acesso do Professor" }}
            component={TeacherAccess}
          />
          <Drawer.Screen
            name="AdminAccess"
            options={{ title: "Acesso do Administrador" }}
            component={AdminAccess}
          />
          <Drawer.Screen
            name="ManageBranch"
            options={{ title: "Gerenciar Filial" }}
            component={ManageBranch}
          />
          <Drawer.Screen
            name="ManageHeadquarter"
            options={{ title: "Gerenciar Sede" }}
            component={ManageHeadquarter}
          />
          <Drawer.Screen
            name="ScoreOptions"
            options={{ title: "Opções de Pontuação" }}
            component={ScoreOptions}
          />
        </>
      )}
    </Drawer.Navigator>
  );
}
