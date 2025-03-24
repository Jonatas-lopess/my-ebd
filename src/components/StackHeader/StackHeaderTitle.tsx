import ThemedText from "../ThemedText";

type StackHeaderTitleProps = {
  children: React.ReactNode;
};

export default function StackHeaderTitle({ children }: StackHeaderTitleProps) {
  return (
    <ThemedText color="secondary" fontSize={26} fontWeight="bold">
      {children}
    </ThemedText>
  );
}
