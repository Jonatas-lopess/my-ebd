import { PropsWithChildren } from "react";
import { ViewProps } from "react-native";
import ThemedView from "../ThemedView";

export default function StackHeaderRoot({
  children,
}: PropsWithChildren<ViewProps>) {
  return (
    <ThemedView
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      mt="safeArea"
      py="m"
      mx="s"
    >
      {children}
    </ThemedView>
  );
}
