import ThemedView from "../ThemedView";

type StackHeaderActionsProps = {
  children: React.ReactNode;
};

export default function StackHeaderActions({
  children,
}: StackHeaderActionsProps) {
  return (
    <ThemedView flexDirection="row" gap="m">
      {children}
    </ThemedView>
  );
}
