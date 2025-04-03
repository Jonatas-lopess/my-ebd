import ThemedText from "@components/ThemedText";

type CustomCardTitleProps = {
  children: string;
};

export default function CustomCardTitle({ children }: CustomCardTitleProps) {
  return (
    <ThemedText variant="h3" textAlign="center" mr="xs">
      {children}
    </ThemedText>
  );
}
