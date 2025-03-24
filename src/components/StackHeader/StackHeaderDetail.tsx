import ThemedText from "../ThemedText";

type StackHeaderDetailProps = {
  children: React.ReactNode;
};

export default function StackHeaderDetail({
  children,
}: StackHeaderDetailProps) {
  return (
    <ThemedText color="gray" fontSize={20}>
      {children}
    </ThemedText>
  );
}
