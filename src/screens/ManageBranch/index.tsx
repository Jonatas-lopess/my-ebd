import { CustomCard } from "@components/CustomCard";
import CustomTextCard from "@components/CustomTextCard";
import { StackHeader } from "@components/StackHeader";
import ThemedView from "@components/ThemedView";
import { useNavigation } from "@react-navigation/native";

export default function ManageBranch() {
  const navigation = useNavigation();

  return (
    <>
      <StackHeader.Root>
        <StackHeader.Content>
          <StackHeader.Action
            name="arrow-back"
            onPress={() => navigation.goBack()}
          />
          <StackHeader.Title>Gerenciar Filial</StackHeader.Title>
        </StackHeader.Content>
      </StackHeader.Root>

      <ThemedView flex={1} backgroundColor="white" py="s" gap="s">
        <CustomCard.Root>
          <CustomCard.Title>Adicione Novas Igrejas</CustomCard.Title>
          <CustomCard.Detail>
            Clique no botão abaixo para adicionar uma nova igreja como filial
            dentro do seu plano. Ao adicionar uma filial, você terá acesso aos
            relatórios da filial.
          </CustomCard.Detail>
          <CustomTextCard text="Adicionar Filial" onPress={() => {}} />
        </CustomCard.Root>
      </ThemedView>
    </>
  );
}
