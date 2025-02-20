import { View } from "react-native";
import style from "./style";

type CustomSafeAreaViewProps = {
  children: React.ReactNode;
};

export default function CustomSafeAreaView({
  children,
}: CustomSafeAreaViewProps) {
  return <View style={style.safeArea}>{children}</View>;
}
