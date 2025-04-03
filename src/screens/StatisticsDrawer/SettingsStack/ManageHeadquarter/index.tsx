import { CustomCard } from "@components/CustomCard";
import { StackHeader } from "@components/StackHeader";
import ThemedView from "@components/ThemedView";
import { useNavigation } from "@react-navigation/native";

export default function ManageHeadquarter() {
  const navigation = useNavigation();

  return (
    <>
      <StackHeader.Root>
        <StackHeader.Content>
          <StackHeader.Action
            name="arrow-back"
            onPress={() => navigation.goBack()}
          />
          <StackHeader.Title>Gerenciar Sede</StackHeader.Title>
        </StackHeader.Content>
      </StackHeader.Root>

      <ThemedView flex={1} backgroundColor="lightgrey" py="s" gap="s">
        <CustomCard.Root>
          <CustomCard.Title>Vincule à sua sede</CustomCard.Title>
          <CustomCard.Detail>
            Informe o código abaixo à sua superintendência regional caso queira
            vincular sua filial ao perfil dela. Você receberá uma mensagem de
            confirmação. Clique no campo para copiar o código.
          </CustomCard.Detail>
          <CustomCard.Pressable text="Código" onPress={() => {}} />
        </CustomCard.Root>
      </ThemedView>
    </>
  );
}
