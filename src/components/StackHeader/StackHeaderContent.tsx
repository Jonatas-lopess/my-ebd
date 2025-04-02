import ThemedView from "@components/ThemedView";

type StackHeaderContentProps = {
  children: React.ReactNode;
};

export default function StackHeaderContent({
  children,
}: StackHeaderContentProps) {
  return (
    <ThemedView flexDirection="row" alignItems="center" gap="s">
      {children}
    </ThemedView>
  );
}
