import ThemedText from "@components/ThemedText";

type InfoCardDetailProps = {
  children: React.ReactNode;
};

export default function InfoCardDetail({ children }: InfoCardDetailProps) {
  return (
    <ThemedText variant="body" mr="xs" color="gray">
      {children}
    </ThemedText>
  );
}
