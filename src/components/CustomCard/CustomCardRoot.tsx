import ThemedView from "@components/ThemedView";

type CustomCardRootProps = {
  children: React.ReactNode;
};

export default function CustomCardRoot({ children }: CustomCardRootProps) {
  return (
    <ThemedView style={{ backgroundColor: "white" }} py="s" px="m">
      {children}
    </ThemedView>
  );
}
