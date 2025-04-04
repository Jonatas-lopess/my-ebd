import ThemedView from "@components/ThemedView";

type CustomCardRootProps = {
  children: React.ReactNode;
  borderRadius?: number;
};

export default function CustomCardRoot({
  children,
  borderRadius,
}: CustomCardRootProps) {
  return (
    <ThemedView
      style={{ backgroundColor: "white" }}
      py="s"
      px="m"
      borderRadius={borderRadius}
    >
      {children}
    </ThemedView>
  );
}
