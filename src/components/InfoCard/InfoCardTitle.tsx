import ThemedText from "@components/ThemedText";

type InfoCardTitleProps = {
  children: React.ReactNode;
};

export default function InfoCardTitle({ children }: InfoCardTitleProps) {
  return (
    <ThemedText variant="h3" mr="xs">
      {children}
    </ThemedText>
  );
}
