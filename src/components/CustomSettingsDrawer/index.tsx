import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import ThemedView from "@components/ThemedView";
import { TouchableOpacity } from "react-native";
import ThemedText from "@components/ThemedText";
import { useAuth } from "@providers/AuthProvider";
import { useTheme } from "@shopify/restyle";
import { ThemeProps } from "@theme";
import CustomIcon from "../CustomIcon";

export default function CustomSettingsDrawer(
  props: DrawerContentComponentProps
) {
  const { onLogOut } = useAuth();
  const theme = useTheme<ThemeProps>();

  return (
    <ThemedView flex={1} pb="m">
      <ThemedView
        py="safeArea"
        borderBottomWidth={1}
        borderBottomColor="lightgrey"
      >
        <ThemedText variant="h1" color="primary" textAlign="center">
          Minha EBD
        </ThemedText>
      </ThemedView>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: theme.spacing.m }}
      >
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <TouchableOpacity onPress={onLogOut}>
        <ThemedView
          pl="l"
          py="m"
          flexDirection="row"
          gap="s"
          borderBottomColor="lightgrey"
          borderBottomWidth={1}
          alignItems="center"
        >
          <CustomIcon name="log-out" style={{ color: "dimgrey" }} size={24} />
          <ThemedText style={{ color: "grey" }} fontSize={16} fontWeight="bold">
            Sair
          </ThemedText>
        </ThemedView>
      </TouchableOpacity>
      <ThemedText
        fontWeight="bold"
        style={{ color: "grey" }}
        textAlign="center"
        mt="m"
      >
        Versão: 0.0.1
      </ThemedText>
    </ThemedView>
  );
}
