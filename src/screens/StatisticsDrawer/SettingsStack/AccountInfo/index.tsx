import { useNavigation } from "@react-navigation/native";
import ThemedText from "../../../../components/ThemedText";
import ThemedView from "../../../../components/ThemedView";
import { StackHeader } from "../../../../components/StackHeader";

export default function AccountInfo() {
  const navigation = useNavigation();

  return (
    <>
      <StackHeader.Root>
        <StackHeader.Content>
          <StackHeader.Action
            name="arrow-back"
            onPress={() => navigation.goBack()}
          />
          <StackHeader.Title>Dados da Conta</StackHeader.Title>
        </StackHeader.Content>
      </StackHeader.Root>

      <ThemedView flex={1} py="s" gap="s" backgroundColor="lightgrey">
        <ThemedText>Nome:</ThemedText>
      </ThemedView>
    </>
  );
}
