import ThemedView from "@components/ThemedView";

type InfoCardContentWrapperProps = {
  children: React.ReactNode;
};

export default function InfoCardContentWrapper({
  children,
}: InfoCardContentWrapperProps) {
  return (
    <ThemedView
      borderTopWidth={1}
      borderColor="lightgrey"
      flexDirection="row"
      justifyContent="space-around"
      pt="s"
    >
      {children}
    </ThemedView>
  );
}
