import { useTheme } from "@shopify/restyle";
import { ThemeProps } from "@theme";
import { FlexStyle } from "react-native";
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";

type TextButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "outline" | "solid";
  justifyContent?: FlexStyle["justifyContent"];
  disabled?: boolean;
};

export default function TextButton({
  children,
  onClick = () => {},
  variant = "solid",
  justifyContent = "center",
  disabled = false,
}: TextButtonProps) {
  const theme = useTheme<ThemeProps>();
  const outlineStyles = {
    borderWidth: 1,
    borderColor: theme.colors.lightgrey,
  };
  const solidStyles = {
    backgroundColor: theme.colors.primary,
  };

  return (
    <GestureHandlerRootView
      style={{
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.s,
        flexDirection: "row",
        justifyContent: justifyContent,
        alignItems: "center",
        borderRadius: 25,
        ...(variant === "solid" ? solidStyles : outlineStyles),
      }}
    >
      <TouchableOpacity onPress={onClick} disabled={disabled}>
        {children}
      </TouchableOpacity>
    </GestureHandlerRootView>
  );
}
