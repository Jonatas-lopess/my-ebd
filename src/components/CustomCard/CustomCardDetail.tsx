import ThemedText from "@components/ThemedText";

type CustomCardDetailProps = {
  children: string;
};

export default function CustomCardDetail({ children }: CustomCardDetailProps) {
  return (
    <ThemedText color="gray" textAlign="center" mb="s">
      {children}
    </ThemedText>
  );
}
