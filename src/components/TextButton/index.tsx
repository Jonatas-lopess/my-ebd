import ThemedView from "@components/ThemedView";
import { useTheme } from "@shopify/restyle";
import { ThemeProps } from "@theme";
import { FlexStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

type TextButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "outline" | "solid";
  justifyContent?: FlexStyle["justifyContent"];
  opacity?: number;
  disabled?: boolean;
};

type OutlineStyleType = {
  borderWidth: number;
  borderColor: keyof ThemeProps["colors"];
};

type SolidStyleType = {
  backgroundColor: keyof ThemeProps["colors"];
};

export default function TextButton({
  children,
  onClick = () => {},
  variant = "solid",
  justifyContent = "center",
  opacity = 1,
  disabled = false,
}: TextButtonProps) {
  const theme = useTheme<ThemeProps>();
  const outlineStyles: OutlineStyleType = {
    borderWidth: 1,
    borderColor: "lightgrey",
  };
  const solidStyles: SolidStyleType = {
    backgroundColor: "primary",
  };

  return (
    <TouchableOpacity onPress={onClick} disabled={disabled}>
      <ThemedView
        paddingVertical="xs"
        paddingHorizontal="s"
        flexDirection="row"
        justifyContent={justifyContent}
        opacity={opacity}
        alignItems="center"
        borderRadius={25}
        {...(variant === "solid" ? solidStyles : outlineStyles)}
      >
        {children}
      </ThemedView>
    </TouchableOpacity>
  );
}
