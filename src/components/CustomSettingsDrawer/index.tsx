import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import ThemedView from "../ThemedView";
import { Pressable } from "react-native";
import ThemedText from "../ThemedText";
import { useAuth } from "../../providers/AuthProvider";

export default function CustomSettingsDrawer(props: any) {
  const { setSessionUser } = useAuth();

  const handleLogout = () => {
    setSessionUser(undefined);
  };

  return (
    <ThemedView flex={1} pb="s">
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <Pressable onPress={handleLogout}>
        <ThemedView
          mx="s"
          px="m"
          py="m"
          backgroundColor="lightgrey"
          borderRadius={25}
        >
          <ThemedText color="black">Sair</ThemedText>
        </ThemedView>
      </Pressable>
    </ThemedView>
  );
}
