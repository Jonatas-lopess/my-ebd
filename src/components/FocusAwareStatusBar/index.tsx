import { useIsFocused } from "@react-navigation/native";
import { StatusBar, StatusBarProps } from "expo-status-bar";

export default function FocusAwareStatusBar(props: StatusBarProps) {
  const isFocused = useIsFocused();

  return isFocused ? <StatusBar {...props} /> : null;
}
