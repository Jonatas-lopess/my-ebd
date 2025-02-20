import { Platform, StatusBar } from "react-native";

export const spacing = {
  safeArea: Platform.OS === "android" ? StatusBar.currentHeight! : 0,
  s: 8,
  m: 16,
  l: 24,
  xl: 40,
};
