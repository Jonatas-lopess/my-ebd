import ThemedText from "@components/ThemedText";
import ThemedView from "@components/ThemedView";

type CustomBottomModalContentProps = {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
};

export default function CustomBottomModalContent({
  children,
  title,
  subtitle,
}: CustomBottomModalContentProps) {
  return (
    <>
      <ThemedText variant="h3" textAlign="center">
        {title}
      </ThemedText>
      {subtitle && (
        <ThemedText color="gray" textAlign="center" mx="s">
          {subtitle}
        </ThemedText>
      )}
      <ThemedView gap="s" my="m" mx="s">
        {children}
      </ThemedView>
    </>
  );
}
